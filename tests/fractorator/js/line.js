var Line = function(args){
	if(this === window){throw 'Please use the `new` keyword when calling the `Line` constructor.';}
	var t = this;
	var args = args || {};
	n.blessWith2DBase(t,args);
	t.lastUrlString = '';
	t.children = [];
	t.scene = s;
	t.lineWidth = args.lineWidth || undefined;
	t.el = document.createElement('div');
	t.el.className = 'control';
	t.label = document.createElement('div');
	t.label.innerText = t.type;
	t.el.appendChild(t.label);
	return t;
}

Line.prototype = {
	type:'Line',
	abbrev:'l',
	onAdd:Point.prototype.onAdd,
	onRemove:Point.prototype.onRemove,
	add:recycle.add,
	remove:recycle.remove,
	handleChildren:recycle.handleChildren,
	toUrlString:recycle.toUrlString,
	update:function(){
		var t = this;
		t.handleChildren();
		var newUrlString = t.toUrlString();
		//console.log(newUrlString);
		if(t.lastUrlString !== newUrlString){
			t.lastUrlString = newUrlString;
			t.shape = {
				points:[],
				lines:[],
			};
			t.lastRotString = false;
			if(t.children.length > 0){
				var firstPoint = t.children[0].pos;
				t.shape.points.push([firstPoint.x,firstPoint.y]);
				for(var i = 1; i < t.children.length; i += 1){
					var thisPoint = t.children[i].pos;
					t.shape.points.push([thisPoint.x,thisPoint.y]);
					t.shape.lines.push([i -1, i]);
				}
			}
		}
		if(!t.parent){
			t.render();
		}
	}
};
