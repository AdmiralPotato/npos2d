NPos2d.Scene.prototype.drawSprite = function(o){
	var t = this,c = t.c;
	if(o.loaded){
		//offset the points by the object's position
		var p2 = o.pos.clone().sub(t.camera.pos);
		//Just some basic positional culling... if it's not on screen, don't render it...
		if((p2.x + (o.offset.x * o.scale) < t.cx && p2.x - (o.offset.x * o.scale) > -t.cx) && (p2.y + (o.offset.y * o.scale) < t.cy && p2.y - (o.offset.y * o.scale) > -t.cy)){
			c.save();
			//Antialiased
			c.translate(p2.x,p2.y);
			//Harder
			//c.translate(Math.round(p2.x),Math.round(p2.y));
			if(o.scale.x !== 1 || o.scale.y !== 1){
				c.scale(o.scale.x,o.scale.y);
			}
			if((o.rot + o.rotOffset) !== 0){
				c.rotate(o.rot + o.rotOffset);
			}
			if(o.numFrames > 1){
				if(o.frameState >= o.numFrames){
					o.frameState = 0;
				}
				c.drawImage(o.image, (o.width * Math.floor(o.frameState)), 0, o.width, o.height, o.offset.x, o.offset.y, o.width, o.height);
			}else{
				c.drawImage(o.image, o.offset.x, o.offset.y);
			}
			c.restore();
		}
	}
}
NPos2d.Scene.prototype.advanceSprite = function(o){
	o.frameState += 0.3; //Umm.... Something tells me this is wrong. I should test it extensively later.
	//console.log(o);
}

NPos2d.blessWithSpriteBase = function(o,config){
	o.path = config.path || o.path || false;
	if(!o.path){throw 'You MUST provide an image `path` value on sprite type objects!'};
	o.pos = config.pos || new Vec2();
	o.rot = config.rot || o.rot || 0;
	o.rotOffset = config.rotOffset || o.rotOffset || 0;
	o.scale = config.scale || o.scale || 1;
	o.numFrames = config.numFrames || o.numFrames || 1;
	o.frameState = o.numFrames;
	o.width = 0;
	o.height = 0;
	o.loaded = false;
	o.image = new Image();
	o.image.onload = function(){
		o.width = o.image.width / o.numFrames;
		o.height = o.image.height;
		o.offset = {
			x:-Math.round(o.width/2),
			y:-Math.round(o.height/2)
		};
		o.boundingBox = [[o.offset.x,o.offset.y,-32],[-o.offset.x,-o.offset.y,32]];
		o.loaded = true;
		//console.log(t);
	};
	o.image.src = o.path;
	o.advance = function(){
		o.scene.advanceSprite(this);
	} || o.advance;
	o.render = function(){
		o.scene.drawSprite(this);
	} || o.render;
	o.destroy = NPos2d.destroyFunc;
	return o;
}

NPos2d.Sprite = function(config){
	if(this === window){throw 'JIM TYPE ERROR'};
	var t = this;
	NPos2d.blessWithSpriteBase(t,config);
	return t;
}

NPos2d.Sprite.prototype = {
	update:function(s){
		this.advance();
		this.render();
	}
};