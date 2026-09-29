import bpy,os,glob
root=os.path.abspath('outputs/candy-collection')
for f in sorted(glob.glob(root+'/models/*.blend'))+[root+'/candy-collection.blend']:
 bpy.ops.wm.open_mainfile(filepath=f)
 for im in bpy.data.images:
  if im.source=='FILE' and '/textures/' in im.filepath:
   if im.packed_file:im.unpack(method='REMOVE')
   im.reload();im.pack()
 bpy.context.preferences.filepaths.save_version=0
 bpy.ops.wm.save_as_mainfile(filepath=f,compress=True)
 bpy.ops.render.render(write_still=True)
print('REFRESH COMPLETE')
