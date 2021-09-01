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
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var gamescale = 2.8;

var width = config.width;
var height = config.height;

var game = new Phaser.Game(config);

var amogus_backpack;
var amogus_body;
var amogus_foot;
var amogus_visor;
var amogus_arm;

var heart;

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

var origin = {
	x: width/2,
	y: height* 0.25
}

var graphics;

var buttons = {};
var buttonimagenames = [
	"fight",
	"act",
	"item",
	"mercy"
];

var boxtext;

var textvalue = " * You kinda sus bro";
var buttonselected = 0;

//keys
var keyUp;
var keyDown;
var keyRight;
var keyLeft;

var upKeyPressed = false;
var downKeyPressed = false;
var leftKeyPressed = false;
var rightKeyPressed = false;

var textRect = {
	x: width * 0.2,
	y: height - 490,
	width: width * 0.6,
	height: 250
	
}

function init(){
	var element = document.createElement('style');
	document.head.appendChild(element);
	var sheet = element.sheet;
    var styles = '@font-face { font-family: "Determination"; src: url("assets/fonts/Determination.ttf") format("truetype"); }\n';
    sheet.insertRule(styles, 0);
}

function preload ()
{
	this.load.image('amogus_body', '/assets/amogus/body.png');
	this.load.image('amogus_arm', '/assets/amogus/arm.png');
	this.load.image('amogus_backpack', '/assets/amogus/backpack.png');
	this.load.image('amogus_foot', '/assets/amogus/foot.png');
	this.load.image('amogus_visor', '/assets/amogus/visor.png');
	
	this.load.image('greenlines', '/assets/greenlines.png');
	
	loadImage(this, "heart", "/assets")
	
	for(var i = 0; i < 4; i ++){
		loadImage(this, buttonimagenames[i] + "_idle", "/assets/ui");
		loadImage(this, buttonimagenames[i] + "_selected", "/assets/ui");
	}
	
	this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	

	
}

function loadImage(game, id, path){
	
	game.load.image(id, path + "/" + id + ".png");
}

var containerwidth = width * .8;
var modwidth = containerwidth/4;
var buttonwidth = 110 * gamescale;
var space1 = (containerwidth - buttonwidth*4) / 8;

function create ()
{
	
	//key inputs
	keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
	keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
	
	var add = this.add;
    var input = this.input;

    WebFont.load({
        custom: {
            families: ['Determination']
        },
        active: function ()
        {
            boxtext = add.text(textRect.x + 10, textRect.y + 10, textvalue, { fontFamily: 'Determination', fontSize: 50, color: '#ffffff', wordWrap: { width: textRect.width } });
        }
    });
	
	var l1 = this.add.image(width*0.2, origin.y + 50, 'greenlines');
	l1.setScale(gamescale);
	
	var l2 = this.add.image(width*0.8, origin.y + 50, 'greenlines');
	l2.setScale(-gamescale, gamescale);
	
	amogus_backpack = this.add.image(amogus_position.x, amogus_position.y, 'amogus_backpack');
	amogus_backpack.setScale(gamescale);
	
	amogus_body = this.add.image(width/2, height/2, 'amogus_body');
	amogus_body.setScale(gamescale);
	
	amogus_foot = this.add.image(width/2, height/2, 'amogus_foot');
	amogus_foot.setScale(gamescale);
	
	amogus_visor = this.add.image(width/2, height/2, 'amogus_visor');
	amogus_visor.setScale(gamescale);
	
	amogus_arm = this.add.image(width/2, height/2, 'amogus_arm');
	amogus_arm.setScale(gamescale);
	

	
	graphics = this.add.graphics();
	

	
	for(var i = 0; i < 4; i ++){
		var nm = buttonimagenames[i];
		
		buttons[nm] = this.add.image((width - containerwidth)/2 + modwidth*i + buttonwidth/2 + space1, height * 0.9, nm + '_idle');
		buttons[nm].setScale(gamescale);
	}
	
	heart = this.add.image((width - containerwidth)/2 + modwidth*0 + buttonwidth/2 + space1 - 100, height * 0.9, 'heart');
	heart.setScale(gamescale * 1.2);

}

function update(timestep, dt){
	graphics.clear();
	
	var time = timestep / 1000;
	
	if(boxtext){	
		var cts = Math.floor(time * 15);
		cts = Math.min(cts, textvalue.length);
		boxtext.setText(textvalue.substring(0, cts));
	}
	
	if(keyLeft.isDown){
		if(!leftKeyPressed){
			leftKeyPressed = true;
			if(buttonselected > 0) buttonselected--;
			console.log("LEFT PRESSED");
		}
	}
	else leftKeyPressed = false;
	
	if(keyRight.isDown){
		if(!rightKeyPressed){
			rightKeyPressed = true;
			if(buttonselected < 3) buttonselected++;
			console.log("RIGHT PRESSED");
		}
	}
	else rightKeyPressed = false;

	//Retangulo
	var color = 0xffffff;
    var thickness = 4;
    var alpha = 1;
	graphics.fillStyle(0x000000, 1);
	graphics.fillRect(textRect.x, textRect.y, textRect.width, textRect.height);
	
	graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(textRect.x, textRect.y, textRect.width, textRect.height);

	heart.setPosition((width - containerwidth)/2 + modwidth*buttonselected + buttonwidth/2 + space1 - 110, height * 0.9);
	
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
		

	//Botoes
	for(var i = 0; i < 4; i ++){
		var nm = buttonimagenames[i];
		if(i == buttonselected){
			buttons[nm].setTexture(nm + "_selected");
		}
		else{
			buttons[nm].setTexture(nm + "_idle");
		}
	}
}