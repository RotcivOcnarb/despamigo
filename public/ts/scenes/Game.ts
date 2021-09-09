import Phaser from 'phaser';
import Amogus from '../objects/Amogus';
import Vector2 from '../utils/Vector2';
import * as WebFont from "webfontloader";
import Alavanca from '../patterns/Alavanca';
import BulletPattern from '../patterns/BulletPattern';
import Asteroids from '../patterns/Asteroids';
import AimCross from '../patterns/AimCross';
import Upload from '../patterns/Upload';

enum MenuType{
  Unselected,
  Fight, 
  Act,
  Item,
  Mercy,
  PreBattle,
  Battle
}

export default class AmogusScene extends Phaser.Scene {

  
  gameTime: number;
  amogus: Amogus;
  screen_size: Vector2;
  origin: Vector2;
  hp: number = 20;
  invulnerable: number = 0;
  cameraPosition: Vector2 = new Vector2(0, 0);
  amogus_trust: number = 0;
  hardMode: boolean;

  //Text box
  boxtext;
  statText;
  graphics: Phaser.GameObjects.Graphics;
  textvalue: string;
  hprect;

  neutralTexts = [
    "You kinda sus bro",
    "I can teach you how to drip...",
    "I suspects you...",
    "You.. are impostor?"
  ];

  trustTexts = [
    "i love you",
    "You no impostor!!",
    "ELECTROENCEPHALOGRAPHY (EEG) IS AN ELECTROPHYSIOLOGICAL MONITORING METHOD TO RECORD ELECTRICAL ACTIVITY ON THE SCALP THAT HAS BEEN SHOWN TO REPRESENT THE MACROSCOPIC ACTIVITY OF THE SURFACE LAYER OF THE BRAIN UNDERNEATH. IT IS TYPICALLY NON-INVASIVE, WITH THE ELECTRODES PLACED ALONG THE SCALP. ELECTROCORTICOGRAPHY, INVOLVING INVASIVE ELECTRODES, IS SOMETIMES CALLED INTRACRANIAL EEG.",
    "I trust you..."
  ]

  //Rect
  targetRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  textRect;
  menuRect;
  battleRect;

  //keys
  keyUp;
  keyDown;
  keyRight;
  keyLeft;
  keySelect;
  keyBack;

  onPressLeft = () => {};
  onPressRight = () => {};
  onPressUp = () => {};
  onPressDown = () => {};
  onPressSelect = () => {};
  onPressBack = () => {};

  upKeyPressed: boolean;
  downKeyPressed: boolean;
  leftKeyPressed: boolean;
  rightKeyPressed: boolean;
  selectKeyPressed: boolean;
  backKeyPressed: boolean;

  //Buttons
  buttons = {};
  buttonimagenames = [
    "fight",
    "act",
    "item",
    "mercy"
  ];
  heart: Phaser.GameObjects.Image;
  heartMoving: boolean;
  buttonselected: number = 0;

  //Horizontal Group;
  containerwidth;
  modwidth;
  buttonwidth ;
  space1;
  statPosition: Vector2;
  prebattlebubblemessage: string;

  //Interaction controls
  selectedOption: number = 0;
  selectingOption: boolean = true;

  textAnimationStart: number = 0;
  gameFinished: boolean = false;


  options = [
    MenuType.Fight,
    MenuType.Act,
    MenuType.Item,
    MenuType.Mercy
  ]

  targetOptions = [
    "Amogus"
  ];

  //Act controls
  actOptions = [
    "Check",
    "Suspect",
    "Trust",
    "Ask the info"
  ]
  actTargetSelected: boolean;

  //Item controls
  itemOptions = [
    "Choccy milk",
    "Steamed Hams",
    "Cigarette", //you have cancer now (toma dano)
    "Cum"
  ]

  //mercy controls
  mercyOptions = [
    "Spare"
  ]


  trustProgressBubbles = [
    "please don't kill me",
    "you... impostor?",
    "could you not be impostor?",
    "i'm believing you...",
    "you are not impostor!!!"
  ]

  textOptions = []; //Objetos de texto (não as strings)
  stringOptions = []; //strings dos objetos de texto

  menuType: MenuType = MenuType.Unselected;

  //Battle
  heartPosition: Vector2;
  bulletPatterns = [];
  currentPattern: BulletPattern;
  bullets = [];

  //Attack
  attacK_bar: Phaser.GameObjects.Image;
  attack_timer: number;
  needle: Phaser.GameObjects.Image;
  needle_sprites = [
    "needle_default",
    "needle_inverted"
  ]
  attack_executed: boolean;
  needle_position: number;
  dmg_animation: Phaser.GameObjects.Image;
  dmg_start_time: number = 0;
  can_spare: boolean = false;

  //Audio

