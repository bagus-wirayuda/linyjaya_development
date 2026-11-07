import urllib.request,re,pathlib
url='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&display=swap'
req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
css=urllib.request.urlopen(req,timeout=30).read().decode()
urls=re.findall(r'url\((https://[^)]+)\)',css)
data=urllib.request.urlopen(urls[-1],timeout=30).read()
p=pathlib.Path('assets/fonts/jakarta.woff2')
p.write_bytes(data)
print('Font',len(data),data[:4])
license_url='https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/OFL.txt'
pathlib.Path('assets/fonts/OFL.txt').write_bytes(urllib.request.urlopen(license_url,timeout=30).read())
