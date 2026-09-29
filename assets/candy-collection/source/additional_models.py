from pathlib import Path
exec((Path(__file__).resolve().parent/'build.py').read_text().split("palette=['strawberry'")[0])
bpy.context.preferences.filepaths.save_version=0
scene.cycles.samples=48
cream=mat('Cotton natural ivory',(.92,.88,.81),rough=.9)
pp=mat('Frosted polypropylene',(.92,.97,1),rough=.22,trans=.82)
paper=mat('Paper insert',(.94,.92,.87),rough=.85)
products=[]
def shape_mesh(name,pts,depth,m,col,uv=False):
 vec=[Vector((x,z,0)) for x,z in pts]
 lookup={(round(v.x,8),round(v.y,8)):i for i,v in enumerate(vec)}
 faces=[tuple(v if isinstance(v,int) else lookup[(round(v.x,8),round(v.y,8))] for v in tri) for tri in tessellate_polygon([vec])]
 o=surf(name,[(x,depth,z) for x,z in pts],[tuple(range(len(pts)))],[((x+1.55)/3.1,(z-.15)/2.7) for x,z in pts],m,col)
 return o

def tee_y(x,z,front=True):
 relief=(.007*math.sin(x*13+z*2)+.003*math.sin(x*23-z*1.3))*(.5+.5*math.cos(z))
 drape=.13+.075*math.cos(x*1.55)*math.sin(max(0,z)*math.pi/3)
 return (-drape if front else drape)+relief
for kind in ['clearfile','tee']:
 for color in ['strawberry','soda']:
  key=kind+'-'+color;col=bpy.data.collections.new(key);scene.collection.children.link(col);products.append((key,col))
  if kind=='clearfile':
   # Actual two-sheet folder: welded left/bottom, open top/right, thumb notch.
   front=[(-1.05,.12),(1.05,.12),(1.05,2.52)]
   front += [(1.05-.095*math.sin(i*math.pi/20),2.52+i*.19/20) for i in range(1,21)]
   front += [(1.05,3.09),(-1.05,3.09)]
   for name,pts,y in [('Back clear PP sheet',[(-1.05,.12),(1.05,.12),(1.05,3.11),(-1.05,3.11)],.042),('Front clear PP sheet with thumb notch',front,-.042)]:
    o=shape_mesh(name,pts,y,pp,col);s=o.modifiers.new('PP sheet thickness','SOLIDIFY');s.thickness=.007
   cube('Removable blank A4 paper insert',(0,.018,1.65),(1.94,.012,2.94),paper,col,.008)
   o=shape_mesh('Printed candy artwork',front,-.058,image_mat(key),col)
   for p in o.data.polygons:
    for li in p.loop_indices:
     v=o.data.vertices[o.data.loops[li].vertex_index].co;o.data.uv_layers.active.data[li].uv=((v.x+1.05)/2.1,(v.z-.12)/2.97)
   path('Welded left and bottom seam',[(-1.029,-.038,3.09),(-1.029,-.038,.143),(1.04,-.038,.143)],.006,pp,col)
  else:
   rgb={'strawberry':(.63,.11,.26),'soda':(.10,.29,.54)}[color];rib=mat('Rib-knit collar '+color,rgb,rough=.88)
   # Neckline descends through a U curve, then shoulder, sleeve and hem silhouette.
   neck=[(-.36*math.cos(i*math.pi/24),2.67-.25*math.sin(i*math.pi/24)) for i in range(25)]
   rest=[(.84,2.58),(1.45,2.24),(1.20,1.66),(.77,1.89),(.73,.25),(.66,.20),(-.66,.20),(-.73,.25),(-.77,1.89),(-1.20,1.66),(-1.45,2.24),(-.84,2.58)]
   outlines=[]
   for isfront in [True,False]:
    pts=(neck if isfront else [(x,2.67-(2.67-z)*.24) for x,z in neck])+rest
    outlines.append(pts)
    from mathutils.geometry import delaunay_2d_cdt
    border=[]
    for ii,aa in enumerate(pts):
     bb=pts[(ii+1)%len(pts)];steps=max(1,math.ceil(math.dist(aa,bb)/.035))
     for jj in range(steps):border.append((aa[0]+(bb[0]-aa[0])*jj/steps,aa[1]+(bb[1]-aa[1])*jj/steps))
    if sum(border[ii][0]*border[(ii+1)%len(border)][1]-border[(ii+1)%len(border)][0]*border[ii][1] for ii in range(len(border)))<0:border.reverse()
    def inside(x,z):
     result=False
     for ii,(ax,az) in enumerate(pts):
      bx,bz=pts[(ii+1)%len(pts)]
      if (az>z)!=(bz>z) and x<(bx-ax)*(z-az)/(bz-az)+ax:result=not result
     return result
    samples=border+[(ix*.035,iz*.035) for ix in range(-42,43) for iz in range(6,77) if inside(ix*.035,iz*.035)]
    coords,edges,faces,*_=delaunay_2d_cdt([Vector(p) for p in samples],[],[list(range(len(border)))],1,1e-6,False)
    verts=[(v.x,tee_y(v.x,v.y,isfront),v.y) for v in coords]
    o=surf('Front cotton panel' if isfront else 'Back cotton panel',verts,faces,[((v.x+1.55)/3.1,(v.y-.15)/2.7) for v in coords],image_mat(key,True) if isfront else cream,col)
    for p in o.data.polygons:p.use_smooth=True
    solid=o.modifiers.new('Cotton fabric thickness','SOLIDIFY');solid.thickness=.007
   # Join front/back along shoulders and body sides; leave neck, cuffs and hem open.
   f,b=outlines;v=[];faces=[]
   for i in range(24,len(f)):
    j=(i+1)%len(f)
    if i in [26,30,34]:continue
    steps=max(1,math.ceil(math.dist(f[i],f[j])/.035))
    for q in range(steps):
     a=len(v)
     for t,frontside in [(q/steps,True),((q+1)/steps,True),((q+1)/steps,False),(q/steps,False)]:
      pts=f if frontside else b;x=pts[i][0]+(pts[j][0]-pts[i][0])*t;z=pts[i][1]+(pts[j][1]-pts[i][1])*t
      v.append((x,tee_y(x,z,frontside),z))
     faces.append((a,a+1,a+2,a+3))
   surf('Side and shoulder seams',v,faces,[(0,0)]*len(v),cream,col)
   for isfront in [True,False]:
    pts=neck if isfront else [(x,2.67-(2.67-z)*.24) for x,z in neck]
    path('Ribbed neckline front' if isfront else 'Ribbed neckline back',[(x,tee_y(x,z,isfront),z) for x,z in pts],.035,rib,col)
   for name,a,b in [('Left sleeve hem',(-1.45,2.24),(-1.2,1.66)),('Right sleeve hem',(1.45,2.24),(1.2,1.66)),('Bottom double stitched hem',(-.67,.24),(.67,.24))]:
    pts=[(a[0]+(b[0]-a[0])*t/36,a[1]+(b[1]-a[1])*t/36) for t in range(37)]
    for dz in [0,.024]:path(name,[(x,tee_y(x,z,True)-.004,z+dz) for x,z in pts],.003,white,col)
  for o in col.objects:o['asset_id']=key