  music: Phaser.Sound.BaseSound
  movemenu: Phaser.Sound.BaseSound
  select: Phaser.Sound.BaseSound
  target: Phaser.Sound.BaseSound
  squeak: Phaser.Sound.BaseSound
  voice: Phaser.Sound.BaseSound
  damage: Phaser.Sound.BaseSound
  heal: Phaser.Sound.BaseSound
  punchstrong: Phaser.Sound.BaseSound
  punchweak: Phaser.Sound.BaseSound

  textIndex: number;

  constructor() {
    super('GameScene');

    this.screen_size = new Vector2(
      window.innerWidth,
      window.innerHeight
    )

    this.origin = new Vector2(
      this.screen_size.x/2,
      this.screen_size.y* 0.25
    )

    this.menuRect = {
      x: this.screen_size.x * 0.2,
      y: this.screen_size.y - 490,
      width: this.screen_size.x * 0.6,
      height: 250
    }

    this.battleRect = {
      x: this.screen_size.x * 0.4,
      y: this.screen_size.y - 520,
      width: this.screen_size.x * 0.2,
      height: 300
    }

    this.textRect = {
      x: this.screen_size.x * 0.2,
      y: this.screen_size.y - 490,
      width: this.screen_size.x * 0.6,
      height: 250
    }
    this.setTargetRect(this.menuRect);

    this.statPosition = new Vector2(
      this.screen_size.x * 0.2,
      this.screen_size.y - 220
    )

    this.containerwidth = this.screen_size.x * .8;
    this.modwidth = this.containerwidth/4;
    this.buttonwidth = 110 * 3;
    this.space1 = (this.containerwidth - this.buttonwidth*4) / 8;

    this.hprect = {
      x: this.statPosition.x + 510,
      y: this.statPosition.y + 15,
      width: 50,
      height: 40
    }

    this.amogus = new Amogus(this);

    this.bulletPatterns.push(new Upload(this));
    this.bulletPatterns.push(new AimCross(this));
    this.bulletPatterns.push(new Asteroids(this));
    this.bulletPatterns.push(new Alavanca(this));


    this.textvalue = this.neutralTexts[Math.floor(Math.random() * this.neutralTexts.length)];
  }

  preload() {
    this.amogus.preload();
    this.load.image('greenlines', '/assets/greenlines.png');

    for(var i = 0; i < 4; i ++){
      this.loadImage(this, this.buttonimagenames[i] + "_idle", "/assets/ui");
      this.loadImage(this, this.buttonimagenames[i] + "_selected", "/assets/ui");
    }

    this.loadImage(this, "heart", "/assets");

    for(var i = 0; i < this.bulletPatterns.length; i ++){
      this.bulletPatterns[i].preload();
    }

    for(var i = 0; i < 6; i ++){
      this.load.image('atck_' + i, '/assets/dmg/'+i+'.png');
    }
    this.load.image("attack_bar", "/assets/attack_bar.png");
    this.load.image("needle_default", '/assets/dmg/needle_default.png');
    this.load.image("needle_inverted", '/assets/dmg/needle_inverted.png');

    this.load.image("spare_particle", "/assets/spare_particle.png");

    this.load.audio('theme', [
      'assets/audio/eurobeat.ogg',
      'assets/audio/eurobeat.mp3'
    ]);

    this.loadAudioOggWav("movemenu", "/assets/audio");
    this.loadAudioOggWav("select", "/assets/audio");
    this.loadAudioOggWav("target", "/assets/audio");
    this.loadAudioOggWav("squeak", "/assets/audio");
    this.loadAudioOggWav("voice", "/assets/audio");
    this.loadAudioOggWav("damage", "/assets/audio");
    this.loadAudioOggWav("heal", "/assets/audio");
    this.loadAudioOggWav("punchstrong", "/assets/audio");
    this.loadAudioOggWav("punchweak", "/assets/audio");
  }

  loadAudioOggWav(name, path){
    this.load.audio(name, [
      //path + "/"+name+".ogg",
      path + "/"+name+".wav",
    ])
  }

  loadImage(game, id, path){
    game.load.image(id, path + "/" + id + ".png");
  }

  init(){
    this.addFont("Determination", "assets/fonts/Determination.ttf", "truetype");
    this.addFont("Crypt", "assets/fonts/Crypt.ttf", "truetype");
    this.addFont("Attack", "assets/fonts/Attack.ttf", "truetype");
    this.addFont("Attack_Reverse", "assets/fonts/Attack_Reverse.ttf", "truetype");
  }

