import bpy, math, os, json
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
ROOT=os.path.abspath('outputs/candy-collection')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
for d in list(bpy.data.collections):
 if d.name!='Collection':bpy.data.collections.remove(d)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=1200;scene.render.resolution_y=1200;scene.render.resolution_percentage=100
scene.world.color=(.3,.3,.3);scene.view_settings.view_transform='AgX'
scene.unit_settings.system='METRIC';scene.unit_settings.scale_length=.05
studio=bpy.data.collections.new('STUDIO');scene.collection.children.link(studio)
def move(o,col):
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);return o
def mat(name,color,metal=0,rough=.3,trans=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough;p.inputs['Transmission Weight'].default_value=trans;p.inputs['IOR'].default_value=1.46;return m
silver=mat('Brushed tin / steel',(.55,.6,.66),.9,.25);white=mat('Warm ivory',(.94,.9,.82));clear=mat('Optical clear acrylic',(.88,.96,1),0,.08,.92);floor=mat('Warm studio background',(.89,.87,.84),0,.8)
def finish(o,name,m,col,bevel=0):
 o.name=name;o.data.materials.append(m);move(o,col)
 if bevel:
  b=o.modifiers.new('Soft manufactured edges','BEVEL');b.width=bevel;b.segments=3;o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL')
 return o
def cube(name,loc,scale,m,col,b=.02):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,name,m,col,b)
def cyl(name,loc,r,depth,m,col,front=True):
 bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=r,depth=depth,location=loc,rotation=(math.pi/2,0,0) if front else (0,0,0));o=finish(bpy.context.object,name,m,col,.014)
 for p in o.data.polygons:p.use_smooth=True
 return o
def image_mat(name,cloth=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.87 if cloth else .27
 t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(ROOT+'/textures/'+name+'.png');t.image.pack();m.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color']);m.node_tree.links.new(t.outputs['Alpha'],p.inputs['Alpha'])
 if cloth:
  n=m.node_tree.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=230;b=m.node_tree.nodes.new('ShaderNodeBump');b.inputs['Strength'].default_value=.16;b.inputs['Distance'].default_value=.008;m.node_tree.links.new(n.outputs['Fac'],b.inputs['Height']);m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
 return m
def surf(name,verts,faces,uvs,m,col):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);col.objects.link(o);me.materials.append(m);uv=me.uv_layers.new()
 for p in me.polygons:
  for li in p.loop_indices:uv.data[li].uv=uvs[me.loops[li].vertex_index]
 return o
