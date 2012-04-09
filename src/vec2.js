var Vec2 = function(){
	var t = this;
	if(t===window){throw 'This is a constructor method. You must create "new" instances of it.';}
	var v = t.sanitize(arguments);
	t.x = v.x;
	t.y = v.y;
	//console.log('creating a new Vec2');
	return t;
};

Vec2.prototype = {
	sep:'x',
	clean:function(input){
		input.x = parseFloat(input.x);
		input.y = parseFloat(input.y);
		return input;
	},
	sanitize:function(a){
		var t = this;
		if(
			a[0] instanceof Vec2 ||
			(a[0] instanceof Object && a[0].x !== undefined && a[0].y !== undefined)
		){
			return t.clean({x:a[0].x, y:a[0].y});
		}else if(a[0] instanceof Array){
			return t.clean({x:a[0][0], y:a[0][1]});
		}else if(a[0] !== undefined && a[1] !== undefined){
			return t.clean({x:a[0], y:a[1]});
		}
		return {x:0,y:0};
	},
	clone:function(){
		return new Vec2(this);
	},
	add:function(){
		var t = this;
		var v = t.sanitize(arguments);
		t.x += v.x;
		t.y += v.y;
		return t;
	},
	sub:function(){
		var t = this;
		var v = t.sanitize(arguments);
		t.x -= v.x;
		t.y -= v.y;
		return t;
	},
	mul:function(num){
		num = parseFloat(num);
		var t = this;
		t.x *= num;
		t.y *= num;
		return t;
	},
	div:function(num){
		num = parseFloat(num);
		var t = this;
		t.x /= num;
		t.y /= num;
		return t;
	},
	length:function(){
		var t = this;
		return Math.sqrt((t.x*t.x) + (t.y*t.y));
	},
	sqlen:function(){
		var t = this;
		return ((t.x*t.x) + (t.y*t.y));
	},
	scale:function(){
		var t = this;
		var v = t.sanitize(arguments);
		t.x *= v.x;
		t.y *= v.y;
		return t;
	},
	//returns RADIANS
	angle:function(){
		return Math.atan2(this.y,this.x);
	},
	rotate:function(r){
		var t = this;
		var r = parseFloat(r); //in Radians
		var currentRotation = t.angle(); //in Radians
		var currentLength = t.length();
		t.x = Math.cos(currentRotation + r) * currentLength;
		t.y = Math.sin(currentRotation + r) * currentLength;
		return t;
	},
	rotateAround: function(r, o){
		//THIS METHOD IS BUGGY! IMPROVE IT MORE LATER!
		var t = this;
		t.sub(o).rotate(r).add(o);
		return t;
	},
	distance:function(){
		var v = this.sanitize(arguments);
		return t.clone().sub(v).length();
	},
	set:function(){
		var v = this.sanitize(arguments);
		this.x = v.x;
		this.y = v.y;
		return this;
	},
	toString:function(){
		return 'Vec2 { x:'+this.x+', y:'+this.y+'}';
	},
	toUrlString:function(){
		return this.x+this.sep+this.y;
	},
	clone:function(){
		return new Vec2(this);
	},
	normalize:function(){
		this.div(this.length());
		return this;
	}
};