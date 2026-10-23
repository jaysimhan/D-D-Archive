"""Extract sections from official SRD PDFs using heading styles, not name guesses.
Run after extracting line metadata into tmp/edition-research/lines-2024.json.
Original PDF reading order is retained (two columns, then the next page).
"""
import json,re
from pathlib import Path
root=Path('tmp/edition-research')
pages=json.loads((root/'lines-2024.json').read_text())
def clean(lines):
 text='\n'.join(l['text'] for l in lines)
 text=re.sub(r'(\w)[\-\u00ad]\n(?=[a-z])',r'\1',text)
 text=text.replace('\u00ad','').replace('\u00a0',' ')
 return text.strip()
def sections(start,end,magic=False):
 result=[]; active=None
 for page in range(start-1,end):
  for l in pages[page]:
   if l['y']>730:continue
   if l['size']>=12 and (not magic or (l['size']==12 and l['text'] not in ['Traits','Actions','Bonus Actions','Reactions'])):
    if active and not active['lines'] and l['size']==12:
     active['name']+=' '+l['text'];continue
    if active:active['description']=clean(active.pop('lines'));result.append(active);active=None
    if l['size']==12:active={'name':l['text'],'page':page+1,'lines':[]}
   elif active:active['lines'].append(l)
 if active:active['description']=clean(active.pop('lines'));result.append(active)
 return result
magic=sections(209,253,True)
gear=sections(93,100)
feats=sections(87,88)
origins=sections(83,86)
classes={}; current=None; active=None
for page in range(27,82):
 for l in pages[page]:
  if l['y']>730:continue
  if l['size']>=14 or (l['size']==12 and l['text'].startswith('Level ')):
   if active:
    active['description']=clean(active.pop('lines'));classes[current].append(active);active=None
   if l['size']==18:
    current=l['text'].lower();classes.setdefault(current,[])
   if l['size']==14 and 'Subclass:' in l['text']:current=None
   m=re.match(r'Level (\d+): (.+)',l['text'])
   if m and current:active={'name':m[2],'level':int(m[1]),'page':page+1,'lines':[]}
  elif active:active['lines'].append(l)
if active:active['description']=clean(active.pop('lines'));classes[current].append(active)
# The Elven Lineages table is printed at the bottom of the Goliath page.
elf=next(s for s in origins if s['name']=='Elf')
goliath=next(s for s in origins if s['name']=='Goliath')
if 'Elven Lineages\n' in goliath['description']:
 body,table=goliath['description'].split('Elven Lineages\n',1)
 goliath['description']=body.strip()
 elf['description']+='\n\nElven Lineages\n'+table
result={'magicItems':magic,'equipment':gear,'feats':feats,'origins':origins,'classes':classes}
(root/'srd-2024-sections.json').write_text(json.dumps(result,indent=2))
print({k:len(v) for k,v in result.items()})
print('classes',[(k,len(v)) for k,v in classes.items()])
print('equipment',[s['name'] for s in gear])