  addFont(name:string, path: string, format: string){
    var element = document.createElement('style');
    document.head.appendChild(element);
    var sheet = element.sheet as CSSStyleSheet;
    var styles = '@font-face { font-family: "'+name+'"; src: url("'+path+'") format("'+format+'"); }\n';
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

    this.graphics = this.add.graphics();

    WebFont.load({
      custom: {
          families: ['Determination', 'Crypt', 'Attack', 'Attack_Reverse']
      },
      active: function ()
      {
        self.boxtext = add.text(self.textRect.x + 20, self.textRect.y + 20, self.textvalue, {
          fontFamily: 'Determination',
          fontSize: "50px",
          color: '#ffffff',
          wordWrap: { 
            width: self.textRect.width
          }
        });

        //Nome e level
        add.text(self.statPosition.x + 10, self.statPosition.y + 20, "yudi  lv 1", {
          fontFamily: 'Crypt',
          fontSize: "30px",
          color: '#ffffff',
          wordWrap: { 
            width: self.textRect.width
          }
        });
 
        //HP Label
        add.text(self.statPosition.x + 450, self.statPosition.y + 25, "HP", {
          fontFamily: 'Crypt',
          fontSize: "20px",
          color: '#ffffff',
          wordWrap: { 
            width: self.textRect.width
          }
        });

        //HP Stat
        self.statText = add.text(self.statPosition.x + 590, self.statPosition.y + 20, "20/20", {
          fontFamily: 'Crypt',
          fontSize: "30px",
          color: '#ffffff',
          wordWrap: { 
            width: self.textRect.width
          }
        });

        var cont = 0;
        for(var i =0 ; i < 2; i ++){
          for(var j = 0; j < 2; j ++){
            let txt = add.text(self.textRect.x + i * 450 + 200, self.textRect.y + j * 100 + 40, "* " + self.actOptions[cont], {
              fontFamily: 'Determination',
              fontSize: "50px",
              color: '#ffffff',
              wordWrap: { 
                width: self.textRect.width / 2
              }
            });
            txt.setVisible(false);
            self.textOptions.push(txt);
            cont++;
          }
        }

        self.amogus.fontload();
        for(var i = 0; i < self.bulletPatterns.length; i ++){
          self.bulletPatterns[i].fontload();
        }

      }
    });

    	//key inputs
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keySelect = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyBack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);


    for(var i = 0; i < 4; i ++){
      var nm = this.buttonimagenames[i];
      
      this.buttons[nm] = this.add.image((this.screen_size.x - this.containerwidth)/2 + this.modwidth*i + this.buttonwidth/2 + this.space1, this.screen_size.y * 0.9, nm + '_idle');
      this.buttons[nm].setScale(3);
    }

    this.heart = this.add.image((this.screen_size.x - this.containerwidth)/2 + this.modwidth*0 + this.buttonwidth/2 + this.space1 - 100, this.screen_size.y * 0.9, 'heart');
	  this.heart.setScale(3 * 1.2);
    
    for(var i = 0; i < this.bulletPatterns.length; i ++){
      this.bulletPatterns[i].create();
    }

    this.attacK_bar = this.add.image(this.textRect.x + this.textRect.width/2, this.textRect.y + this.textRect.height/2, "attack_bar");
    this.attacK_bar.setScale(2);
    this.attacK_bar.setVisible(false);

    this.needle = this.add.image(this.menuRect.x + 20, this.menuRect.y + this.menuRect.height/2, "needle_default");
    this.needle.setScale(1.8);

    this.dmg_animation = this.add.image(this.screen_size.x/2, this.screen_size.y * 0.2, "atck_0");
    this.dmg_animation.setScale(3);

