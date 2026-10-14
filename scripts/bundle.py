#!/usr/bin/env python3
"""Create a portable, dependency-free HTML edition from the same shipped sources."""
from pathlib import Path
import base64
import re
import sys
ROOT=Path(__file__).resolve().parents[1]
web=ROOT/'web'
html=(web/'index.html').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+(web/'style.css').read_text(encoding='utf-8')+'\n</style>')
html=re.sub(r'<link rel="manifest"[^>]*>','',html)
icon='data:image/svg+xml;base64,'+base64.b64encode((web/'icon.svg').read_bytes()).decode()
html=html.replace('href="icon.svg"','href="'+icon+'"')
for name in ('content.js','engine.js','art.js','app.js'):
    script=(web/name).read_text(encoding='utf-8').replace('</script','<\\/script')
    html=html.replace('<script src="'+name+'"></script>','<script>\n'+script+'\n</script>')
output=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'dist'/'Bramblehaven.html'
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(html,encoding='utf-8')
print(f'{output}: {len(html):,} characters')
