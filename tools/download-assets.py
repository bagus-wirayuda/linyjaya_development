import urllib.request, concurrent.futures, pathlib
assets={'hero':'photo-1600585154340-be6161a56a0c','house-1':'photo-1600585154340-be6161a56a0c','house-2':'photo-1600607687920-4e2a09cf159d','house-3':'photo-1600047509807-ba8f99d2cdde','interior':'photo-1600210492486-724fe5c67fb0','construction':'photo-1504307651254-35680f356dfd','neighborhood':'photo-1564013799919-ab600027ffc6'}
def fetch(item):
 name,pid=item
 url=f'https://images.unsplash.com/{pid}?auto=format&fit=crop&w={1920 if name=="hero" else 1000}&q=85'
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 data=urllib.request.urlopen(req,timeout=40).read()
 pathlib.Path('assets/images/'+name+'.jpg').write_bytes(data)
 return name,len(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:
 for r in pool.map(fetch,assets.items()):print(r)
print('For the variable font, run python tools/download-font.py')
