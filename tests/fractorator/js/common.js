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

var applyArgs = function(o,args){
	for(var property in args){
		if(args.hasOwnProperty(property)){
			o[property] = args[property];
		}
	}
}
var createControl = function(args){
	var t = document.createElement('input');
	var args = args || {};
	applyArgs(t,args);
	return t;
}