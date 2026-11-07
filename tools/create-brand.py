from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
font=TTFont('assets/fonts/jakarta.woff2')
if 'fvar' in font:font=instantiateVariableFont(font,{'wght':700},inplace=False)
glyphs=font.getGlyphSet();cmap=font.getBestCmap();units=font['head'].unitsPerEm
mark='''<defs><linearGradient id="royal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e7bfa"/><stop offset="1" stop-color="#1244c9"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#royal)"/><path d="m15 23 17-11 17 11" fill="none" stroke="#badaff" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 29v21h15v-6h-9V29Z" fill="white"/><path d="M34 29h14v12c0 6-4 10-10 10h-3v-6h3c3 0 4-1 4-4v-6h-8Z" fill="#badaff"/>'''
mono=mark[mark.index('<rect'):].replace('fill="url(#royal)"','fill="white"').replace('#badaff','#1857e8').replace('fill="white"/>','fill="#1857e8"/>',1)
# Explicit monochrome symbol, preserving a white field for use on navy.
mono='''<rect width="64" height="64" rx="18" fill="white"/><path d="m15 23 17-11 17 11" fill="none" stroke="#1857e8" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 29v21h15v-6h-9V29ZM34 29h14v12c0 6-4 10-10 10h-3v-6h3c3 0 4-1 4-4v-6h-8Z" fill="#1857e8"/>'''
def outline(text,x,y,size,color,spacing=0):
 out=[];scale=size/units
 for char in text:
  gname=cmap.get(ord(char),'space');g=glyphs[gname];pen=SVGPathPen(glyphs);g.draw(pen)
  out.append(f'<path transform="translate({x:.3f} {y}) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}" fill="{color}"/>')
  x+=g.width*scale+spacing
 return ''.join(out)
def svg(body,box,title):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-label="{title}">{body}</svg>'
Path('assets/logo.svg').write_text(svg(mark,'0 0 64 64','LinyJaya — monogram LJ'),encoding='utf-8')
Path('assets/brand/linyjaya-mark.svg').write_text(svg(mark,'0 0 64 64','LinyJaya — monogram LJ'),encoding='utf-8')
Path('assets/brand/favicon.svg').write_text(svg(mark,'0 0 64 64','LinyJaya'),encoding='utf-8')
for name,light in [('linyjaya-logo',False),('linyjaya-logo-white',True)]:
 body='<g transform="translate(4 4)">'+(mono if light else mark)+'</g>'+outline('LinyJaya',84,43,31,'#ffffff' if light else '#142b49')+outline('DEVELOPMENT',85,61,8.2,'#b9cff3' if light else '#6c819f',2.35)
 Path('assets/brand/'+name+'.svg').write_text(svg(body,'0 0 270 72','LinyJaya Development'),encoding='utf-8')
board='<rect width="900" height="480" rx="24" fill="#f2f7ff"/><text x="44" y="48" font-family="Arial" font-size="12" letter-spacing="3" fill="#6c819f">LINYJAYA DEVELOPMENT / BRAND IDENTITY</text><rect x="35" y="80" width="400" height="220" rx="20" fill="white"/><rect x="455" y="80" width="410" height="220" rx="20" fill="#142b49"/>'
for x,name in [(75,'linyjaya-logo'),(500,'linyjaya-logo-white')]:
 inner=Path('assets/brand/'+name+'.svg').read_text().split('>',1)[1].rsplit('</svg>',1)[0];board+=f'<g transform="translate({x} 150) scale(1.12)">{inner}</g>'
for x,color,label in [(45,'#1857e8','ROYAL BLUE'),(260,'#142b49','MIDNIGHT'),(475,'#badaff','WATER BLUE'),(690,'#ffffff','WHITE')]:
 board+=f'<rect x="{x}" y="345" width="165" height="48" rx="10" fill="{color}" stroke="#e0e8f5"/><text x="{x}" y="422" font-family="Arial" font-size="10" letter-spacing="1.5" fill="#6c819f">{label}</text><text x="{x}" y="445" font-family="Arial" font-size="13" fill="#142b49">{color.upper()}</text>'
Path('assets/brand/brand-board.svg').write_text(svg(board,'0 0 900 480','Identitas visual LinyJaya Development'),encoding='utf-8')
print('Created original LJ monogram, outlined wordmarks, favicon and brand board')
