from pathlib import Path
exec((Path(__file__).resolve().parent/'build.py').read_text().split("palette=['strawberry'")[0])
bpy.context.preferences.filepaths.save_version=0
scene.cycles.samples=40
variants={0:['badge-strawberry','badge-mint','badge-lavender','badge-soda','badge-lemon'],1:['clearfile-strawberry','clearfile-soda'],2:['stand-strawberry','stand-mint','stand-lavender'],3:['tapestry-strawberry','tapestry-soda'],4:['tee-strawberry','tee-soda']}
varids={0:[0]*5,1:[1,2],2:[3,4,5],3:[6,7],4:[8,9]}
assets={}
for pid,keys in variants.items():
 for key,vid in zip(keys,varids[pid]):
  with bpy.data.libraries.load(ROOT+'/models/'+key+'.blend',link=False) as (src,dst):dst.collections=[key]
  col=dst.collections[0];scene.collection.children.link(col);col['productId']=pid;col['variantId']=vid;col.hide_render=True;col.hide_viewport=True;assets[key]=col
cube('Studio floor',(0,0,-.07),(200,200,.1),floor,studio,.01)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size in [('Key',(-3,-4,6),550,4),('Fill',(4,-2,3),380,3),('Rim',(1,3,5),650,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;aim(o,(0,0,1));move(o,studio)
bpy.ops.object.camera_add();cam=bpy.context.object;move(cam,studio);scene.camera=cam;cam.data.type='ORTHO'
for pid,keys in variants.items():
 for col in assets.values():col.hide_render=True;col.hide_viewport=True
 gap={0:1.18,1:2.28,2:2.10,3:2.32,4:3.10}[pid]
 for i,key in enumerate(keys):
  col=assets[key];col.hide_render=False;col.hide_viewport=False
  for o in col.objects:o.location.x+=(i-(len(keys)-1)/2)*gap
 target={0:.62,1:1.62,2:.85,3:1.9,4:1.5}[pid];cam.location=(1.4,-20,target+4.8);aim(cam,(0,0,target));cam.data.ortho_scale={0:6.6,1:5.2,2:6.8,3:5.6,4:6.9}[pid]
 scene.render.filepath=ROOT+'/renders/product-'+str(pid)+'.png';bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/models/product-'+str(pid)+'.blend',compress=True);bpy.ops.render.render(write_still=True)
 for i,key in enumerate(keys):
  for o in assets[key].objects:o.location.x-=(i-(len(keys)-1)/2)*gap
# All 14 appearance variants, at display scale.
layout={}
for i,k in enumerate(variants[0]):layout[k]=((i-2)*1.38,-3.25)
for i,k in enumerate(variants[2]):layout[k]=((i-1)*2.15,-.9)
for i,k in enumerate(variants[1]):layout[k]=((-1 if i==0 else 1)*4,1.5)
for i,k in enumerate(variants[4]+variants[3]):layout[k]=((i-1.5)*3.2,4.8)
for key,col in assets.items():
 col.hide_render=False;col.hide_viewport=False
 for o in col.objects:o.location.x+=layout[key][0];o.location.y+=layout[key][1]
cam.location=(6,-20,15);aim(cam,(0,1.4,1.35));cam.data.ortho_scale=15.7;scene.render.resolution_x=2200;scene.render.resolution_y=1650;scene.render.filepath=ROOT+'/renders/collection.png';scene.cycles.samples=48
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/candy-collection.blend',compress=True);bpy.ops.render.render(write_still=True)
assert len(assets)==14
assert {c['productId'] for c in assets.values()}==set(range(5))
assert {c['variantId'] for c in assets.values()}==set(range(10))
assert all(im.packed_file for im in bpy.data.images if im.source=='FILE' and im.filepath)
print('VALIDATED: IDs and packed textures')
print('CATALOG COMPLETE: 5 products, 10 variant IDs, 14 visual variants')
