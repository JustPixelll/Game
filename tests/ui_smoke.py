"""Chromium interaction tests. Uses set_content and an in-memory localStorage shim.
No physical-device or browser-restart persistence claim is made by this suite.
Functional fixtures are separate from the ordinary-action campaign simulation.
"""
from pathlib import Path
import base64
import json
import os
import shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'
HTML=(OUT/'Bramblehaven.html').read_text()
SAVE_KEY='bramblehaven.save.v1'
V1=(ROOT/'tests/fixtures/v1-completed.json').read_text()

def document(initial=None):
    values=json.dumps(initial or {})
    shim=f'<script>Object.defineProperty(window,"localStorage",{{value:(()=>{{const m=new Map(Object.entries({values}));return {{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}}}})()}});</script>'
    return HTML.replace('<head>','<head>'+shim)

with sync_playwright() as p:
    binary=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
    browser=p.chromium.launch(**({'executable_path':binary} if binary else {}),headless=True,args=['--no-sandbox'])
    for width,height in ([] if os.environ.get('MIGRATION_ONLY') else [(390,844)] if os.environ.get('QUICK_UI') else [(390,844),(360,740),(1440,960),(844,390),(1340,1000)]):
        pg=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        errors=[]
        pg.on('pageerror',lambda e:errors.append(str(e)))
        pg.set_content(document(),wait_until='load')
        pg.locator('[data-action=start]').click()
        assert pg.evaluate('BH.version')=='2.0.0'
        # Pause lets resource-change assertions test the exact action, not a running timer.
        pg.locator('#speed').click()
        assert pg.evaluate('BH.game.s.settings.speed')==0
        for _ in range(4):
            pg.locator('#speed').click()
            assert pg.evaluate('BH.game.s.settings.speed') in [0,1]
        assert pg.evaluate('BH.game.s.settings.speed')==0
        for tab in ['build','guild','explore','journal','town']:
            pg.locator(f'[data-action=tab][data-id={tab}]').click()
            assert pg.locator('.panel-heading').is_visible()
        pg.locator('[data-action=tab][data-id=build]').click()
        pg.locator('[data-action=blueprint][data-id=lumber]').click()
        assert pg.evaluate('BH.renderer.planning')
        old=pg.evaluate('JSON.stringify(BH.game.s.r)')
        def tile(x,y):
            point=pg.evaluate('''([x,y])=>{const r=BH.renderer,b=r.canvas.getBoundingClientRect(),p=r.project(x,y);return {x:b.x+r.w/2+r.pan.x+p.x*r.zoom,y:b.y+r.h*.56+r.pan.y+(p.y-275)*r.zoom};}''',[x,y])
            pg.mouse.click(point['x'],point['y'])
        tile(9,8)
        assert pg.evaluate('BH.game.count("lumber")')==0
        assert pg.evaluate('JSON.stringify(BH.game.s.r)')==old
        assert pg.locator('.planner-card').is_visible()
        assert pg.locator('.planner-card').inner_text().find('Connected')!=-1
        # The compact map button remains accessible even when the panel is scrolled.
        pg.locator('#placement [data-action=confirmplot]').click()
        assert pg.evaluate('BH.game.count("lumber")')==1
        assert abs(pg.evaluate('BH.game.s.r.gold')-(json.loads(old)['gold']-75))<1e-6
        assert pg.locator('#placement [data-action=confirmplot]').is_disabled()
        tile(8,8)
        assert pg.locator('#placement [data-action=confirmplot]').is_disabled()
        assert 'Occupied' in pg.locator('.planner-card').inner_text()
        # Nudge changes the reversible draft, not the world.
        pg.locator('.plot-nudge [data-id="0,-1"]').click()
        assert pg.evaluate('BH.ui.draft.y')==7
        assert pg.evaluate('BH.game.count("lumber")')==1
        # Drag is never interpreted as a tap/build.
        canvas=pg.locator('#world').bounding_box()
        x=canvas['x']+canvas['width']*.5;y=canvas['y']+canvas['height']*.5
        before=pg.evaluate('JSON.stringify(BH.ui.draft)')
        pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x+32,y+21,steps=5);pg.mouse.up()
        assert pg.evaluate('JSON.stringify(BH.ui.draft)')==before
        pg.locator('#placement [data-action=cancelbuild]').click()
        assert pg.evaluate('!BH.ui.blueprint&&!BH.ui.moving')
        pg.locator('[data-action=planview]').click()
        assert pg.evaluate('BH.renderer.planning')
        pg.locator('[data-action=planview]').click()
        pg.locator('[data-action=center]').click()
        if width==1340:
            pg.locator('[data-action=tab][data-id=build]').click()
            pg.locator('[data-action=blueprint][data-id=farm]').click();tile(9,9)
            pg.screenshot(path=str(OUT/'Bramblehaven-v2-planner.png'))
            pg.locator('#placement [data-action=cancelbuild]').click()
        # A proper sprite hit test selects a building rather than a plot behind its roof.
        pos=pg.evaluate('''()=>{const r=BH.renderer,b=r.canvas.getBoundingClientRect(),q=r.project(9,8);return {x:b.x+r.w/2+r.pan.x+q.x*r.zoom,y:b.y+r.h*.56+r.pan.y+(q.y-275-12)*r.zoom};}''')
        pg.mouse.click(pos['x'],pos['y'])
        assert pg.locator('.modal').is_visible()
        pg.locator('[data-action=close]').first.click()
        pg.locator('[data-action=tab][data-id=town]').click()
        pg.locator('[data-action=claimchapter]').first.click()
        assert pg.evaluate('BH.game.s.chapter')==1
        pg.locator('[data-action=tab][data-id=explore]').click()
        pg.locator('[data-action=plan][data-id="0"]').first.click()
        assert pg.locator('[data-action=launch]').is_enabled()
        pg.locator('[data-action=mode][data-id=bold]').click()
        assert pg.locator('[data-action=launch]').is_disabled()
        assert 'Bold requires' in pg.locator('.modal').inner_text()
        pg.locator('[data-action=mode][data-id=steady]').click()
        pg.locator('[data-action=supply][data-id=stocked]').click()
        assert pg.locator('[data-action=launch]').is_enabled()
        pg.locator('[data-action=launch]').click()
        assert pg.evaluate('BH.game.s.missions.length')==1
        pg.evaluate('BH.game.tick(49)')
        # Explicit navigation refreshes paused UI.
        pg.locator('[data-action=tab][data-id=town]').click()
        pg.locator('[data-action=tab][data-id=explore]').click()
        assert pg.evaluate('BH.game.s.stats.wins')==1
        pg.locator('[data-action=report]').first.click()
        assert pg.locator('.report-text').is_visible()
        pg.locator('[data-action=ackreport]').click()
        for section in ['charter','relics','combos','achievements','chronicle']:
            pg.locator('[data-action=tab][data-id=journal]').click()
            pg.locator(f'[data-action=journaltab][data-id={section}]').click()
        pg.locator('.settings-button').click()
        pg.locator('[data-action=copybackup]').click()
        assert json.loads(pg.locator('#backup-text').input_value())['game']=='bramblehaven'
        pg.locator('[data-action=close]').first.click()
        # Test modal controls with a functional fixture; not used for balance claims.
        pg.evaluate('''()=>{const g=BH.game;g.s.fame=5000;g.s.regionProgress[0]=4;for(const k in g.s.r)g.s.r[k]=5000;g.build('path',9,9);g.build('path',9,10);g.build('library',10,9);g.build('smith',10,10);g.recruit('ada');g.s.heroes[0].gear=1;g.s.heroes[0].condition=50;g.s.heroes[0].rest=0;}''')
        pg.locator('[data-action=tab][data-id=guild]').click()
        pg.locator('[data-action=repair][data-id=rowan]').click()
        assert pg.evaluate('BH.game.s.heroes[0].condition')==100
        pg.locator('[data-action=guildtab][data-id=research]').click()
        pg.locator('[data-action=research][data-id=axes]').click()
        assert pg.evaluate('BH.game.has("axes")')
        pg.locator('[data-action=tab][data-id=town]').click()
        pg.locator('[data-action=economy]').first.click()
        pg.locator('[data-action=reserve][data-id="60"]').click()
        assert pg.evaluate('BH.game.s.foodReserve')==60
        pg.locator('[data-action=inspect]').last.click()
        pg.locator('[data-action=priority][data-id="2"]').click()
        assert pg.evaluate('BH.game.s.buildings.find(b=>b.id===BH.ui.modal.id).priority')==2
        pg.locator('[data-action=close]').first.click()
        assert not pg.evaluate('document.documentElement.scrollWidth>window.innerWidth')
        assert not errors,errors
        print(f'PASS {width}x{height}: no fast-forward; reversible placement; confirmation; nudge; drag safety; plan toggle; sprite picking; chapter; preparation; expedition; report; journal; save; repairs; research; reserve; priority; no JS errors/overflow')
        pg.close()
    # Upgrade compatibility, archive-before-reset, and deliberate restore.
    pg=browser.new_page(viewport={'width':1100,'height':850});pg.set_default_timeout(7000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.set_content(document({SAVE_KEY:V1}),wait_until='load')
    pg.locator('[data-action=start]').click()
    assert pg.evaluate('BH.game.s.version')==2
    assert pg.evaluate('BH.game.s.settings.speed')==1
    assert pg.evaluate('localStorage.getItem("bramblehaven.save.v1.v1-original")')==V1
    assert 'frontier has changed' in pg.locator('.modal').inner_text()
    pg.locator('[data-action=reset]').click()
    pg.locator('#reset-confirm').fill('NEW');pg.locator('[data-action=confirmreset]').click()
    assert pg.evaluate('BH.ui.intro')
    pg.locator('#start-name').fill('Fresh Frontier');pg.locator('[data-action=start]').click()
    assert pg.evaluate('BH.game.s.chapter')==0
    assert pg.locator('.modal').count()==0
    assert pg.evaluate('BH.game.s.name')=='Fresh Frontier'
    pg.locator('.settings-button').click();pg.locator('[data-action=archives]').click()
    assert pg.locator('[data-action=restorearchive]').count()==2
    pg.locator('[data-action=restorearchive][data-id="v1-original"]').click()
    assert pg.evaluate('BH.game.s.name')=='Fresh Frontier'
    pg.locator('[data-action=confirmimport]').click()
    assert pg.evaluate('BH.game.s.name')=='v1 migration fixture'
    assert pg.evaluate('BH.game.s.chapter')==15
    assert pg.evaluate('Object.keys(BH.game.s.relics).length')==21
    assert pg.evaluate('localStorage.getItem("bramblehaven.save.v1.v1-original")')==V1
    # A bad import leaves active data alone and never reaches confirmation.
    before=pg.evaluate('BH.game.s.name')
    pg.evaluate('BH.receiveImportBase64(btoa("invalid"))')
    assert pg.evaluate('BH.game.s.name')==before
    assert not errors,errors
    print('PASS v1 migration: stock/progress retained; 4x -> normal; untouched original snapshot; fresh-start retirement; confirmation-before-restore; invalid import leaves town intact')
    pg.close()
    browser.close()
