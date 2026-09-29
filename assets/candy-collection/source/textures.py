from PIL import Image,ImageDraw,ImageFont
import math, pathlib
OUT=pathlib.Path('outputs/candy-collection/textures')
colors={'strawberry':'#E95888','mint':'#259F8A','lavender':'#8870C8','soda':'#428AC8','lemon':'#DDA72F'}
font='/System/Library/Fonts/Supplemental/Futura.ttc'
def txt(d,xy,s,size,fill):
 d.text(xy,s,font=ImageFont.truetype(font,size),fill=fill,anchor='mm')
def candy(d,cx,cy,r,col,angle=0):
 # Graphic wrapped sweet, with a spiral peppermint center.
 cream='#FFF9EC'
 for sign in [-1,1]:
  pts=[(cx+sign*r*.85,cy),(cx+sign*r*1.7,cy-r*.68),(cx+sign*r*1.52,cy),(cx+sign*r*1.7,cy+r*.68)]
  d.polygon(pts,fill=col)
  for k in [-.30,0,.30]:
   d.line([(cx+sign*r*.92,cy),(cx+sign*r*1.47,cy+r*k)],fill=cream,width=max(2,int(r*.035)))
 d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=cream)
 for a in range(0,360,60):
  p=[]
  for i in range(101):
   t=i/100; theta=math.radians(a+100*t); p.append((cx+r*t*math.cos(theta),cy+r*t*math.sin(theta)))
  for step in range(1,30):
   theta=math.radians(a+100+step);p.append((cx+r*math.cos(theta),cy+r*math.sin(theta)))
  for i in range(100,-1,-1):
   t=i/100;theta=math.radians(a+29+100*t);p.append((cx+r*t*math.cos(theta),cy+r*t*math.sin(theta)))
  d.polygon(p,fill=col)

def star(d,x,y,r,col):
 d.polygon([(x,y-r),(x+r*.24,y-r*.24),(x+r,y),(x+r*.24,y+r*.24),(x,y+r),(x-r*.24,y+r*.24),(x-r,y),(x-r*.24,y-r*.24)],fill=col)
for name,col in colors.items():
 rgb=tuple(bytes.fromhex(col[1:])); pale=tuple(round(v*.16+255*.84) for v in rgb)
 im=Image.new('RGB',(1600,1600),pale);d=ImageDraw.Draw(im)
 d.ellipse((90,90,1510,1510),outline='#FFF9EC',width=12)
 txt(d,(800,385),'SWEET LITTLE',116,col);txt(d,(800,1215),'MOMENTS',130,col)
 candy(d,800,810,250,col)
 for x,y,r in [(400,550,38),(1190,1050,36),(1180,570,28),(405,1050,26)]:star(d,x,y,r,col)
 txt(d,(800,1370),'C A N D Y   C L U B',36,col)
 im.save(OUT/f'badge-{name}.png')
 # Stand: transparent art, white underprint represented by opaque cream.
 im=Image.new('RGBA',(1600,1000),(0,0,0,0));d=ImageDraw.Draw(im);candy(d,800,500,420,col);im.save(OUT/f'stand-{name}.png')
 if name in ['strawberry','soda']:
  im=Image.new('RGB',(1400,2000),pale);d=ImageDraw.Draw(im)
  d.rectangle((65,65,1335,1935),outline=col,width=4)
  for x in range(130,1400,230):
   for y in range(160,2000,245):d.ellipse((x-4,y-4,x+4,y+4),fill=col)
  txt(d,(700,290),'SWEET',180,col);txt(d,(700,480),'LITTLE MOMENTS',75,col)
  candy(d,700,1000,285,col)
  for x,y,r in [(250,690,45),(1160,1330,52),(1100,700,30),(280,1370,27)]:star(d,x,y,r,col)
  txt(d,(700,1580),'unwrap a little happiness',51,col)
  txt(d,(700,1770),'C A N D Y   C L U B',44,col)
  im.save(OUT/f'tapestry-{name}.png')
