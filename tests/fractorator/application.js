//Dedicated to Cheryce, who created designs with my first toy that blew my mind
var controlDiv = document.getElementById('controls');
var controlToggle = document.getElementById('controls_toggle');
var toggleControls = function(e){
	//console.log(e);
	if(e.target.value == 'Show Controls'){
		e.target.value = 'Hide Controls';
		controlDiv.style.display = 'block';
	}else{
		e.target.value = 'Show Controls';
		controlDiv.style.display = 'none';
	}
}
controlToggle.addEventListener('mousedown',toggleControls,false);
controlToggle.addEventListener('touchstart',toggleControls,false);

var nCT = document.createElement('select'); //newControlType
optionList = ['Line','Circle','Group'];
for(var i = 0; i < optionList.length; i += 1){
	var option = document.createElement('option');
	option.value = optionList[i];
	option.innerHTML = optionList[i];
	nCT.appendChild(option);
}
var nCTClick = function(e){
	console.log(e);
	e.stopPropagation(); //Have to do this because otherwise the window's e.preventDefault gets in the way and breaks the select menu. Eesh!
}
nCT.addEventListener('mousedown',nCTClick,true);
var nCB = document.createElement('input'); //newControlButton
nCB.type = 'button';
nCB.value = 'New Control';
var addControl = function(e){
	//alert(nCT.value);
	s.mpos.down = false;
	var control = new window[nCT.value]();
	s.add(control);
}
nCB.addEventListener('mousedown',addControl,false);
nCB.addEventListener('touchstart',addControl,false);

controlDiv.appendChild(nCT);
controlDiv.appendChild(nCB);

var n = NPos2d;
var s = new n.Scene({
	frameRate:60,
	pixelScale: 1,
	lineWidth: 2,
	globalCompositeOperation: 'lighter',
});


var sceneToUrl = function(){
	var output = [];
	for(var i = 0; i < s.rQ.length; i += 1){
		var o = s.rQ[i];
		if(typeof o.toUrlString === 'function'){
			output.push(o.toUrlString());
		}
	}
	var value = output.join('/');
	window.location.hash = '#' + value;
	return value;
}
var urlToScene = function(string){
	s.rQ = [];
	var coreNodes = string.split('/');
	for(var i = 0; i < coreNodes.length; i += 1){
		output.push(s.rQ[i].toUrlString());
	}
}

var recycle = {
	add:function(child){
		var t = this;
		t.children.push(child);
		child.parent = t;
		if(child.onAdd !== undefined){
			child.onAdd();
		}
	},
	remove:function(child){
		var t = this;
		for(var i = 0; i < t.children.length; i += 1){
			if(t.children[i] === child){
				t.children.splice(i,1);
				if(child.onRemove !== undefined){child.onRemove();}
				child.parent = false;
			}
		}
	},
	handleChildren:function(){
		var t = this;
		for(var i = 0; i < t.children.length; i += 1){
			var child = t.children[i];
			child.update();
		}
	},
	renderChildren:function(totalIterations, currentIteration){
		var t = this;
		var color = 'hsl('+((360/totalIterations) * currentIteration)+',100%,50%)';
		for(var i = 0; i < t.children.length; i += 1){
			var child = t.children[i];
			child.color = color;
			child.render();
		}
	},
	toUrlString:function(){
		var t = this;
		var cOutput = [];
		for(var i = 0; i < t.children.length; i += 1){
			cOutput.push(t.children[i].pos.toUrlString());
		}
		return t.abbrev + '_' + cOutput.join(':');
	},
};

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
		t.el.addEventListener('mousedown',t.elClick,true);
		t.el.addEventListener('mousemove',t.elClick,true);
		t.el.addEventListener('mouseup',t.elClick,true);
		t.el.addEventListener('touchstart',t.elClick,true);
		t.el.addEventListener('touchmove',t.elClick,true);
		t.el.addEventListener('touchend',t.elClick,true);
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
		t.scene.drawCircle(t.pos,t.radius,t.color,true,t.lineWidth);
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


