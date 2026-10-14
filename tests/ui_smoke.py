"""Real Chromium UI checks with the portable edition, no network navigation.
This environment blocks URL navigation. The only shim is in-memory localStorage;
engine.test.cjs independently covers save round-trips and corrupt-save rejection.
"""
from pathlib import Path
import os
import shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'dist'/'Bramblehaven.html').read_text()
OUT=ROOT/'dist';OUT.mkdir(exist_ok=True)
shim='<script>Object.defineProperty(window,"localStorage",{value:(()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}})()});</script>'
html=html.replace('<head>','<head>'+shim)
with sync_playwright() as p:
    binary=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
    browser=p.chromium.launch(**({'executable_path':binary} if binary else {}),headless=True,args=['--no-sandbox'])
    for width,height in [(390,844),(360,740),(1440,960),(844,390)]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
        page.set_content(html,wait_until='load');page.wait_for_timeout(250)
        assert page.locator('.intro h1').is_visible()
        page.locator('[data-action=start]').click();page.wait_for_timeout(200)
        assert page.evaluate('BH.game.s.started')
        if width==390: page.screenshot(path=str(OUT/'Bramblehaven-mobile-town.png'))
        for tab in ['build','guild','explore','journal','town']:
            page.locator(f'[data-action=tab][data-id={tab}]').click()
            assert page.locator('.panel-heading').is_visible()
        page.locator('[data-action=tab][data-id=build]').click()
        page.locator('[data-action=blueprint][data-id=lumber]').click()
        def tile(x,y):
            rect=page.locator('#world').bounding_box();z=max(.65,min(1.55,rect['width']/590))
            page.mouse.click(rect['x']+rect['width']/2+(x-y)*32*z,rect['y']+rect['height']*.56+((x+y)*16-275)*z)
        tile(10,8)
        assert page.evaluate('BH.game.count("lumber")')==1
        assert page.evaluate('BH.game.s.r.gold')<400
        page.locator('[data-action=cancelbuild]').click()
        page.locator('[data-action=tab][data-id=town]').click()
        page.locator('[data-action=claimchapter]').click()
        assert page.evaluate('BH.game.s.chapter')==1
        page.locator('[data-action=tab][data-id=explore]').click()
        page.locator('.route-body [data-action=plan][data-id="0"]').click()
        assert page.locator('.party-option.selected').count()==1
        assert page.locator('[data-action=launch]').is_enabled()
        page.locator('[data-action=launch]').click()
        assert page.evaluate('BH.game.s.missions.length')==1
        page.evaluate('BH.game.tick(45)');page.wait_for_timeout(1100)
        assert page.evaluate('BH.game.s.stats.wins')==1
        page.locator('[data-action=report]').click()
        assert page.locator('.report-text').is_visible()
        if width==390:page.screenshot(path=str(OUT/'Bramblehaven-mobile-report.png'))
        page.locator('[data-action=ackreport]').click()
        assert page.evaluate('BH.game.s.missions.length')==0
        page.locator('.settings-button').click()
        page.locator('[data-action=copybackup]').click()
        text=page.locator('#backup-text').input_value()
        assert 'bramblehaven' in text and 'checksum' in text
        page.locator('[data-action=close]').click()
        for section in ['charter','relics','combos','achievements','chronicle']:
            page.locator('[data-action=tab][data-id=journal]').click()
            page.locator(f'[data-action=journaltab][data-id={section}]').click()
            assert page.locator('.panel-heading').is_visible()
        page.evaluate('BH.game.s.fame=7000; for(const k of Object.keys(BH.game.s.r)) BH.game.s.r[k]=5000')
        page.locator('[data-action=tab][data-id=guild]').click()
        page.locator('[data-action=recruit][data-id=ada]').click()
        assert page.evaluate('BH.game.s.heroes.length')==2
        page.locator('[data-action=guildtab][data-id=research]').click()
        page.locator('[data-action=research][data-id=axes]').click()
        assert page.evaluate('BH.game.has("axes")')
        page.locator('[data-action=tab][data-id=build]').click()
        if width==390:page.screenshot(path=str(OUT/'Bramblehaven-mobile-build.png'))
        overflow=page.evaluate('document.documentElement.scrollWidth>window.innerWidth')
        assert not overflow, f'Horizontal overflow at {width}'
        assert not errors,errors
        print(f'PASS {width}x{height}: title, navigation, actual map placement, chapter, expedition, report, save export, all journal pages, recruit, research, no JS errors/overflow')
        page.close()
    browser.close()