    this.createAudios();

  }

  createAudios(){
    this.music = this.sound.add('theme', {
      loop: true
    });
    this.music.play();

    this.movemenu = this.sound.add("movemenu");
    this.select = this.sound.add("select");
    this.target = this.sound.add("target");
    this.squeak = this.sound.add("squeak");
    this.voice = this.sound.add("voice");
    this.damage = this.sound.add("damage");
    this.heal = this.sound.add("heal");
    this.punchstrong = this.sound.add("punchstrong");
    this.punchweak = this.sound.add("punchweak");
  }
  
  spawnParticle(){
    var sparePart = this.add.particles("spare_particle");
    sparePart.createEmitter({
      x: this.amogus.amogus_position.x /2,
      y: (this.amogus.amogus_position.y) / 2,
      lifespan: {min: 500, max: 1000},
      speed: {min: 200, max: 500},
      scale: { start: 1, end: 0 },
      frequency: 10000,
      quantity: 10,
      alpha: {start: 1, end: 0},
    });

    sparePart.addGravityWell({
      active: true,
      x: 0,
      y: 0,
      power: 0,
      epsilon: 0,
      update: (p) => {
        p.velocityX *= 0.95;
        p.velocityY *= 0.95;
      }
    });

    sparePart.setScale(2);

    setTimeout(() => {
      sparePart.destroy();
    }, 2000);
  }

  overlapPointPixelPerfect(point: Vector2, image: Phaser.GameObjects.Image){
    if(!image) return false;

    var hp = new Vector2(point.x, point.y);

    hp.x -= image.getTopLeft().x;
    hp.y -= image.getTopLeft().y;

    hp.rotate(-image.rotation);

    if(hp.x > 0 && hp.x < image.getBounds().width){
      if(hp.y > 0 && hp.y < image.getBounds().height){
        return this.textures.getPixelAlpha(hp.x / image.scaleX, hp.y / image.scaleY, image.texture.key) > 100;
      }
    }
    return false;
  }

  calculateHeartPosition(callback){
    if(this.heart){

      var worldPointCheck = {
        x: this.heart.getBounds().x,
        y: this.heart.getBounds().y,
        width: this.heart.getBounds().width,
        height: this.heart.getBounds().height
      }

      for(var i = worldPointCheck.x; i < worldPointCheck.x + worldPointCheck.width; i+= 5){
        for(var j = worldPointCheck.y; j < worldPointCheck.y + worldPointCheck.height; j+= 5){
            var heartPoint = this.overlapPointPixelPerfect(new Vector2(i, j), this.heart);

            for(var b = 0; b < this.bullets.length; b ++){
              var bulletPoint = this.overlapPointPixelPerfect(new Vector2(i, j), this.bullets[b]);
              if(heartPoint && bulletPoint){
                callback();
              }
            }
        }
      }
    }
  }

  update(timestep, dt){
    this.gameTime = timestep / 1000;

    this.amogus.update(timestep, dt);
    this.graphics.clear();

    this.invulnerable -= dt / 1000;

    this.cameraPosition.x += (0 - this.cameraPosition.x) / 5 * dt/1000 * 60;
    this.cameraPosition.y += (0 - this.cameraPosition.y) / 5 * dt/1000 * 60;

    this.cameras.main.setPosition(this.cameraPosition.x, this.cameraPosition.y);

    //Retangulo da text box

    if(Math.abs(this.targetRect.x - this.textRect.x) < 20) this.textRect.x = this.targetRect.x;
    var dx = Math.sign(this.targetRect.x - this.textRect.x);
    this.textRect.x += dx * dt * 0.5 * 2;

    if(Math.abs(this.targetRect.y - this.textRect.y) < 20) this.textRect.y = this.targetRect.y;
    var dy = Math.sign(this.targetRect.y - this.textRect.y);
    this.textRect.y += dy * dt * 0.5 * 2;

    if(Math.abs(this.targetRect.width - this.textRect.width) < 20) this.textRect.width = this.targetRect.width;
    var dw = Math.sign(this.targetRect.width - this.textRect.width);
    this.textRect.width += dw * dt * 2;

    if(Math.abs(this.targetRect.height - this.textRect.height) < 20) this.textRect.height = this.targetRect.height;
    var dh = Math.sign(this.targetRect.height - this.textRect.height);
    this.textRect.height += dh * dt * 2;


    var color = 0xffffff;
    var thickness = 8;
    var alpha = 1;
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillRect(this.textRect.x, this.textRect.y, this.textRect.width, this.textRect.height);

    this.graphics.lineStyle(thickness, color, alpha);
    this.graphics.strokeRect(this.textRect.x, this.textRect.y, this.textRect.width, this.textRect.height);

    //Contador de HP
    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillRect(this.hprect.x, this.hprect.y, this.hprect.width, this.hprect.height);

    this.graphics.fillStyle(0xffff00, 1);
    this.graphics.fillRect(this.hprect.x, this.hprect.y, this.hp / 20 * this.hprect.width, this.hprect.height);

    this.updateInput();

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
    this.attacK_bar.setVisible(false);
    this.needle.setVisible(false);
    this.dmg_animation.setVisible(false);

    if(this.textOptions[0])
    (this.textOptions[0] as Phaser.GameObjects.Text).setColor("#ffffff");

    switch(this.menuType){
      case MenuType.Unselected:
        this.inputUnselected();
        break;
      case MenuType.Fight:
        this.inputAttack();
          break;
      case MenuType.Act:
        this.inputAct();
        break;
      case MenuType.Item:
        this.inputItem();
        break;
      case MenuType.Mercy:
        this.inputMercy();
        break;
      case MenuType.Battle:
        this.inputBattle(dt);
        break;
      case MenuType.PreBattle:
        this.inputPreBattle();
        break;
    }

    if(this.statText)
      this.statText.setText(Math.floor(this.hp) + "/20");

    if(this.boxtext){	
      var cts = Math.floor((this.gameTime - this.textAnimationStart) * 20);
      cts = Math.min(Math.max(0, cts), this.textvalue.length);
      if(cts > 0)
        this.boxtext.setText("* " + this.textvalue.substring(0, cts));
      else this.boxtext.setText("");

      if(this.textIndex != cts && this.boxtext.visible){
        if(this.textvalue.substring(cts-1, cts) != " ")
        this.voice.play();
      }

      this.textIndex = cts;
    }

    var heartAlpha = 1;

    if(this.invulnerable > 0){
      heartAlpha = (Math.sin(this.gameTime * 50) + 1)/2 * 0.7 + 0.3
    }

    this.heart.setAlpha(heartAlpha);

    this.calculateHeartPosition(() => {
      this.damagePlayer();
    });
  }

  damagePlayer(){
    if(this.invulnerable < 0){
      this.hp -= 5;
      this.invulnerable = 1;
      this.cameraPosition.x = Math.random() * 80 - 40;
      this.cameraPosition.y = Math.random() * 80 - 40;
      this.damage.play();
      if(this.hp <= 0){
        this.hp = 0;
        this.scene.switch("GameOver");
        this.music.stop();
      }
    }
  }

  updateInput(){
      //Inputs
      if(this.keyLeft.isDown){
        if(!this.leftKeyPressed){
          this.leftKeyPressed = true;
          this.onPressLeft();
        }
      }
      else this.leftKeyPressed = false;
      
      if(this.keyRight.isDown){
        if(!this.rightKeyPressed){
          this.rightKeyPressed = true;
          this.onPressRight();
        }
      }
      else this.rightKeyPressed = false;

      if(this.keyUp.isDown){
        if(!this.upKeyPressed){
          this.upKeyPressed = true;
          this.onPressUp();
        }
      }
      else this.upKeyPressed = false;

      if(this.keyDown.isDown){
        if(!this.downKeyPressed){
          this.downKeyPressed = true;
          this.onPressDown();
        }
      }
      else this.downKeyPressed = false;

      if(this.keySelect.isDown){
        if(!this.selectKeyPressed){
          this.selectKeyPressed = true;
          this.onPressSelect();
        }
      }
      else this.selectKeyPressed = false;

      if(this.keyBack.isDown){
        if(!this.backKeyPressed){
          this.backKeyPressed = true;
          this.onPressBack();
        }
      }
      else this.backKeyPressed = false;
  }

  setTargetRect(rect){
    this.targetRect.x = rect.x;
    this.targetRect.y = rect.y;
    this.targetRect.width = rect.width;
    this.targetRect.height = rect.height;
  }

  inputUnselected(){

    this.setTargetRect(this.menuRect);

    if(this.boxtext)
      this.boxtext.setVisible(true);

    for(var i = 0; i < this.textOptions.length; i ++){
      if(this.textOptions[i])
        this.textOptions[i].setVisible(false);
    }

      //Inputs
      this.onPressLeft = () => {
        if(this.gameFinished) return;
        if(this.buttonselected > 0){ 
          this.buttonselected--;
          this.squeak.play();
        }
      }

      this.onPressRight  = () => {
        if(this.gameFinished) return;
        if(this.buttonselected < 3){ 
          this.buttonselected++;
          this.squeak.play();
        }
      }

      this.onPressUp = () => {};
      this.onPressDown = () => {};

      this.onPressSelect = () => {
        if(this.gameFinished) return;
        this.menuType = this.options[this.buttonselected];
        this.setInputSelection(this.stringOptions);
        this.selectedOption = 0;
        this.attack_timer = this.gameTime;
        this.select.play();
      }

      this.onPressBack = () => {}

      this.heart.setPosition((this.screen_size.x - this.containerwidth)/2 + this.modwidth*this.buttonselected + this.buttonwidth/2 + this.space1 - 110, this.screen_size.y * 0.9);

  }

  setInputSelection(stringTexts){
    this.stringOptions = stringTexts;
  }

  inputSelected(){
    if(this.boxtext)
      this.boxtext.setVisible(false);

    for(var i = 0; i < this.textOptions.length; i ++){
      if(this.textOptions[i]){
        this.textOptions[i].setVisible(i < this.stringOptions.length);
        this.textOptions[i].setText("* " + this.stringOptions[i]);
      }
    }

    this.onPressLeft = () => {
      if(this.stringOptions[this.selectedOption - 2]){
        this.selectedOption -= 2;
        this.target.play();
      }
    }
    this.onPressRight  = () => {
      if(this.stringOptions[this.selectedOption + 2]){
       this.selectedOption += 2;
       this.target.play();
      }
    }
    this.onPressUp = () => {
      if(this.stringOptions[this.selectedOption - 1]){
       this.selectedOption -= 1;
       this.target.play();
      }
    };
    this.onPressDown = () => {
      if(this.stringOptions[this.selectedOption + 1]) {
        this.target.play();
        this.selectedOption += 1;
      }
    };

    var x = Math.floor(this.selectedOption / 2);
    var y = this.selectedOption % 2;

    this.heart.setPosition(this.textRect.x + x * 450 + 150, this.textRect.y + y * 100 + 60);
    this.heart.setScale(3);
  }

  inputAct(){
    this.inputSelected();

    this.onPressSelect = () => {
      this.select.play();
      if(!this.actTargetSelected){
        this.actTargetSelected = true;
        this.selectedOption = 0;
      }
      else{

        switch(this.selectedOption){
          case 0: //Check
            this.setPreBattle("AMOGUS       \n atk 5 def 0         \nhe has DRIP", "amogus");
            break;
          case 1: //Suspect
            if(this.amogus_trust){
              this.setPreBattle("You have betrayed amogus, he now doesn't trust you anymore", "why");
              this.amogus_trust--;
              this.amogus_trust = Math.max(0, this.amogus_trust);
            }
            else{
              this.enterBattle();
              this.amogus.openTextBubble("You may be impostor.....", 4);
            }
            
            break;
          case 2: //Trust

              if(this.amogus_trust == 0){
                this.setPreBattle("Amogus still suspects you... keep going...", this.trustProgressBubbles[this.amogus_trust]);
              }
              else if(this.amogus_trust == 4){
                this.setPreBattle("Amogus accepts your trust, he trusts you now", this.trustProgressBubbles[this.amogus_trust]);
              }
              else{
                this.enterBattle();
              this.amogus.openTextBubble(this.trustProgressBubbles[this.amogus_trust], 4);
              }

              this.amogus_trust ++;
              this.amogus_trust = Math.min(this.amogus_trust, 4);
            break;
          case 3: //Ask Info
          //if(this.amogus_trust >= 4){

            console.log(window);
            console.log(window.parent);
            window.parent.postMessage("batatinha123", "http://despamigosecretoiiidesafioemtoquio.rotciv.dev.br");
            
            // window.addEventListener("message", event => {
            //   console.log("TYPESCRIPT recebeu " + event.data); 
            //   this.proceedToId(event.data);
            // });

            // var id = top.prompt("Digite seu ID", "");
            
          // } 
          // else{
          //   this.enterBattle();
          //   this.amogus.openTextBubble("No info!\n i suspects you....", 4);
          // }
            break;
        }
      }
    }

    this.onPressBack = () => {
      if(this.actTargetSelected){
        this.actTargetSelected = false;
        this.selectedOption = 0;
      }
      else{
        this.backToMenu();
      }
    }

    ///other stuff
    if(!this.actTargetSelected){
      this.setInputSelection(this.targetOptions);
    }
    else{
      this.setInputSelection(this.actOptions);
    }
  }

  proceedToId(id: string){
    var req = new XMLHttpRequest();
    this.music.stop();
    req.onload = (evt) => {

      console.log(req.responseText);

      this.setPreBattle("");
      this.gameFinished = true;

      

      var response;

      try{
        response = JSON.parse(req.responseText);
      }
      catch(e) {}

      var txts = [];

      var randomPrank = [
        "BOLSONARO",
        "TUCO DA GRANDE FAMILIA",
        "CACHORRO A A FOLOU",
        "SUA MÃE",
        "O TATA",
        "O BLUEZAO",
        "MARIANA EX DO PAULO",
        "GODOY MINION NO CU",
        "MINHOCA PEDÓFILO"
      ]

      var afterReveal = [
        "que merda hein",
        "podia ser melhor",
        "não vai ficar de pau duro hein",
        "que sorte!",
        "meus pesames",
        "não aceitamos trocas",
        "ouch, não queria ser você",
        "ah, esse vai ser moleza",
        "eu sei que é seu crush"
      ]

      if(response){
        //0qYsaxXWpKB6RWm1CEgg
        txts = [
          {
            text: "fala ae " + response.me,
            time: 2
          },
          {
            text: "agora é a hora da verdade hein kkk",
            time: 3
          },
          {
            text: "quer saber quem vc tirou?",
            time: 2
          },
          {
            text: "vc tirou: " + this.rand_array(randomPrank),
            time: 2
          },
          {
            text: "kk te zuei",
            time: 1
          },
          {
            text: "na vdd vc tirou o(a) " + response.other + " mesmo",
            time: 3
          },
          {
            text: this.rand_array(afterReveal),
            time: 3
          },
          {
            text: "(sim eu falo portugues agora)",
            time: 2
          },
        ];
        this.can_spare = true;
      }
      else{
        this.hardMode = true;

        txts = [
          {
            text: "que?",
            time: 1
          },
          {
            text: "que porra de id é esse",
            time: 2
          },
          {
            text: "tu copiou errado essa merda",
            time: 2
          },
          {
            text: "vai falar com a catherine e copia esse id direito",
            time: 3
          },
          {
            text: "e só de raiva os próximos golpes vão ser 10x mais dificeis",
            time: 4
          }
        ];
      }

      var dst = (i) => {
        var time = txts.slice(0, i).reduce((acc, v, i) => acc + v.time, 0);
        console.log("Agendando index " + i + " pra daqui " + time + " segundos");
        setTimeout(() => {
          this.amogus.openTextBubble(txts[i].text, txts[i].time - 0.1);
        }, time * 1000);
      }

      setTimeout(() => {
        this.gameFinished = false;
        this.enterBattle();
      }, txts.reduce((acc, v, i) => acc + v.time, 0) * 1000);

      for(var i = 0; i < txts.length; i ++){
        dst(i);
      }

    };
    req.open("GET", "http://"+location.hostname+":1337/quemtirei?id=" + id, true);
    req.send();
  }

  setPreBattle(message: string, bubble_message?: string){
    this.menuType = MenuType.PreBattle;
    this.textAnimationStart = this.gameTime;
    this.heart.setPosition((this.screen_size.x - this.containerwidth)/2 + this.modwidth*this.buttonselected + this.buttonwidth/2 + this.space1 - 110, this.screen_size.y * 0.9);
    this.textvalue = message;
    this.prebattlebubblemessage = bubble_message;
  }

  rand_array(array){
    return array[Math.floor(Math.random() * array.length)]
  }

  inputItem(){
    this.inputSelected();
    this.setInputSelection(this.itemOptions);

    this.onPressSelect = () => {
      var msg = "";
      switch(this.selectedOption){
        case 0: //Choccy Milk
          msg = "You recovered 10 HP";
          this.hp += 10;
          this.hp = Math.min(this.hp, 20);
          this.heal.play();
          break;
        case 1: //Steamed Hams
          msg = "An unforgettable luncheon!\n       You recovered 15 HP";
          this.hp += 15;
          this.hp = Math.min(this.hp, 20);
          this.heal.play();
          break;
        case 2: //Cigarette
          msg = "You have cancer now";
          break;
        case 3: //Cum
          msg = "nice";
          this.hp += 1;
          this.hp = Math.min(this.hp, 20);
          this.heal.play();
          break;
      }
      this.setPreBattle(msg);
    }

    this.onPressBack = () => {
      this.backToMenu()
    }

  }

  inputMercy(){
    this.inputSelected();
    this.setInputSelection(this.mercyOptions);

    if(this.can_spare)
      (this.textOptions[0] as Phaser.GameObjects.Text).setColor("#ffff00");

    this.onPressSelect = () => {
      if(!this.actTargetSelected){
        this.actTargetSelected = true;
        this.selectedOption = 0;
      }
      else{
        if(this.can_spare){
          this.amogus.setSpared();
          this.spawnParticle();
          this.exitBattle("You have spared AMOGUS");
          this.gameFinished = true;
        }
        else{
          this.enterBattle();
          this.amogus.openTextBubble("This isn't over!!", 4);
        }
      }
    }

    this.onPressBack = () => {
      if(this.actTargetSelected){
        this.actTargetSelected = false;
        this.selectedOption = 0;
      }
      else{
        this.menuType = MenuType.Unselected;
        this.textAnimationStart = this.gameTime;
      }
    }

    ///other stuff
    if(!this.actTargetSelected){
      this.setInputSelection(this.targetOptions);
    }
    else{
      this.setInputSelection(this.mercyOptions);
    }
  }

  enterBattle(){
    this.setTargetRect(this.battleRect);

    this.menuType = MenuType.Battle;
    this.heartPosition = new Vector2(
      this.targetRect.x + this.targetRect.width/2,
      this.targetRect.y + this.targetRect.height/2
    )

    this.bullets = [];

    this.currentPattern = this.bulletPatterns[Math.floor(Math.random() * this.bulletPatterns.length)];
    this.currentPattern.reset();

    if(this.prebattlebubblemessage)
      this.amogus.openTextBubble(this.prebattlebubblemessage, 4);
  }

  backToMenu(overrideText?: string){
    this.menuType = MenuType.Unselected;
    this.textAnimationStart = this.gameTime;
    this.heart.setScale(3 * 1.2);
    this.setTargetRect(this.menuRect);
    if(this.amogus_trust){
      var rnd = Math.floor(Math.random() * this.trustTexts.length);
      this.textvalue = this.trustTexts[rnd];
    }
    else{
      var rnd = Math.floor(Math.random() * this.neutralTexts.length);
      this.textvalue = this.neutralTexts[rnd];
    }

    if(overrideText){
      this.textvalue = overrideText;
    }
  }

  exitBattle(overrideText?: string){
    this.backToMenu(overrideText);
    this.textAnimationStart = this.gameTime + .5;
    this.menuType = MenuType.Unselected;
    this.bullets = [];
  }

  inputBattle(dt){
    
    this.onPressUp = () => {}
    this.onPressDown = () => {}
    this.onPressLeft = () => {}
    this.onPressRight = () => {}
    this.onPressSelect = () => {}
    this.onPressBack = () => {}

    var md = false;
    if(this.keyDown.isDown){
      this.heartPosition.y += dt * 0.5;
      md = true;
      if(this.heartPosition.y > this.textRect.y + this.textRect.height - 20){
        this.heartPosition.y = this.textRect.y + this.textRect.height - 20;
        md = false;
      }
    }

    var mu = false;
    if(this.keyUp.isDown){
      this.heartPosition.y -= dt * 0.5;
      mu = true;
      if(this.heartPosition.y < this.textRect.y + 20){
        this.heartPosition.y = this.textRect.y + 20;
        mu = false;
      }
    }

    var mr = false;
    if(this.keyRight.isDown){
      this.heartPosition.x += dt * 0.5;
      mr = true;
      if(this.heartPosition.x > this.textRect.x + this.textRect.width - 20){
        this.heartPosition.x = this.textRect.x + this.textRect.width - 20;
        mr = false;
      }
    }

    var ml = false;
    if(this.keyLeft.isDown){
      this.heartPosition.x -= dt * 0.5;
      ml = true;
      if(this.heartPosition.x < this.textRect.x + 20){
        this.heartPosition.x = this.textRect.x + 20;
        ml = false;
      }
    }

    this.heartMoving = md || mu || ml || mr;

    if(this.boxtext)
      this.boxtext.setVisible(false);

    for(var i = 0; i < this.textOptions.length; i ++){
      if(this.textOptions[i])
        this.textOptions[i].setVisible(false);
    }


    this.heart.setPosition(this.heartPosition.x, this.heartPosition.y);
    this.heart.setScale(2);

    this.currentPattern.update(dt);

    if(this.currentPattern.finished()){
      this.exitBattle();
    }
  }

  inputPreBattle(){
    if(this.boxtext)
      this.boxtext.setVisible(true);

    for(var i = 0; i < this.textOptions.length; i ++){
      if(this.textOptions[i])
        this.textOptions[i].setVisible(false);
    }

    this.onPressSelect = () => {
      if(this.gameFinished) return;
      this.enterBattle();
    }

    this.onPressBack = () =>{}
  }

  inputAttack(){

    this.onPressUp = () => {}
    this.onPressDown = () => {}
    this.onPressLeft = () => {}
    this.onPressRight = () => {}
    this.onPressBack = () => {}

    if(this.boxtext)
      this.boxtext.setVisible(false);

    for(var i = 0; i < this.textOptions.length; i ++){
      if(this.textOptions[i])
        this.textOptions[i].setVisible(false);
    }

    this.attacK_bar.setVisible(true);
    this.needle.setVisible(true);

    var alpha = (this.gameTime - this.attack_timer)

    if(this.attack_executed){
      alpha = this.needle_position;
      this.needle.setTexture(this.needle_sprites[Math.floor((this.gameTime * 10) % 2)]);
    }
    else{
      if(alpha > 1){
        alpha = 1;
        this.attack(alpha);
      }
    }

    var posx = this.lerp(this.menuRect.x + 20, this.menuRect.x + this.menuRect.width - 20, alpha);
    this.needle.x = posx;

    var frame = Math.floor((this.gameTime - this.dmg_start_time) * 10);
    
    if(frame < 6) {
      this.dmg_animation.setVisible(true);
      this.dmg_animation.setTexture("atck_" + frame);
    }
    else{
      this.dmg_animation.setVisible(false);
    }

    this.onPressSelect = () => {
      if(!this.attack_executed){
        this.attack(alpha);
      }
    }

  }

  attack(alpha: number){
    this.needle_position = alpha;
    this.dmg_start_time = this.gameTime;
    this.attack_executed = true;
    this.amogus_trust = 0;

    var map_alpha = 1 - Math.abs(2 * alpha - 1);
    var dmg = Math.floor(this.lerp(5, 20, map_alpha));

    setTimeout(() => {
      this.cameraPosition.x = Math.random() * 80 - 40;
      this.cameraPosition.y = Math.random() * 80 - 40;
      this.amogus.shake = 1;
      this.amogus.damage(dmg);

      if(map_alpha > 0.7) this.punchstrong.play();
      else this.punchweak.play();

    }, 1000 * 0.6);

    setTimeout(() => {
      if(this.amogus.health > 0){
        this.enterBattle();
        this.amogus.openTextBubble("YOU ARE IMPOSTOR!!!!", 4);
        this.attack_executed = false;
      }

    }, 1000 * 1.5);
  }

  lerp (value1, value2, amount) {
      amount = Math.max(0, amount);
      amount = Math.min(1, amount);
      return (1 - amount) * value1 + amount * value2;
  }

}

