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

var newControlType = document.createElement('select'); //newControlType
optionList = ['Line','Circle','Group'];
for(var i = 0; i < optionList.length; i += 1){
	var option = document.createElement('option');
	option.value = optionList[i];
	option.innerHTML = optionList[i];
	newControlType.appendChild(option);
}
var nCTClick = function(e){
	console.log(e);
	e.stopPropagation(); //Have to do this because otherwise the window's e.preventDefault gets in the way and breaks the select menu and input buttons. Eesh!
}
newControlType.addEventListener('mousedown',nCTClick,true);
var newControlButton = document.createElement('input'); //newControlButton
newControlButton.type = 'button';
newControlButton.value = 'New Control';
var addControl = function(e){
	s.mpos.down = false;
	var control = new window[newControlType.value]();
	s.add(control);
}
newControlButton.addEventListener('mousedown',addControl,false);
newControlButton.addEventListener('touchstart',addControl,false);

controlDiv.appendChild(newControlType);
controlDiv.appendChild(newControlButton);

var n = NPos2d;
var s = new n.Scene({
	frameRate:60,
	pixelScale: 1,
	lineWidth: 2,
	globalCompositeOperation: 'lighter',
});







var myLine = new Line({
	lineWidth: 2
});
var myPoint = new Point({pos:new Vec2(-50,100)});
myLine.add(myPoint);
var myOtherPoint = new Point({pos:new Vec2(50,150)});
myLine.add(myOtherPoint);

var myCircle = new Circle({
	pos:new Vec2(50,100),
	radius: 10,
	lineWidth: 2,
	fill: false
});


var myGroup = new Group({
	transforms:{
		pos: new Vec2(),
		rot: 10,
		scale: 0.9,
		mirrorX: 0,
		mirrorY: 0,
		iterations: 0
	},
});
myGroup.add(myCircle);
myGroup.add(myLine);
var myOtherGroup = new Group({
	transforms:{
		pos: new Vec2(),
		rot: tau/6,
		scale: 1,
		mirrorX: 0,
		mirrorY: 0,
		iterations: 0
	},
});
var myOtherOtherGroup = new Group({
	transforms:{
		pos: new Vec2(),
		rot: 0,
		scale: 1,
		mirrorX: 1,
		mirrorY: 0,
		iterations: 1
	},
});
var myOtherOtherOtherGroup = new Group({
	transforms:{
		pos: new Vec2(),
		rot: 0,
		scale: 1,
		mirrorX: 0,
		mirrorY: 1,
		iterations: 1
	},
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