var Group = function(args){
	if(this === window){throw 'Please use the `new` keyword when calling the `Line` constructor.';}
	var t = this;
	var args = args || {};
	n.blessWith2DBase(t,args);
	t.children = args.children || [];
	t.transforms = args.transforms || []; //{pos, rot, scale, iterations}
	t.lastUrlString = '';
	t.scene = s;
	t.lineWidth = args.lineWidth || undefined;
	t.el = document.createElement('div');
	t.el.className = 'control';
	t.label = document.createElement('div');
	t.label.innerText = t.type;
	t.scaleControl = document.createElement('input');
	t.scaleControl.type = 'range';
	t.scaleControl.min = 0.1;
	t.scaleControl.max = 1.5;
	t.scaleControl.step = 0.001;
	t.scaleControl.value = 1.0;
	t.scaleClick = function(e){
		console.log(e);
		e.stopPropagation();
	};
	t.scaleControl.addEventListener('mousedown',t.scaleClick,false);
	t.scaleControl.addEventListener('mouseup',t.scaleClick,false);
	

	t.rotControl = document.createElement('input');
	t.rotControl.type = 'range';
	t.rotControl.min = 0;
	t.rotControl.max = 180;
	t.rotControl.step = 1;
	t.rotControl.value = 10;
	t.rotClick = function(e){
		console.log(e);
		e.stopPropagation();
	};
	t.rotControl.addEventListener('mousedown',t.rotClick,false);
	t.rotControl.addEventListener('mouseup',t.rotClick,false);

	t.iterControl = document.createElement('input');
	t.iterControl.type = 'range';
	t.iterControl.min = 1;
	t.iterControl.max = 36;
	t.iterControl.step = 1;
	t.iterControl.value = 1;
	t.iterClick = function(e){
		console.log(e);
		e.stopPropagation();
	};
	t.iterControl.addEventListener('mousedown',t.rotClick,false);
	t.iterControl.addEventListener('mouseup',t.rotClick,false);
	
	t.el.appendChild(t.label);
	t.el.appendChild(t.scaleControl);
	t.el.appendChild(t.rotControl);
	t.el.appendChild(t.iterControl);
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
		for(var j = 0; j < t.transforms.length; j += 1){
			var transform = t.transforms[j];
			//on the way into the transforms...
			t.renderChildren(1,0);
			for(var i = 1; i < transform.iterations; i += 1){
				c.save();
				if(Math.abs(transform.rot) > 0){
					c.rotate(transform.rot);
				}
				if(transform.pos.toUrlString() !== '0x0'){
					//var pos = transform.pos.clone().sub(s.camera.pos);
					c.translate(transform.pos.x,transform.pos.y);
				}
				if(transform.scale !== 1){
					c.scale(transform.scale,transform.scale);
				}
				if(transform.mirrorX === 1){
					c.scale(-1,1);
				}
				if(transform.mirrorY === 1){
					c.scale(1,-1);
				}
				t.renderChildren(transform.iterations,i);
			}
			//on the way out of the transforms...
			for(var i = 1; i < transform.iterations; i += 1){
				c.restore();
			}
		}
	},
	update:function(){
		var t = this;
		t.handleChildren();
		t.transforms[0].scale = t.scaleControl.value;
		t.transforms[0].rot = deg * t.rotControl.value;
		t.transforms[0].iterations = t.iterControl.value;
		if(!t.parent){
			t.render();
		}
	}
};



var myLine = new Line({
	lineWidth: 2
});
var myPoint = new Point({pos:new Vec2(-50,100)});
myLine.add(myPoint);
var myOtherPoint = new Point({pos:new Vec2(50,100)});
myLine.add(myOtherPoint);

var myCircle = new Circle({
	pos:new Vec2(0,100),
	radius: 50,
	lineWidth: 2
});


var myGroup = new Group({
	transforms:[
		{
			pos: new Vec2(),
			rot: deg * 10,
			scale: 0.9,
			mirrorX: 0,
			mirrorY: 0,
			iterations: 30
		},
	]
});
//myGroup.add(myCircle);
myGroup.add(myLine);
var myOtherGroup = new Group({
	transforms:[
		{
			pos: new Vec2(),
			rot: tau/6,
			scale: 1,
			mirrorX: 0,
			mirrorY: 0,
			iterations: 6
		},
	]
});
var myOtherOtherGroup = new Group({
	transforms:[
		{
			pos: new Vec2(),
			rot: 0,
			scale: 1,
			mirrorX: 1,
			mirrorY: 0,
			iterations: 2
		},
	]
});
var myOtherOtherOtherGroup = new Group({
	transforms:[
		{
			pos: new Vec2(),
			rot: 0,
			scale: 1,
			mirrorX: 0,
			mirrorY: 1,
			iterations: 2
		},
	]
});

//1
//s.add(myGroup);

//2
//myOtherGroup.add(myGroup);
//s.add(myOtherGroup);

//3
//myOtherGroup.add(myGroup);
//myOtherOtherGroup.add(myOtherGroup);
//s.add(myOtherOtherGroup);

//4
myOtherGroup.add(myGroup);
myOtherOtherGroup.add(myOtherGroup);
myOtherOtherOtherGroup.add(myOtherOtherGroup);
s.add(myOtherOtherOtherGroup);


var makePointOnClick = function(e){
	if(e.target === document.body){
		var myPoint = new Point({pos:s.mpos.clone()});
		s.add(myPoint);
		myLine.children.push(myPoint);
		//console.log(s.mpos);
		//s.mpos.down = false;
		//s.mpos.hitting = false;
	}
}
document.body.addEventListener('mousedown',makePointOnClick,false);
