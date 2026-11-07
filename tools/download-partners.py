import urllib.request, concurrent.futures,pathlib
logos={
'wika.png':'https://www.wika.co.id/assets/img/logo-wika-head-blue.png',
'pp.webp':'https://www.ptpp.co.id/_nuxt/img/site-logo.0b5b997.webp',
'sig.png':'https://www.sig.id/themes/sig/images/logo-black.png',
'bsi.svg':'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg'
}
def fetch(item):
 name,url=item
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':url.split('/img')[0]})
  data=urllib.request.urlopen(req,timeout=30).read()
  pathlib.Path('assets/partners/'+name).write_bytes(data)
  return name,len(data)
 except Exception as e:return name,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for r in pool.map(fetch,logos.items()):print(r)
