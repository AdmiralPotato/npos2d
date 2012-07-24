var Circle = function(args){
	if(this === window){throw 'Please use the `new` keyword when calling the `Circle` constructor.';}
	var t = this;
	var args = args || {};
	//if(args.parent === undefined){throw 'Please pass a `parent` argument when calling the `Point` constructor.';}
	n.blessWith2DBase(t,args);
	t.radius = args.radius || 32;
	t.centerPoint = new Point({pos:t.pos});
	t.radiusPoint = new Point({pos:t.pos.clone().add(t.radius,0)});
	t.scene = s;
	t.lineWidth = args.lineWidth || undefined;
	t.fill = args.fill || false;
	t.el = document.createElement('div');
	t.el.className = 'control';
	t.label = document.createElement('div');
	t.label.innerText = t.type;
	t.el.appendChild(t.label);
	t.children = [];
	t.add(t.centerPoint);
	t.add(t.radiusPoint);
	return t;
}

Circle.prototype = {
	type:'Circle',
	abbrev:'c',
	onAdd:Point.prototype.onAdd,
	onRemove:Point.prototype.onRemove,
	add:recycle.add,
	remove:recycle.remove,
	handleChildren:recycle.handleChildren,
	toUrlString:recycle.toUrlString,
	lineWidth:2,
	render:function(){
		var t = this;
		t.scene.drawCircle(t.pos,t.radius,t.color,t.fill,t.lineWidth);
	},
	update:function(){
		var t = this;
		t.handleChildren();
		t.centerPoint.update();
		t.radiusPoint.update();
		t.radius = t.pos.clone().sub(t.radiusPoint.pos).length();
		if(!t.parent){
			t.render();
		}
	},
	toUrlString:function(){
		var t = this;
		return 'c_' + t.centerPoint.pos.toUrlString() + '_' + t.radiusPoint.pos.toUrlString();
	}
};
