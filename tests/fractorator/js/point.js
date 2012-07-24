var Point = function(args){
	if(this === window){throw 'Please use the `new` keyword when calling the `Point` constructor.';}
	var t = this;
	var args = args || {};
	//if(args.parent === undefined){throw 'Please pass a `parent` argument when calling the `Point` constructor.';}
	n.blessWith2DBase(t,args);
	t.el = document.createElement('div');
	t.el.pointLink = t;
	t.el.className = 'point';
	t.appendListeners();
	t.label = document.createElement('span');
	t.el.appendChild(t.label);
	t.lastPos = false;
	t.scene = s;
	return t;
}
Point.prototype = {
	appendListeners:function(){
		var t = this;
		t.el.addEventListener('mousedown',t.elClick,false);
		t.el.addEventListener('mousemove',t.elClick,false);
		t.el.addEventListener('mouseup',t.elClick,false);
		t.el.addEventListener('touchstart',t.elClick,false);
		t.el.addEventListener('touchmove',t.elClick,false);
		t.el.addEventListener('touchend',t.elClick,false);
	},
	onAdd:function(){
		if(this.parent !== undefined && this.parent.el !== undefined){
			this.parent.el.appendChild(this.el);
		}else if(this.parent === undefined){
			controlDiv.appendChild(this.el);
		}
	},
	onRemove:function(){
		if(this.parent !== undefined && this.parent.el !== undefined){
			this.parent.el.removeChild(this.el);
		}else if(this.parent === undefined){
			controlDiv.removeChild(this.el);
		}
	},
	render:function(){
		//need a render function in case it gets parrented incorrectly?
	},
	update:function(){
		var t = this;
		if(t.scene.mpos.down && t.scene.mpos.hitting === t){
			t.pos.set(t.scene.mpos);
		}
		var currentPos = t.pos.clone().sub(t.scene.camera.pos).toUrlString();
		if(t.lastPos !== currentPos){
			t.el.style.left = (t.scene.cx + t.pos.x + t.scene.camera.pos.x).toString() + 'px';
			t.el.style.top = (t.scene.cy + t.pos.y + t.scene.camera.pos.y).toString() + 'px';
			t.label.innerHTML = 'x:' + t.pos.x + '<br>y:' + t.pos.y;
			t.lastPos = currentPos;
		}
	},
	elClick:function(e){
		if(e.target.pointLink !== undefined){
			var t = e.target.pointLink;
			//console.log(e.type);
			//console.log(t.scene.mpos.down);
			if(e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'touchmove'){t.scene.mpos.down = true;}
			if(e.type === 'mouseup' || e.type === 'touchstop'){
				t.scene.mpos.down = false;
				sceneToUrl();
			}
			if(t.scene.mpos.down){
				t.scene.mpos.hitting = t;
				t.pos.set(t.scene.mpos);
			}
		}
	}
};