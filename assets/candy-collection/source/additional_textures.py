from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
# Reuse the original illustration language and palette.
exec((Path(__file__).resolve().parent/'textures.py').read_text().split('for name,col in colors.items():')[0])
for name in ['strawberry','soda']:
 col=colors[name];rgb=tuple(bytes.fromhex(col[1:]));pale=tuple(round(v*.12+255*.88) for v in rgb)
 im=Image.new('RGBA',(1400,2000),(0,0,0,0));d=ImageDraw.Draw(im)
 # Transparent upper half and lower colour field show the folder's clear PP.
 d.rounded_rectangle((74,76,1326,1924),radius=32,outline=(*rgb,230),width=6)
 d.rectangle((76,1240,1324,1922),fill=(*pale,240))
 txt(d,(700,315),'SWEET LITTLE',95,col);txt(d,(700,450),'MOMENTS',110,col)
 candy(d,700,945,290,col)
 for x,y,r in [(270,660,34),(1130,1230,38),(1120,650,25)]:star(d,x,y,r,col)
 txt(d,(700,1440),'KEEP THE SWEET STUFF.',42,col)
 txt(d,(700,1670),'C A N D Y   C L U B',48,col)
 txt(d,(700,1790),'everyday feels a little brighter',30,col)
 im.save(OUT/f'clearfile-{name}.png')
 # Complete shirt surface texture; cream is continuous across the garment.
 im=Image.new('RGB',(2000,2000),'#F6F1E8');d=ImageDraw.Draw(im)
 txt(d,(1000,710),'SWEET LITTLE',100,col)
 candy(d,1000,1060,208,col)
 txt(d,(1000,1370),'MOMENTS',125,col)
 txt(d,(1000,1485),'C A N D Y   C L U B',36,col)
 for x,y,r in [(580,890,29),(1400,1235,32)]:star(d,x,y,r,col)
 im.save(OUT/f'tee-{name}.png')