# Shared photography studio.
cube('Studio floor',(0,0,-.07),(200,200,.1),floor,studio,.01)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size in [('Key',(-3,-4,6),550,4),('Fill',(4,-2,3),380,3),('Rim',(1,3,5),650,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;aim(o,(0,0,1));move(o,studio)
bpy.ops.object.camera_add();cam=bpy.context.object;move(cam,studio);scene.camera=cam;cam.data.type='ORTHO'
for key,col in products:
 for k,c in products:c.hide_render=c!=col;c.hide_viewport=c!=col
 cam.location=(.9,-8,3.1) if key.startswith('clearfile') else (.45,-8,2.8);aim(cam,(0,0,1.6));cam.data.ortho_scale=3.85 if key.startswith('clearfile') else 3.55
 scene.render.filepath=ROOT+'/renders/'+key+'.png'
 bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/models/'+key+'.blend',compress=True);bpy.ops.render.render(write_still=True)
for i,(key,col) in enumerate(products):
 col.hide_render=False;col.hide_viewport=False
 for o in col.objects:o.location.x+=(i-1.5)*3.05
cam.location=(2,-16,7);aim(cam,(0,0,1.65));cam.data.ortho_scale=13.3;scene.render.resolution_x=2000;scene.render.resolution_y=800;scene.render.filepath=ROOT+'/renders/additional-products.png'
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/additional-products.blend',compress=True);bpy.ops.render.render(write_still=True)
print('COMPLETE: 4 additional variants')
