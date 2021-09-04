import Phaser from 'phaser';
import Amogus from '../objects/Amogus';
import Vector2 from '../utils/Vector2';
import * as WebFont from "webfontloader";

export default class AmogusScene extends Phaser.Scene {

  amogus: Amogus;
  screen_size: Vector2;
  origin: Vector2;

  //Text box
  boxtext;
  textRect;
  graphics;
  textvalue: string = " * You kinda sus bro";

  //keys
  keyUp;
  keyDown;
  keyRight;
  keyLeft;

  
  upKeyPressed: boolean;
  downKeyPressed: boolean;
  leftKeyPressed: boolean;
  rightKeyPressed: boolean;

  //Buttons
  buttons = {};
  buttonimagenames = [
    "fight",
    "act",
    "item",
    "mercy"
  ];
  heart;
  buttonselected: number = 0;

  //Horizontal Group;
  containerwidth;
  modwidth;
  buttonwidth ;
  space1;

  

  constructor() {
    super('GameScene');

    this.screen_size = {
      x: window.innerWidth,
      y: window.innerHeight
    }

    this.origin = {
      x: this.screen_size.x/2,
      y: this.screen_size.y* 0.25
    }

    this.textRect = {
      x: this.screen_size.x * 0.2,
      y: this.screen_size.y - 490,
      width: this.screen_size.x * 0.6,
      height: 250
    }

    this.containerwidth = this.screen_size.x * .8;
    this.modwidth = this.containerwidth/4;
    this.buttonwidth = 110 * 3;
    this.space1 = (this.containerwidth - this.buttonwidth*4) / 8;

    this.amogus = new Amogus(this);
  }

  preload() {
    this.amogus.preload();
    this.load.image('greenlines', '/assets/greenlines.png');

    for(var i = 0; i < 4; i ++){
      this.loadImage(this, this.buttonimagenames[i] + "_idle", "/assets/ui");
      this.loadImage(this, this.buttonimagenames[i] + "_selected", "/assets/ui");
    }

    this.loadImage(this, "heart", "/assets");
  }

  loadImage(game, id, path){
    game.load.image(id, path + "/" + id + ".png");
  }

  init(){
    var element = document.createElement('style');
    document.head.appendChild(element);
    var sheet = element.sheet;
    var styles = '@font-face { font-family: "Determination"; src: url("assets/fonts/Determination.ttf") format("truetype"); }\n';
    sheet.insertRule(styles, 0);
  }

  create() {

    var l1 = this.add.image(this.screen_size.x*0.2, this.origin.y + 50, 'greenlines');
    l1.setScale(3);
    
    var l2 = this.add.image(this.screen_size.x*0.8, this.origin.y + 50, 'greenlines');
    l2.setScale(-3, 3);

    this.amogus.create();

    var add = this.add;

    var self = this;

    WebFont.load({
      custom: {
          families: ['Determination']
      },
      active: function ()
      {
        self.boxtext = add.text(self.textRect.x + 10, self.textRect.y + 10, self.textvalue, { fontFamily: 'Determination', fontSize: "50px", color: '#ffffff', wordWrap: { width: self.textRect.width } });
      }
    });
    this.graphics = this.add.graphics();

    	//key inputs
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    for(var i = 0; i < 4; i ++){
      var nm = this.buttonimagenames[i];
      
      this.buttons[nm] = this.add.image((this.screen_size.x - this.containerwidth)/2 + this.modwidth*i + this.buttonwidth/2 + this.space1, this.screen_size.y * 0.9, nm + '_idle');
      this.buttons[nm].setScale(3);
    }

    this.heart = this.add.image((this.screen_size.x - this.containerwidth)/2 + this.modwidth*0 + this.buttonwidth/2 + this.space1 - 100, this.screen_size.y * 0.9, 'heart');
	  this.heart.setScale(3 * 1.2);
    

  }

  update(timestep, dt){
    var time = timestep / 1000;

    this.amogus.update(timestep, dt);
    this.graphics.clear();

    if(this.boxtext){	
      var cts = Math.floor(time * 15);
      cts = Math.min(cts, this.textvalue.length);
      this.boxtext.setText(this.textvalue.substring(0, cts));
    }

    //Retangulo
    var color = 0xffffff;
    var thickness = 4;
    var alpha = 1;
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillRect(this.textRect.x, this.textRect.y, this.textRect.width, this.textRect.height);

    this.graphics.lineStyle(thickness, color, alpha);
    this.graphics.strokeRect(this.textRect.x, this.textRect.y, this.textRect.width, this.textRect.height);

    this.heart.setPosition((this.screen_size.x - this.containerwidth)/2 + this.modwidth*this.buttonselected + this.buttonwidth/2 + this.space1 - 110, this.screen_size.y * 0.9);

    	//Botoes
    for(var i = 0; i < 4; i ++){
      var nm = this.buttonimagenames[i];
      if(i == this.buttonselected){
        this.buttons[nm].setTexture(nm + "_selected");
      }
      else{
        this.buttons[nm].setTexture(nm + "_idle");
      }
    }

    //Inputs
    if(this.keyLeft.isDown){
      if(!this.leftKeyPressed){
        this.leftKeyPressed = true;
        if(this.buttonselected > 0) this.buttonselected--;
      }
    }
    else this.leftKeyPressed = false;
    
    if(this.keyRight.isDown){
      if(!this.rightKeyPressed){
        this.rightKeyPressed = true;
        if(this.buttonselected < 3) this.buttonselected++;
      }
    }
    else this.rightKeyPressed = false;


  }
}

