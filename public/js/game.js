var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var width = config.width;
var height = config.height;

var game = new Phaser.Game(config);

var amogus_backpack;
var amogus_body;
var amogus_foot;
var amogus_visor;
var amogus_arm;

var amogus_position = {
	x: width/2,
	y: height/2
}

var amogus_backpack_position = {
	x: 0,
	y: 0
}

var amogus_visor_position = {
	x: 0,
	y: 0
}

var amogus_arm_position = {
	x: 0,
	y: 0
}

var amogus_foot_position = {
	x: 0,
	y: 0
}

function preload ()
{
	this.load.image('amogus_body', '/assets/amogus/body.png');
	this.load.image('amogus_arm', '/assets/amogus/arm.png');
	this.load.image('amogus_backpack', '/assets/amogus/backpack.png');
	this.load.image('amogus_foot', '/assets/amogus/foot.png');
	this.load.image('amogus_visor', '/assets/amogus/visor.png');
	
	this.load.image('greenlines', '/assets/greenlines.png');
}

function create ()
{
	amogus_backpack = this.add.image(amogus_position.x, amogus_position.y, 'amogus_backpack');
	amogus_backpack.setScale(4);
	
	amogus_body = this.add.image(width/2, height/2, 'amogus_body');
	amogus_body.setScale(4);
	
	amogus_foot = this.add.image(width/2, height/2, 'amogus_foot');
	amogus_foot.setScale(4);
	
	amogus_visor = this.add.image(width/2, height/2, 'amogus_visor');
	amogus_visor.setScale(4);
	
	amogus_arm = this.add.image(width/2, height/2, 'amogus_arm');
	amogus_arm.setScale(4);
	
	var l1 = this.add.image(width*0.2, height*0.4, 'greenlines');
	l1.setScale(3);
	
	var l2 = this.add.image(width*0.8, height*0.4, 'greenlines');
	l2.setScale(-3, 3);

}

function update(timestep, dt){
	
	var time = timestep / 1000;

	var origin = {
		x: width/2,
		y: height* 0.4
	}
	
	
	//Backpack
	amogus_backpack_position.y = Math.sin(time*7)*7;
	
	amogus_backpack.setPosition(
		amogus_position.x + amogus_backpack_position.x,
		amogus_position.y + amogus_backpack_position.y
	);
		
	//Visor
	amogus_visor_position.y = Math.sin((time+1.2)*8)*3;
		
	amogus_visor.setPosition(
		amogus_position.x + amogus_visor_position.x,
		amogus_position.y + amogus_visor_position.y
	);
		
	//Arm
	amogus_arm_position.y = Math.sin((time+0.7)*9)*4;
		
	amogus_arm.setPosition(
		amogus_position.x + amogus_arm_position.x,
		amogus_position.y + amogus_arm_position.y
	);
	
	//foot
	amogus_foot_position.y = Math.sin((time+2.2)*8)*4;
		
	amogus_foot.setPosition(
		amogus_position.x + amogus_foot_position.x,
		amogus_position.y + amogus_foot_position.y
	);
	
	
	amogus_position.x = origin.x + Math.sin((time+2.2)*3)*20;
	amogus_position.y = origin.y + Math.sin((time+2.2)*6)*10;
	
	//Body	
	amogus_body.setPosition(
		amogus_position.x,
		amogus_position.y
		);
	
}