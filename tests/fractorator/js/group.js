var Group = function(args){
	if(this === window){throw 'Please use the `new` keyword when calling the `Line` constructor.';}
	var t = this;
	var args = args || {};
	n.blessWith2DBase(t,args);
	t.children = args.children || [];
	t.transforms = args.transforms || {}; //{pos, rot, scale, iterations}
	t.lastUrlString = '';
	t.scene = s;
	t.lineWidth = args.lineWidth || undefined;
	t.el = document.createElement('div');
	t.el.className = 'control';
	t.label = document.createElement('div');
	t.label.innerText = t.type;


	t.controlElements = {};

	var cel = t.controlElements;

	cel.scale = createControl({
		type:'range',
		min:0.1,
		max:1.5,
		step:0.001,
		value: t.transforms.scale || 1.0,
		width:256,
	});

	cel.rot = createControl({
		type:'range',
		min: 0,
		max: 180,
		step: 1,
		value: t.transforms.rot || 0,
		width:256,
	});

	cel.iterations = createControl({
		type:'range',
		min:1,
		max:36,
		step:1,
		value: t.transforms.iterations || 1,
		width:256,
	});
	
	t.el.appendChild(t.label);
	t.el.appendChild(cel.scale);
	t.el.appendChild(cel.rot);
	t.el.appendChild(cel.iterations);
	return t;
}

Group.prototype = {
	type:'Group',
	abbrev:'g',
	onAdd:Point.prototype.onAdd,
	onRemove:Point.prototype.onRemove,
	add:recycle.add,
	remove:recycle.remove,
	handleChildren:recycle.handleChildren,
	renderChildren:recycle.renderChildren,
	toUrlString:recycle.toUrlString,
	render:function(){
		var t = this;
		var c = t.scene.c;
		t.renderChildren(1,0);
		var tform = t.transforms;
		for(var i = 1; i < tform.iterations; i += 1){
			c.save();
			if(Math.abs(tform.rot) > 0){
				c.rotate(deg * tform.rot);
			}
			if(tform.pos.toUrlString() !== '0x0'){
				//var pos = transform.pos.clone().sub(s.camera.pos);
				c.translate(tform.pos.x,tform.pos.y);
			}
			if(tform.scale !== 1){
				c.scale(tform.scale,tform.scale);
			}
			if(tform.mirrorX === 1){
				c.scale(-1,1);
			}
			if(tform.mirrorY === 1){
				c.scale(1,-1);
			}
			t.renderChildren(tform.iterations,i);
		}
		//on the way out of the transforms...
		for(var i = 1; i < tform.iterations; i += 1){
			c.restore();
		}
	},
	update:function(){
		var t = this;
		t.handleChildren();
		t.transforms.scale = t.controlElements.scale.value;
		t.transforms.rot = t.controlElements.rot.value;
		t.transforms.iterations = t.controlElements.iterations.value;
		if(!t.parent){
			t.render();
		}
	}
};