def path(name,pts,r,m,col):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3;s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 o=bpy.data.objects.new(name,c);col.objects.link(o);o.data.materials.append(m);return o
palette=['strawberry','mint','lavender','soda','lemon'];products=[]
for kind,names in [('badge',palette),('stand',palette[:3]),('tapestry',['strawberry','soda'])]:
 for color in names:
  key=kind+'-'+color;col=bpy.data.collections.new(key);scene.collection.children.link(col);products.append((key,col))
  if kind=='badge':
   cyl('Rolled metal rim',(0,0,.59),.57,.065,silver,col)
   cyl('Printed dome',(0,-.037,.59),.554,.028,white,col)
   N=160;v=[(0,-.056,.59)]+[(.548*math.cos(i*math.tau/N),-.056,.59+.548*math.sin(i*math.tau/N)) for i in range(N)];uv=[(.5,.5)]+[(.5+.5*math.cos(i*math.tau/N),.5+.5*math.sin(i*math.tau/N)) for i in range(N)];surf('Gloss print',v,[(0,1+i,1+(i+1)%N) for i in range(N)],uv,image_mat(key),col)
   cyl('Recessed metal back',(0,.042,.59),.51,.017,silver,col);path('Safety pin',[(-.32,.07,.57),(.31,.07,.57),(.34,.07,.62),(.25,.07,.65)],.012,silver,col)
  elif kind=='stand':
   # Clear candy silhouette cutout and supporting tab, 3 mm nominal thickness.
   pts=[(-.55,.32),(-1,.62),(-.9,.97),(-1,1.32),(-.55,1.12)]
   pts += [(.6*math.cos(a),.82+.6*math.sin(a)) for a in [math.pi-i*math.pi/40 for i in range(41)]]
   pts += [(1,1.32),(.9,.97),(1,.62),(.55,.32)]
   pts += [(.6*math.cos(a),.82+.6*math.sin(a)) for a in [-i*math.pi/40 for i in range(41)]]
   # Simpler single outline composed of circle arcs and wrapper notches.
   pts=[(-.50,1.16),(-.99,1.41),(-.90,.98),(-.99,.55),(-.50,.79)]
   pts += [(.57*math.cos(a),.98+.57*math.sin(a)) for a in [math.radians(200+i*140/40) for i in range(41)]]
   pts += [(.99,.55),(.90,.98),(.99,1.41),(.50,1.16)]
   pts += [(.57*math.cos(a),.98+.57*math.sin(a)) for a in [math.radians(20+i*140/40) for i in range(41)]]
   cu=bpy.data.curves.new('Candy die cut','CURVE');cu.dimensions='2D';cu.resolution_u=12;cu.fill_mode='BOTH';cu.extrude=.03;cu.bevel_depth=.008;cu.bevel_resolution=3;sp=cu.splines.new('POLY');sp.points.add(len(pts)-1)
   for p,(x,z) in zip(sp.points,pts):p.co=(x,z,0,1)
   sp.use_cyclic_u=True;o=bpy.data.objects.new('Clear candy contour',cu);col.objects.link(o);o.rotation_euler[0]=math.pi/2;cu.materials.append(clear)
   cube('Clear support tab',(0,0,.28),(.24,.06,.46),clear,col,.02)
   base=cyl('Clear oval display base',(0,0,.055),.64,.09,clear,col,False);base.scale.y=.6
   surf('Opaque candy print',[(-.94,-.041,.39),(.94,-.041,.39),(.94,-.041,1.565),(-.94,-.041,1.565)],[(0,1,2,3)],[(0,0),(1,0),(1,1),(0,1)],image_mat(key),col)
  else:
   w=2;h=2.86;bottom=.32;nx=50;nz=65;v=[];uv=[];faces=[]
   for j in range(nz+1):
    for i in range(nx+1):
     u=i/nx;t=j/nz;x=(u-.5)*w;y=.025*math.sin(u*math.pi*9)*math.sin(t*math.pi)+.015*math.sin(u*math.pi*3);v.append((x,y,bottom+t*h));uv.append((u,t))
   for j in range(nz):
    for i in range(nx):
     a=j*(nx+1)+i;faces.append((a,a+1,a+nx+2,a+nx+1))
   o=surf('Woven printed fabric',v,faces,uv,image_mat(key,True),col);s=o.modifiers.new('Fabric thickness','SOLIDIFY');s.thickness=.006
   for z in [bottom,bottom+h]:
    o=cyl('Ivory hanging rod',(0,.012,z),.045,2.16,white,col,False);o.rotation_euler[1]=math.pi/2
   path('Cotton suspension cord',[(-.91,.015,bottom+h+.02),(0,.015,bottom+h+.56),(.91,.015,bottom+h+.02)],.012,white,col)
  for o in col.objects:o['product']=key
# studio
cube('Infinite studio floor',(0,0,-.07),(200,200,.1),floor,studio,.01)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size in [('Key',(-3,-4,6),550,4),('Fill',(4,-2,3),380,3),('Rim',(1,3,5),650,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;aim(o,(0,0,1));move(o,studio)
bpy.ops.object.camera_add(location=(2,-7,3));cam=bpy.context.object;move(cam,studio);scene.camera=cam;cam.data.type='ORTHO';cam.data.lens=50
for key,col in products:
 for k,c in products:c.hide_render=c!=col;c.hide_viewport=c!=col
 kind=key.split('-')[0];target={'badge':.59,'stand':.8,'tapestry':1.85}[kind];cam.location=({'badge':.95,'stand':1.7,'tapestry':1.6}[kind],-7,{'badge':2.1,'stand':2.7,'tapestry':3.1}[kind]);aim(cam,(0,0,target));cam.data.ortho_scale={'badge':1.55,'stand':2.65,'tapestry':4.45}[kind]
 scene.render.filepath=ROOT+'/renders/'+key+'.png';bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/models/'+key+'.blend');bpy.ops.render.render(write_still=True)
# Arrange master scene as a catalog display.
for index,(key,col) in enumerate(products):
 col.hide_render=False;col.hide_viewport=False
 if key.startswith('badge'):x=(index-2)*1.45;y=-1.5
 elif key.startswith('stand'):x=(index-6)*2.45;y=1.0
 else:x=(index-8.5)*2.7;y=3.1
 for o in col.objects:o.location.x+=x;o.location.y+=y
cam.location=(5,-15,10);aim(cam,(0,1.3,1.25));cam.data.ortho_scale=10.3;scene.render.resolution_x=1800;scene.render.resolution_y=1400;scene.cycles.samples=48;scene.render.filepath=ROOT+'/renders/collection.png'
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/candy-collection.blend');bpy.ops.render.render(write_still=True)
print('COMPLETE: 10 products and collection')
