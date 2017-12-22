/* 

Hey there! Welcome to the Eternity Quest!

Thanks for taking an interest in my backend code. 
Before you start digging through over two thousand lines of code,
I'd like to warn you that this was my first attempt at creating a game entirely in Javascript.

You may find evidence of a lack of proper planning, as I dived into this project with 0 experience,
and as a result, 0 expectations as to what I could and could not do.

You may also find a lack of object-oriented-ness, and an over abundance of global variables.
You will also find some ugly solutions to simple problems, as if a plumber
desperately threw duct tape and super glue at a mess of leaky pipes. 
Because honestly, this project has been a learning experience for me.
I threw myself into the deep end, and struggled to shore, thrashing and screaming.

But I made it nonetheless. I made THIS, and I am immensely proud of what I have achieved.

 */

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

var cookieManager;//EXTERNAL
var audioSynth;//EXTERNAL

var sizeManager;
var gameManager;
var assetManager;

var loader;
var transition;

var profileManager;
var profileMenu;
var profile;

var mainMenu;

var settings;
var settingsMenu;

var inventoryMenu;

var weaponManager;
var weaponType;
var projectileManager;

var preGame;

var gameUI;
var enemyManager;
var explosionManager;
var death;

var ctxTool;
var ui;
var avatar;

//INIT
init();
function init(){
    sizeManager = new SizeManager();
    sizeManager.resizeCanvas();
    
    gameManager = new GameManager();
    gameManager.changeGameState(0);
    
    loader = new Loader;
    
    //FIRST DRAW
    draw();
    
    //CTX TOOL
    ctxTool = new CtxTool();
    
    audioSynth = new AudioSynth();
    audioSynth.init();
    
    assetManager = new AssetManager();
    
    transition = new Transition();
    transition.bg = new Image();
    assetManager.addAsset(transition.bg, "img/eternityquest/bg-transition.png");
    
    profileManager = new ProfileManager();
    profileMenu = new ProfileMenu();
    profileMenu.bg = new Image();
    assetManager.addAsset(profileMenu.bg, "img/eternityquest/bg-profile.png");
    
    mainMenu = new MainMenu();
    mainMenu.bg = new Image();
    mainMenu.bgWarn = new Image();
    assetManager.addAsset(mainMenu.bg, "img/eternityquest/bg-menu-ch.png");
//    assetManager.addAsset(mainMenu.bg, "img/eternityquest/bg-menu.png");
    assetManager.addAsset(mainMenu.bgWarn, "img/eternityquest/bg-menu-warn.png");
    
    settingsMenu = new SettingsMenu();
    settingsMenu.bg = new Image();
    assetManager.addAsset(settingsMenu.bg, "img/eternityquest/bg-settings.png");
    
    inventoryMenu = new InventoryMenu();
    inventoryMenu.bgP = new Image();
    inventoryMenu.bgS = new Image();
    inventoryMenu.bgShop = new Image();
    inventoryMenu.btnLoadout = new Image();
    assetManager.addAsset(inventoryMenu.bgP, "img/eternityquest/bg-inventory-p.png");
    assetManager.addAsset(inventoryMenu.bgS, "img/eternityquest/bg-inventory-s.png");
    assetManager.addAsset(inventoryMenu.bgShop, "img/eternityquest/bg-inventory-shop.png");
    assetManager.addAsset(inventoryMenu.btnLoadout, "img/eternityquest/btn-loadout.png");
    
    //WEAPONS
    weaponType = {
        PROJECTILE_BASIC: 0,
        PROJECTILE_SP: 1,
        BEAM: 2,
        SECONDARY: 3
    };
    weaponManager = new WeaponManager();
    weaponManager.icon.lock = new Image();
    weaponManager.icon.blaster = new Image();
    weaponManager.icon.gatling = new Image();
    weaponManager.icon.fireball = new Image();
    weaponManager.icon.laser = new Image();
    weaponManager.icon.ray = new Image();
    weaponManager.icon.snowball = new Image();
    
    weaponManager.icon.emp = new Image();
    weaponManager.icon.shield = new Image();
    weaponManager.icon.oracleBeam = new Image();
    weaponManager.icon.snowflake = new Image();
    
    weaponManager.sprites.fireball = new Image();
    weaponManager.sprites.snowball = new Image();
    weaponManager.sprites.shield = new Image();
    weaponManager.sprites.laserPulse = new Image();
    weaponManager.sprites.blizzardEffect = new Image();
    
    assetManager.addAsset(weaponManager.icon.lock, "img/eternityquest/lock.png");
    assetManager.addAsset(weaponManager.icon.blaster, "img/eternityquest/blaster.png");
    assetManager.addAsset(weaponManager.icon.gatling, "img/eternityquest/gatling.png");
    assetManager.addAsset(weaponManager.icon.fireball, "img/eternityquest/fireball.png");
    assetManager.addAsset(weaponManager.icon.laser, "img/eternityquest/laser.png");
    assetManager.addAsset(weaponManager.icon.ray, "img/eternityquest/ray.png");
    assetManager.addAsset(weaponManager.icon.snowball, "img/eternityquest/snowball.png");
    
    assetManager.addAsset(weaponManager.icon.emp, "img/eternityquest/emp.png");
    assetManager.addAsset(weaponManager.icon.shield, "img/eternityquest/shield.png");
    assetManager.addAsset(weaponManager.icon.oracleBeam, "img/eternityquest/oracle-beam.png");
    assetManager.addAsset(weaponManager.icon.snowflake, "img/eternityquest/snowflake.png");
    assetManager.addAsset(weaponManager.sprites.shield, "img/eternityquest/shield-effect.png");
    assetManager.addAsset(weaponManager.sprites.laserPulse, "img/eternityquest/laser-pulse.png");
    assetManager.addAsset(weaponManager.sprites.blizzardEffect, "img/eternityquest/blizzard-effect.png");
    weaponManager.sprites.fireball = weaponManager.icon.fireball;
    weaponManager.sprites.snowball = weaponManager.icon.snowball;
    weaponManager.initWeapons();
    //PROJECTILES
    projectileManager = new ProjectileManager();
    
    avatar = new Avatar();
    avatar.sprite = new Image();
    assetManager.addAsset(avatar.sprite, "img/eternityquest/avatar.png");
    
    //PRE GAME
    preGame = new PreGame();
    preGame.bg = new Image();
    preGame.barTop = new Image();
    preGame.barBtm = new Image();
    assetManager.addAsset(preGame.bg, "img/eternityquest/bg.png");
    assetManager.addAsset(preGame.barTop, "img/eternityquest/bg-bar-top.png");
    assetManager.addAsset(preGame.barBtm, "img/eternityquest/bg-bar-btm.png");
    
    //GAME
    gameUI = new GameUI();
    gameUI.bg = new Image();
    gameUI.barTop = new Image();
    gameUI.barBtm = new Image();
    assetManager.addAsset(gameUI.bg, "img/eternityquest/bg.png");
    assetManager.addAsset(gameUI.barTop, "img/eternityquest/bg-bar-top.png");
    assetManager.addAsset(gameUI.barBtm, "img/eternityquest/bg-bar-btm.png");
    
    //ENEMY MANAGER
    enemyManager = new EnemyManager();
    enemyManager.sprite = new Image();
    enemyManager.bossSprite = new Image();
    assetManager.addAsset(enemyManager.sprite, "img/eternityquest/enemy.png");
    assetManager.addAsset(enemyManager.bossSprite, "img/eternityquest/boss1-32x22.png");
    
    //EXPLOSION MANAGER
    explosionManager = new ExplosionManager();
    explosionManager.sprite0 = new Image();
    explosionManager.sprite1 = new Image();
    explosionManager.sprite2 = new Image();
    assetManager.addAsset(explosionManager.sprite0, "img/eternityquest/explosion0.png");
    assetManager.addAsset(explosionManager.sprite1, "img/eternityquest/explosion1.png");
    assetManager.addAsset(explosionManager.sprite2, "img/eternityquest/explosion2.png");
    explosionManager.spriteArray = [explosionManager.sprite0, explosionManager.sprite1, explosionManager.sprite2];
    
    //DEATH
    death = new Death();
    death.bg = new Image();
    death.btnBack = new Image();
    assetManager.addAsset(death.bg, "img/eternityquest/bg-game.png");
    assetManager.addAsset(death.btnBack, "img/eternityquest/btn-back.png");
    
    //LOAD ASSETS
    assetManager.loadAll();
    
    //LOAD COOKIES / SETTINGS
    cookieManager = new CookieManager();
    settings = new Settings();
    
    //UI EVENT LISTENERS
    ui = new UI();
    ui.addEventListeners();
}

//SIZE MANAGER
function SizeManager(){
    this.spriteWidth;
    this.spriteHeight;
    this.fontSizeXS;
    this.fontSizeS;
    this.fontSizeM;
    this.fontSizeL;
    this.fontSizeInput;
    this.factor;
    this.resizeCanvas = function(){
        //300 400 // 375 500 // 450 600 // 525 700 // 600 800
       if(window.innerHeight >= 400 && window.innerWidth - 30 >= 300){
            canvas.width = 300;
            //canvas.height = 400;
        }
        if(window.innerHeight >= 500 && window.innerWidth - 30 >= 375){
            canvas.width = 375;
            //canvas.height = 500;
        }
        if(window.innerHeight >= 600 && window.innerWidth - 30 >= 450){
            canvas.width = 450;
            //canvas.height = 500;
        }
        if(window.innerHeight >= 700 && window.innerWidth - 30 >= 525){
            canvas.width = 525;
            //canvas.height = 700;
        }
        if(window.innerHeight >= 800 && window.innerWidth - 30 >= 600){
            canvas.width = 600;
            //canvas.height = 800;
        }

        canvas.height = canvas.width/3 *4;
        this.factor = canvas.height/800;
        this.spriteWidth = this.factor * 50;
        this.spriteHeight = this.factor * 50;
        this.fontSizeXS = this.factor * 20;
        this.fontSizeS = this.factor * 35;
        this.fontSizeM = this.factor * 45;
        this.fontSizeL = this.factor * 60;
        this.fontSizeInput = this.factor * 28;
    };
}

//GAME MANAGER
function GameManager(){
    this.gameState;
    this.profileLoaded = false;
    this.globalReset = function(){
        //SAVE SCORE
        avatar.gold += avatar.score;
        if(avatar.score >= avatar.highScore){ avatar.highScore = avatar.score; }
        profileManager.updateProfile();
        avatar.init();
        //RESET 
        avatar.coolDownReset();
        weaponManager.resetAllWeaponCoolDown();
        projectileManager.reset();
        enemyManager.reset();
        explosionManager.reset();
        preGame.reset();
        gameUI.resetUI();
    };
    this.changeGameState = function(target){
        var pState = this.gameState;
        this.gameState = target;
        switch(target){
            //LOADING
            case 0:
                canvas.style.cursor = "wait";
                break;
            //INTRO TRANSITION
            case 1:
                canvas.style.cursor = "none";
                break;
            //PROFILE MENU
            case 2:
                canvas.style.cursor = "default";
                break;
            //MAIN MENU
            case 3:
                canvas.style.cursor = "default";
                if(pState === 1 || pState === 2){
                    audioSynth.stopAllLoops();
                    audioSynth.playLoop(audioSynth.loop.BGM_MAIN_MENU);
                }
                break;
            //SETTINGS MENU
            case 4:
                canvas.style.cursor = "default";
                break;
            //INVENTORY/SHOP
            case 5:
                canvas.style.cursor = "default";
                break;
            //PRE GAME ANIMATION
            case 6:
                canvas.style.cursor = "none";
                audioSynth.stopAllLoops();
                audioSynth.playLoop(audioSynth.loop.BGM_GAME);
                audioSynth.playClip(audioSynth.clip.READY);
                break;
            //MAIN GAME
            case 7:
                canvas.style.cursor = "crosshair";
                break;
            //DEATH
            case 8:
                canvas.style.cursor = "none";
        }
    };
}

//ASSET MANAGER
function AssetManager(){
    this.loaded = false;
    this.assetArray = [];
    this.assetSrcArray = [];
    this.assetsLoaded = 0;
    this.addAsset = function(img, src){
        this.assetArray.push(img);
        this.assetSrcArray.push(src);
    };
    this.loadAll = function(){
        for(var i = 0 ; i < this.assetArray.length ; i++){
            this.assetArray[i].onload = function(){
                assetManager.assetsLoaded++;
                if(assetManager.assetsLoaded >= assetManager.assetArray.length){
                    assetManager.loaded = true;
                }
            };
            this.assetArray[i].src = this.assetSrcArray[i];
        }
    };
}

//PROFILE MANAGER
//profile0=Bob|000|0|0|10000|000
//ter|101|96|1062|10000100|00000000
// name | settings | highScore | gold | inventory | inventoryS
function ProfileManager(){
    this.profileArray = [];
    //this.profile;
    this.getAllProfiles = function(){
        this.profileArray = [];
        for(var i = 0 ; i < 3 ; i++){
            var data = cookieManager.getCookie("profile" + i);
            if(data){
                var profile = new Profile();
                profile.load(data, i);
                this.profileArray.push(profile);
            }
            else{
                this.profileArray.push(null);
            }
        }
        return this.profileArray;
    };
    this.createNewProfile = function(name, slot){
        var profile = new Profile(name);
        cookieManager.setCookie("profile" + slot, profile.toString());
        this.getAllProfiles();
    };
    this.saveProfile = function(slot){
        if(this.profileArray[slot]){
            cookieManager.setCookie("profile" + slot, this.profileArray[slot].toString());
        }
    };
    this.updateProfile = function(){
        profile.updateProfile();
        this.profileArray[profile.slot] = profile;
        this.saveProfile(profile.slot);
    };
    this.deleteProfile = function(slot){
        if(this.profileArray[slot]){
            cookieManager.clearCookie("profile" + slot);
            this.profileArray[slot] = null;
        }
    };
}
//PROFILE OBJ
function Profile(name, slot){
    this.slot = slot;
    this.dataArray;
    this.name = name;
    this.settings = "001";
    this.highScore = 0;
    this.gold = 0;
    this.inventory = "00000000";
    this.inventoryS = "00000000";
    
    this.updateProfile = function(){
        this.name = avatar.name;
        this.settings = settings.toString();
        this.highScore = avatar.highScore;
        this.gold = avatar.gold;
        this.inventory = avatar.inventoryP.join("");
        this.inventoryS = avatar.inventoryS.join("");
    };
    
    this.load = function(data, slot){
        this.slot = slot;
        this.dataArray = data.split("|");
        this.name = this.dataArray[0];
        this.settings = this.dataArray[1];
        this.highScore = parseInt(this.dataArray[2]);
        this.gold = parseInt(this.dataArray[3]);
        
        //FIX OLD PROFILES
        if(this.dataArray[4].length < 8){
            var extra = 8 - this.dataArray[4].length;
            for(var i = 0 ; i < extra ; i++){this.dataArray[4]+="0";}
        }
        if(this.dataArray[5].length < 8){
            var extra = 8 - this.dataArray[5].length;
            for(var i = 0 ; i < extra ; i++){this.dataArray[5]+="0";}
        }
        this.inventory = this.dataArray[4];
        this.inventoryS = this.dataArray[5];
    };
    this.toString = function(){
        this.dataArray = [];
        this.dataArray.push(this.name);
        this.dataArray.push(this.settings);
        this.dataArray.push(this.highScore);
        this.dataArray.push(this.gold);
        this.dataArray.push(this.inventory);
        this.dataArray.push(this.inventoryS);
        return this.dataArray.join("|");
    };
}

//SETTINGS MANAGER
function Settings(){
    this.dataArray;
    // music-mute | fx-mute | mouse-keyboard 
    this.musicMute;
    this.fxMute;
    this.mouseControl;
    this.load = function(data){
        this.dataArray = data.split("");
        this.musicMute = Boolean(parseInt(this.dataArray[0]));
        this.fxMute = Boolean(parseInt(this.dataArray[1]));
        this.mouseControl = Boolean(parseInt(this.dataArray[2]));
    };
    this.toString = function(){
        this.dataArray = [];
        this.dataArray.push(+ this.musicMute);
        this.dataArray.push(+ this.fxMute);
        this.dataArray.push(+ this.mouseControl);
        return this.dataArray.join("");
    };
    this.toggleMusic = function(){
        this.musicMute = !this.musicMute;
        profileManager.updateProfile();
        audioSynth.toggleMusicMute();
    };
    this.toggleFx = function(){
        this.fxMute = !this.fxMute;
        profileManager.updateProfile();
        audioSynth.toggleFxMute();
    };
    this.toggleMouseControl = function(){
        this.mouseControl = !this.mouseControl;
        profileManager.updateProfile();
    };
}

//AVATAR
function Avatar(){
    this.sprite;
    this.width;
    this.height;
    this.x;
    this.y;
    this.ms; // movement speed in px relative to x/y
    this.msX;
    this.msY;
    
    this.ax = function(){
        return this.x + this.width/2;
    };
    this.ay = function(){
        return this.y + this.height/2;
    };
    
    this.name;
    this.score;
    this.highScore;
    this.gold;
    this.hp;
    
    this.invincible;
    
    this.godMode;
    this.godModeStart;
    this.blink;
    this.blinkDuration;
    this.blinkStart;
    this.blinkInterval;
    
    this.deathDuration;
    this.deathStartTime;
    
    this.activeWeaponIndex = 0;
    this.loadout = [null, null, null];
    this.inventoryP = [];
    this.inventoryS = [];
    
    this.cycleWeapons = function(){
        if(this.activeWeaponIndex < 1){
            this.activeWeaponIndex++;
        }
        else{
            this.activeWeaponIndex = 0;
        }
    };
    this.checkLoadout = function(){
        for(var i = 0 ; i < this.loadout.length ; i++){
            if(this.loadout[i]){ return true; }
        }
        return false;
    };
    
    this.toggleGodMode = function(){
        this.godMode = !this.godMode;
    };
    this.godModeOn = function(duration){
        this.godMode = true;
        this.godModeStart = Date.now();
        if(duration){ this.duration = duration; }
        else{ this.duration = 1000; }
    };
    this.godModeOff = function(){
        this.godMode = false;
    };
    this.toggleBlink = function(){
        if(Date.now() >= this.blinkStart + this.blinkInterval){
            this.blink = !this.blink;
            this.blinkStart = Date.now();
        }
    };
    
    this.init = function(){
        this.width = sizeManager.spriteWidth;
        this.height = sizeManager.spriteHeight;
        this.score = 0;
        this.x = 275*sizeManager.factor;
        this.y = 650*sizeManager.factor;
        this.ms = 8*sizeManager.factor;
        this.msX = 8*sizeManager.factor;
        this.msY = 8*sizeManager.factor;
        this.hp = 1;
        
        this.godMode = false;
        this.blink = false;
        this.blinkStart = Date.now();
        this.blinkInterval = 50;
    };
    this.load = function(){
        this.name = profile.name;
        this.highScore = profile.highScore;
        this.gold = profile.gold;
        this.inventoryP = profile.inventory.split("").map(Number);
        this.inventoryS = profile.inventoryS.split("").map(Number);
    };
    this.coolDownReset = function(){
        for(var i = 0 ; i < this.loadout.length ; i++){
            if(this.loadout[i]){
                this.loadout[i].heatBar = 0;
                this.loadout[i].disabled = false;
            }
        }
    };
}

//WEAPON MANAGER
function WeaponManager(){
    this.icon = {
        lock: null,
        blaster: null,
        gatling: null,
        fireball: null,
        laser: null,
        ray: null,
        snowball: null,
        emp: null,
        shield: null,
        oracleBeam: null,
        snowflake: null
    };
    this.sprites = {
        fireball: null,
        shield: null,
        snowball: null,
        laserPulse: null,
        blizzardEffect: null
    };
    this.weaponArrayP = [];  //PRIMARY WEAPONS
    this.weaponArrayS = [];  //SECONDARY WEAPONS
    this.initWeapons = function(){
        this.weaponArrayP = [
            new WeaponPProjectileB("Blaster", weaponType.PROJECTILE_BASIC, 0,
                this.icon.blaster, 
                [0, 100, 200, 250, 500, 0], //COST
                [0, 1000, 1500, 2000, 2500, 3200], //OVER HEAT
                [0, 2000, 2000, 1800, 1700, 1500], //COOL DOWN
                [0, 5, 7, 10, 15, 20], //DMG
                [0, 100, 90, 80, 70, 60], //INTERVAL
                10*sizeManager.factor, //SPD
                audioSynth.clip.BLAST, //SOUND FX
                5*sizeManager.factor, ctxTool.clrRed2 //RADIUS // CLR
            ),
            new WeaponPProjectileB("Gatling Gun", weaponType.PROJECTILE_BASIC, 0,
                this.icon.gatling, 
                [150, 200, 250, 400, 500, 0], //COST
                [0, 3000, 4500, 4500, 5000, 5000], //OVER HEAT
                [0, 2000, 1800, 1500, 1200, 1000], //COOL DOWN
                [0, 2, 3, 4, 4, 5], //DMG
                [0, 50, 50, 40, 30, 25], //INTERVAL
                12*sizeManager.factor, //SPD
                audioSynth.clip.GATLING, // SOUND FX
                3*sizeManager.factor, ctxTool.clrBlue //RADIUS // CLR
            ),
            new WeaponPProjectileSP("Fireball", weaponType.PROJECTILE_SP, 0,
                this.icon.fireball, 
                [180, 250, 300, 450, 550, 0], //COST
                [0, 1000, 1250, 1600, 2000, 2700], //OVER HEAT
                [0, 2000, 1950, 1800, 1700, 1600], //COOL DOWN
                [0, 20, 25, 35, 40, 60], //DMG
                [0, 200, 190, 180, 175, 150], //INTERVAL
                10*sizeManager.factor, //SPD
                audioSynth.clip.FIREBALL, //SOUND FX
                this.sprites.fireball, //SPRITE
                30*sizeManager.factor, 50*sizeManager.factor  //WIDTH //HEIGHT
            ),
            new WeaponPBeam("Laser", weaponType.BEAM, 0,
                this.icon.laser, 
                [300, 300, 400, 500, 600, 0], //COST
                [0, 3000, 3500, 4000, 4500, 5000], //OVER HEAT
                [0, 2000, 2000, 2000, 2000, 1800], //COOL DOWN
                [0, 5, 5, 8, 12, 15], //TICK DMG
                [0, 150, 120, 120, 110, 100], //INTERVAL
                2,5,ctxTool.clrRed2, audioSynth.synth.LASER //WIDTH-BASE //WIDTH-TICK //CLR //FX
            ),
            new WeaponPBeam("Ray of Void", weaponType.BEAM, 0,
                this.icon.ray, 
                [500, 450, 500, 600, 700, 0], //COST
                [0, 4000, 4000, 4500, 5000, 5000], //OVER HEAT
                [0, 5000, 4500, 4000, 3000, 2000], //COOL DOWN
                [0, 10, 15, 20, 25, 35], //TICK DMG
                [0, 100, 100, 90, 80, 70], //INTERVAL
                3,6,ctxTool.clrBlue, audioSynth.synth.VOID //WIDTH-BASE //WIDTH-TICK //CLR //FX
            ),
            new WeaponPProjectileSP("Snowball", weaponType.PROJECTILE_SP, 0,
                this.icon.snowball, 
                [100, 150, 200, 250, 300, 0], //COST
                [0, 1500, 1700, 2000, 2500, 3000], //OVER HEAT
                [0, 1800, 1700, 1500, 1200, 1000], //COOL DOWN
                [0, 18, 20, 25, 30, 35], //DMG
                [0, 250, 230, 200, 190, 180], //INTERVAL
                12*sizeManager.factor, //SPD
                audioSynth.clip.FIREBALL, //SOUND FX
                this.sprites.snowball, //SPRITE
                50*sizeManager.factor, 50*sizeManager.factor  //WIDTH //HEIGHT
            )
        ];
        this.weaponArrayS = [
            new WeaponS("EMP", weaponType.SECONDARY, 0,
                this.icon.emp,
                [300, 300, 400, 450, 500, 0], //COST
                [0, 0, 0, 0, 0, 0], //OVER HEAT
                [0, 15000, 13000, 10000, 7500, 5000], //COOL DOWN
                [0, 10, 15, 20, 25, 25], //DMG
                function(){
                    this.triggerS = true;
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        enemyManager.enemyArray[i].hp -= this.dmg[this.lvl];
                    }
                    if(enemyManager.bossFight && enemyManager.boss){
                        enemyManager.boss.hp -= this.dmg[this.lvl];
                    }
                    
                }, //TRIGGER ON
                function(){ this.triggerS = false; }, //TRIGGER OFF
                function(){
                    if(this.triggerS && enemyManager.bossFight && enemyManager.boss){
                        explosionManager.explosionArray.push(new Explosion(enemyManager.boss.axP(), enemyManager.boss.ay()));
                    }
                }, //EFFECT ANIMATION
                [] //CUSTOM VALUES
            ),
            new WeaponS("Shield", weaponType.SECONDARY, 0,
                this.icon.shield,
                [500, 400, 450, 500, 600, 0], //COST
                [0, 5000, 5000, 5000, 5000, 5000], //OVER HEAT
                [0, 20000, 20000, 20000, 20000, 20000], //COOL DOWN
                [0, 5, 8, 10, 15, 20], //DMG
                function(){
                    this.triggerS = true;
                    avatar.invincible = true;
                    //ENEMY COLLISIONS
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        var e = enemyManager.enemyArray[i];
                        if(ctxTool.objObjCollision([avatar.x-this.values[1], avatar.y-this.values[1], this.values[2], this.values[2]],[e.x,e.y,e.width,e.height])){
                            e.hp -= this.dmg[this.lvl];
                        }
                    }
                    //ENEMY PROJECTILE COLLISIONS
                    for(var i = 0 ; i < projectileManager.projectileArrayE.length ; i++){
                        var p = projectileManager.projectileArrayE[i];
                        if(ctxTool.objObjCollision([avatar.x-this.values[1], avatar.y-this.values[1], this.values[2], this.values[2]],[p.x,p.y,p.width,p.height])){
                            projectileManager.projectileArrayE.splice(i,1);
                            explosionManager.explosionArray.push(new Explosion(p.x,p.y));
                        }
                    }
                }, //TRIGGER ON
                function(){ this.triggerS = false; avatar.invincible = false;}, //TRIGGER OFF
                function(){
                    if(this.triggerS){
                        ctx.drawImage(this.values[0], avatar.x-this.values[1], avatar.y-this.values[1], this.values[2], this.values[2]);
                    }
                }, //EFFECT ANIMATION
                [weaponManager.sprites.shield, 10*sizeManager.factor, 70*sizeManager.factor] //CUSTOM VALUES
            ),
            new WeaponS("Oracle Beam", weaponType.SECONDARY, 0,
            this.icon.oracleBeam,
            [750, 400, 500, 600, 750, 0], //COST
            [0, 4000, 4500, 4800, 5000, 5500], //OVER HEAT
            [0, 3000, 3000, 2800, 2500, 2000], //COOL DOWN
            [0, 1, 2, 3, 5, 8], // TICK DMG
            function(){
                this.triggerS = true;
                //SOUD FX
                audioSynth.synthOn(audioSynth.synth.ORACLE);
                //MANAGE TICK
                if(!this.values[1]){ this.values[1] = Date.now() - this.values[0][this.lvl]; }//lasttick
                if(Date.now() > this.values[1] + this.values[0][this.lvl]){
                    this.values[2] = true;
                    this.values[1] = Date.now();
                }else{ this.values[2] = false; }
                //IF TICK
                if(this.values[2]){
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        enemyManager.enemyArray[i].hp -= this.dmg[this.lvl];
                        enemyManager.enemyArray[i].ms = 2*sizeManager.factor;
                    }
                    if(enemyManager.bossFight && enemyManager.boss){
                        enemyManager.boss.hp -= this.dmg[this.lvl];
                    }
                }
            }, //TRIGGER ON
            function(){
                this.triggerS = false;
                //SOUND FX
                audioSynth.synthOff(audioSynth.synth.ORACLE);
            }, //TRIGGER OFF
            function(){
                if(this.triggerS){
                    //Origin
                    ctxTool.circle(avatar.ax(), avatar.y, 10*sizeManager.factor, ctxTool.clrGreenT);
                    //LINES to Enemies
                    var w = 2*sizeManager.factor;
                    if(this.values[2]){ w = 5*sizeManager.factor; }
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        var e = enemyManager.enemyArray[i];
                        ctxTool.line(avatar.ax(), avatar.y, e.ax(), e.ay(), w, ctxTool.clrGreen);
                    }
                    if(enemyManager.bossFight && enemyManager.boss){
                        var b = enemyManager.boss;
                        ctxTool.line(avatar.ax(), avatar.y, b.ax(), b.ay(), w, ctxTool.clrGreen);
                    }
                }
            }, //EFFECT ANIMATION
            [[0,100,90,80,50,50], null, false] // CUSTOM VALUES
            //tickIntervals, lastticktime, tick
            ),
    new WeaponS("Blizzard", weaponType.SECONDARY, 0,
            this.icon.snowflake,
            [150, 250, 300, 350, 400, 0], //COST
            [0, 4000, 4500, 5000, 5500, 6000], //OVER HEAT
            [0, 5000, 4500, 4500, 4000, 4000], //COOL DOWN
            [0, 1, 1, 1, 2, 2], // TICK DMG
            function(){
                this.triggerS = true;
                //SOUD FX
                audioSynth.playClipLoop(audioSynth.clip.BLIZZARD);
                //SPD Modifier
                enemyManager.spdModifier = this.values[3][this.lvl];
                //MANAGE TICK
                if(!this.values[1]){ this.values[1] = Date.now() - this.values[0][this.lvl]; }//lasttick
                if(Date.now() > this.values[1] + this.values[0][this.lvl]){
                    this.values[2] = true;
                    this.values[1] = Date.now();
                }else{ this.values[2] = false; }
                //IF TICK
                if(this.values[2]){
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        enemyManager.enemyArray[i].hp -= this.dmg[this.lvl];
                    }
                    if(enemyManager.bossFight && enemyManager.boss){
                        enemyManager.boss.hp -= this.dmg[this.lvl];
                    }
                }
            }, //TRIGGER ON
            function(){
                this.triggerS = false;
                //SOUND FX
                audioSynth.stopClipLoop(audioSynth.clip.BLIZZARD);
                //SPD Modifier
                enemyManager.spdModifier = 1.0;
            }, //TRIGGER OFF
            function(){
                if(this.triggerS){
                    //Blizzard effect
                    ctx.drawImage(weaponManager.sprites.blizzardEffect, 0, 0, canvas.width, canvas.height);
                    //Origin
                    ctxTool.circle(avatar.ax(), avatar.y, 10*sizeManager.factor, ctxTool.clrBlueT);
                    //ICE EFFECT on Enemies
                    var r = 30*sizeManager.factor;
                    if(this.values[2]){ r = 35*sizeManager.factor; }
                    for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
                        var e = enemyManager.enemyArray[i];
                        ctxTool.circle(e.ax(), e.ay(), r, ctxTool.clrBlueT);
                    }
                    if(enemyManager.bossFight && enemyManager.boss){
                        var b = enemyManager.boss;
                        ctxTool.circle(b.ax(), b.ay(), r, ctxTool.clrBlueT);
                    }
                }
            }, //EFFECT ANIMATION
            [[0,500,500,450,400,350], null, false, [0,0.5,0.4,0.3,0.2,0.1]] // CUSTOM VALUES
            //tickIntervals, lastticktime, tick, speed slow
            )
        ];
        
    };
    this.resetAllWeaponCoolDown = function(){
        for(var i = 0 ; i < this.weaponArrayP.length ; i++){
            var w = this.weaponArrayP[i];
            w.resetHeat();
        }
        for(var i = 0 ; i < this.weaponArrayS.length ; i++){
            var w = this.weaponArrayS[i];
            w.resetHeat();
        }
    };
}
function Weapon(name, type, lvl, icon, cost, oh, cd){
    this.name = name;
    this.type = type;
    this.lvl = lvl;
    this.icon = icon;
    this.cost = cost;
    this.maxLvl = 5;
    this.disabled = false;
    this.heatBarMaxW = 100*sizeManager.factor;
    this.heatBarW = 0;
    this.overHeatTime = oh;
    this.coolDownTime = cd;
    this.heatRate = function(){
        if(this.overHeatTime[this.lvl]===0){ return this.heatBarMaxW; }
        else{ return this.heatBarMaxW / this.overHeatTime[this.lvl]; }
    };
    this.coolRate = function(){
        if(this.coolDownTime[this.lvl]===0){ return this.heatBarMaxW; }
        else{ return this.heatBarMaxW / this.coolDownTime[this.lvl]; }
    };
    this.triggerOnTime = null;
    this.triggerOffTime = null;
    this.disableStartTime = null;
    this.triggerOn = function(){
        if(!this.disabled){
            this.triggerWeapon();
            this.triggerOffTime = null;
            if(!this.triggerOnTime){ this.triggerOnTime = Date.now(); }
            var dur = Date.now() - this.triggerOnTime;
            this.heatBarW += (dur*this.heatRate());
            this.triggerOnTime = Date.now();
            if(this.heatBarW >= this.heatBarMaxW){
                this.disabled = true;
                this.disableStartTime = Date.now();
                this.heatBarW = this.heatBarMaxW;
            }
        }
        else{
            this.triggerOff();
        }
    };
    this.triggerOff = function(){
        this.triggerOnTime = null;
        this.triggerOffWeapon();
        if(!this.triggerOffTime){ this.triggerOffTime = Date.now(); }
        var dur = Date.now() - this.triggerOffTime;
        this.heatBarW -= (dur*this.coolRate());
        this.triggerOffTime = Date.now();
        if(this.heatBarW <= 0){ this.disabled = false; this.heatBarW = 0; };
    };
    this.checkDisableDur = function(){
        var dur = (this.coolDownTime[this.lvl]-(Date.now() - this.disableStartTime))/1000;
        if(dur < 0){ dur = 0; }
        return dur.toFixed(1);
    };
    this.checkDisableRatio = function(){
        var ratio = ((Date.now() - this.disableStartTime))/this.coolDownTime[this.lvl];
        if(ratio >= 1){ ratio = 1; }
        return ratio;
    };
    this.resetHeat = function(){
        this.heatBarW = 0;
    };
    this.triggerWeapon = function(){
        switch(this.type){
            case weaponType.PROJECTILE_BASIC:
            case weaponType.PROJECTILE_SP:
                if(!this.lastProjectileTime){ this.lastProjectileTime = Date.now() - this.interval[this.lvl];}
                if(Date.now() > (this.lastProjectileTime + this.interval[this.lvl])){
                    var p;
                    if(this.type === weaponType.PROJECTILE_BASIC){
                        p = new ProjectileBasic(avatar.ax(), avatar.ay(), this.spd, this.dmg[this.lvl], this.r, this.clr);
                    }
                    else if(this.type === weaponType.PROJECTILE_SP){
                        p = new ProjectileSprite(avatar.x, avatar.y, this.spd, this.dmg[this.lvl], this.sprite, this.spriteWidth, this.spriteHeight);
                    }
                    projectileManager.projectileArray.push(p);
                    this.lastProjectileTime = Date.now();
                    //SOUND FX
                    audioSynth.playClip(this.fx);
                }
                break;
            case weaponType.BEAM:
                this.origin = [avatar.ax(), avatar.ay()];
                if(!this.lastTickTime){ this.lastTickTime = Date.now() - this.tickInterval[this.lvl]; }
                if(Date.now() > this.lastTickTime + this.tickInterval[this.lvl]){
                    this.tick = true;
                    this.lastTickTime = Date.now();
                }else{ this.tick = false; }
                //SOUND FX
                audioSynth.synthOn(this.fx);
                break;
            case weaponType.SECONDARY:
                this.triggerOnS();
                break;
        }
    };
    this.triggerOffWeapon = function(){
        switch(this.type){
            case weaponType.PROJECTILE_BASIC:
            case weaponType.PROJECTILE_SP:
                break;
            case weaponType.BEAM:
                this.tick = false;
                this.origin = null;
                audioSynth.synthOff(this.fx);
                break;
            case weaponType.SECONDARY:
                this.triggerOffS();
                break;
        }
    };
}
function WeaponPProjectileB(name, type, lvl, icon, cost, oh, cd, dmg, interval, spd, fx, r, clr){
    Weapon.call(this, name, type, lvl, icon, cost, oh, cd);
    this.dmg = dmg;
    this.interval = interval;
    this.spd = spd;
    this.r = r;
    this.fx = fx;
    this.clr = clr;
    this.lastProjectileTime = null;
}
function WeaponPProjectileSP(name, type, lvl, icon, cost, oh, cd, dmg, interval, spd, fx, sprite, width, height){
    WeaponPProjectileB.call(this, name, type, lvl, icon, cost, oh, cd, dmg, interval, spd, fx);
    this.sprite = sprite;
    this.spriteWidth = width;
    this.spriteHeight = height;
}
function WeaponPBeam(name, type, lvl, icon, cost, oh, cd, tickDmg, tickInterval, width, widthTick, clr, fx){
    Weapon.call(this, name, type, lvl, icon, cost, oh, cd);
    this.tickDmg = tickDmg;
    this.tickInterval = tickInterval;
    this.width = width;
    this.widthTick = widthTick;
    this.clr = clr;
    this.fx = fx;
    this.tick = false;
    this.lastTickTime = null;
    this.origin = null;
    this.beamCoordinates = function(){
        return [this.origin[0]-this.widthTick/2, 0, this.widthTick, this.origin[1]];
    };
}
function WeaponS(name, type, lvl, icon, cost, oh, cd, dmg, triggerOnS, triggerOffS, effectAnimationS, values){
    Weapon.call(this, name, type, lvl, icon, cost, oh, cd);
    this.dmg = dmg;
    this.triggerOnS = triggerOnS;
    this.triggerOffS = triggerOffS;
    this.effectAnimationS = effectAnimationS;
    this.values = values;
    this.triggerS = false;
}

//PROJECTILE MANAGER
function ProjectileManager(){
    this.projectileArray = [];
    this.projectileArrayE = [];
    this.reset = function(){
        this.projectileArray = [];
        this.projectileArrayE = [];
    };
}
//PROJECTILE OBJ
function Projectile(type, x, y, ms, dmg){
    this.type = type;
    this.x = x;
    this.y = y;
    this.ms = ms;
    this.dmg = dmg;
}
function ProjectileBasic(x, y, ms, dmg, r, clr){
    Projectile.call(this, weaponType.PROJECTILE_BASIC, x, y, ms, dmg);
    this.r = r;
    this.clr = clr;
}
function ProjectileSprite(x, y, ms, dmg, sprite, w, h){
    Projectile.call(this, weaponType.PROJECTILE_SP, x, y, ms, dmg);
    this.sprite = sprite;
    this.width = w;
    this.height = h;
    this.offsetX = function(){
        return this.x + (sizeManager.spriteWidth-this.width)/2;
    };
}

//ENEMY MANAGER
function EnemyManager(){
    this.enemyArray = [];
    this.enemyDeathArray = [];
    this.lvl = 1;
    this.spawnInterval = 1000;
    this.lastSpawnTime = Date.now();
    this.sprite;
    this.ms = 5*sizeManager.factor;
    this.width = 50*sizeManager.factor;
    this.height = 50*sizeManager.factor;
    this.hp = 5;
    this.gold = 1;
    
    this.spdModifier = 1.0;
    
    this.enemyCounter = 0;
    this.bossFight = false;
    this.boss = null;
    
    this.bossSprite;
    this.bWidth = 128*sizeManager.factor;
    this.bHeight = 88*sizeManager.factor;
    this.bMs = 2.5*sizeManager.factor;
    this.bHp = 90;
    this.bGold = 45;
    this.bDeathTime = null;
    this.bDeathDelay = 2500;
    
    this.lvlManager = {
        spawnInterval:  [0, 1000,  1000,   0,  950,    950,    0,   900,   900,     0],
        ms:             [0, 5,     5,      0,  5.5,    5.5,    0,   5.8,   5.8,     0],
        hp:             [0, 5,     6,      0,  7,      8,      0,   9,     10,      0]
    };
    
    this.reset = function(){
        this.enemyArray = [];
        this.enemyDeathArray = [];
        this.lvl = 1;
        this.enemyCounter = 0;
        this.spawnInterval = 1000;
        this.ms = 5*sizeManager.factor;
        this.hp = 5;
        this.gold = 1;
        this.bossFight = false;
        this.bHp = 90;
        this.bGold = 45;
        this.boss = null;
        this.bDeathTime = null;
    };
    this.lvlUp = function(){
        this.lvl++;
        if(this.lvl % 3 === 0){
            this.bHp += 10;
            this.bGold += 5;
            this.bossFight = true;
            ctxTool.toast("BOSS LEVEL");
        }
        //NORMAL LVL UP
        else{
            this.bossFight = false;
            if(this.lvl<9){
                this.spawnInterval = this.lvlManager.spawnInterval[this.lvl];
                this.ms = this.lvlManager.ms[this.lvl]*sizeManager.factor;
                this.hp = this.lvlManager.hp[this.lvl];
            }
            else{
                this.spawnInterval -= 50;
                this.ms += 1*sizeManager.factor;
                this.hp += 2;
            }
                
            ctxTool.toast("LEVEL: " + this.lvl);
        }
    };
    this.spawn = function(){
        if(!this.bossFight && Date.now() >= this.lastSpawnTime + this.spawnInterval){
            this.enemyCounter++;
            var x = Math.floor(Math.random() * (canvas.width - this.width));
            var y = gameUI.gameAreaYTop;
            this.enemyArray.push(new Enemy(this.sprite, x, y, this.width, this.height, this.ms, this.hp, this.gold));
            this.lastSpawnTime = Date.now();
            //LVL UP
            if(this.enemyCounter % 20 === 0){
                this.lvlUp();
            }
        }
        if(this.bossFight){
            if(!this.boss){
                this.boss = new Boss(this.bossSprite, canvas.width/2-this.bWidth/2, -this.bHeight, 
                        this.bWidth, this.bHeight,
                        this.bMs, this.bHp, this.bGold);
            }//SPAWN BOSS
            if(this.boss.hp <= 0){
                if(!this.bDeathTime){ this.bDeathTime = Date.now(); }
                if(Date.now() > this.bDeathTime+this.bDeathDelay){
                    this.boss = null;
                    this.bDeathTime = null;
                    this.lvlUp();
                }
            } // LvlUp ON BOSS DEATH
        }
    };
    
}
function Enemy(sprite, x, y, w, h, ms, hp, gold){
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.ms = ms;
    this.hp = hp;
    this.alpha = 1;
    this.gold = gold;
    this.ax = function(){
        return this.x + (this.width/2);
    };
    this.ay = function(){
        return this.y + (this.height/2);
    };
}
//BOSS
function Boss(sprite, x, y, w, h, ms, hp, gold){
    Enemy.call(this, sprite, x, y, w, h, ms, hp, gold);
    this.maxHp = hp;
    this.left = true;
    this.right = false;
    this.ax = function(){ return this.x + this.width/2; };
    this.axP = function(){ return this.x + this.width/2 - sizeManager.spriteWidth/2; };
    this.ay = function(){ return this.y + this.height/2; };
    this.healthBarMaxW = 100*sizeManager.factor;
    this.healthBarH = 4*sizeManager.factor;
    this.healthBarContainerW = 104*sizeManager.factor;
    this.healthBarContainerH = 8*sizeManager.factor;
    this.healthBarContainerLW = 2*sizeManager.factor;
    this.hbx = function(){ return this.ax() - this.healthBarMaxW/2; };
    this.hbxt = function(){ return this.hbx() + (this.hp/this.maxHp*this.healthBarMaxW); };
    this.hby = function(){ return this.y - 4*sizeManager.factor; };
    this.hbcx = function(){ return this.ax() - this.healthBarContainerW/2; };
    this.hbcy = function(){ return this.y - this.healthBarContainerH; };
    this.interval = 800;
    this.lastProjectileTime = null;
    this.pW = 25*sizeManager.factor;
    this.pH = 50*sizeManager.factor;
    this.trigger = function(){
        if(!this.lastProjectileTime){ this.lastProjectileTime = Date.now() - this.interval; }
        if(Date.now() > this.lastProjectileTime + this.interval){
            var p = new ProjectileSprite(this.axP(), this.ay(), 8*sizeManager.factor, 5, weaponManager.sprites.laserPulse, this.pW, this.pH);
            projectileManager.projectileArrayE.push(p);
            this.lastProjectileTime = Date.now();
            //SOUND FX
            audioSynth.playClip(audioSynth.clip.LASER);
        }
    };
}

//EXPLOSIONS
function ExplosionManager(){
    this.sprite0;
    this.sprite1;
    this.sprite2;
    this.spriteArray;
    this.explosionArray = [];
    this.reset = function(){
        this.explosionArray = [];
    };
}
function Explosion(x, y, delay, mute){
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.mute = false; if(mute){this.mute = mute;}
    this.start = false;
    this.width = 50*sizeManager.factor;
    this.height = 50*sizeManager.factor;
    this.state = 0;
    this.frameStartTime = Date.now();
    this.frameDuration = 150;
}

//   --- === [ ANIMATIONS ] === ---
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch(gameManager.gameState){
        case 0:
            drawLoadingAnimation();
            break;
        case 1:
            drawTransitionAnimation();
            break;
        case 2:
            drawProfileMenu();
            break;
        case 3:
            drawMainMenu();
            break;
        case 4:
            drawSettingsMenu();
            break;
        case 5:
            drawInventoryMenu();
            break;
        case 6:
            drawPreGame();
            break;
        case 7:
            drawGame();
            break;
        case 8:
            drawDeath();
            break;
    }
    //TOAST
    if(ctxTool){ctxTool.drawToast();}
    
    requestAnimationFrame(draw);
}

//LOADER
function Loader(){
    this.msgStartTime = Date.now();
    this.msgInterval = 700;
    this.msg = "* * * * *";
    this.msgIndex = 0;
    this.msgArray = ["* * * * *", "Prismatic beams aligning", "Calibrating void lenses", "Phase crystals charged"];
    this.cycleMsg = function(){
        this.msgStartTime = Date.now();
        if(this.msgIndex < 3){ this.msgIndex++; }
        else{ this.msgIndex = 0; }
        this.msg = this.msgArray[this.msgIndex];
    };
}
//LOADING ANIMATION
function drawLoadingAnimation(){
    if(Date.now() > loader.msgStartTime + loader.msgInterval){
        loader.cycleMsg();
    }
    ctx.font = sizeManager.fontSizeL + "px Courier";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("LOADING", canvas.width/2, canvas.height/2);
    ctx.font = sizeManager.fontSizeS + "px Courier";
    ctx.fillText(loader.msg, canvas.width/2, canvas.height/2 + 50);
    if(assetManager && assetManager.loaded && cookieManager && audioSynth.ready()){
        profileManager.getAllProfiles();
        gameManager.changeGameState(1);
    }
}

//TRANSITION
function Transition(){
    this.bg;
    this.startTime = Date.now();
    this.alpha = 0;
}
//TRANSITION ANIMATION
function drawTransitionAnimation(){
    ctx.globalAlpha = transition.alpha;
    ctx.drawImage(transition.bg, 0, 0, canvas.width, canvas.height);
    if(transition.alpha < 1){
        transition.alpha += 0.02;
    }
    else{
        ctx.globalAlpha = 1;
        transition.alpha = 0;
        if(gameManager.profileLoaded){ gameManager.globalReset(); gameManager.changeGameState(3); }
        else{ gameManager.changeGameState(2); }
        
    }
}

//PROFILE MENU
function ProfileMenu(){
    this.bg;
    this.selectedProfile = 0;
    this.txtInput = false;
    this.inputString = "";
    this.inputW = 175*sizeManager.factor;
    this.inputH = 40*sizeManager.factor;
    this.rectInputX = 190*sizeManager.factor;
    this.rectInputY = [245*sizeManager.factor, 370*sizeManager.factor, 495*sizeManager.factor];
    this.rectSaveX = 365*sizeManager.factor;
    this.btnW = 95*sizeManager.factor;
    this.btnH = 40*sizeManager.factor;
    this.txtX = 370*sizeManager.factor;
    this.txtY = [275*sizeManager.factor, 400*sizeManager.factor, 525*sizeManager.factor];
    this.inputX = 195*sizeManager.factor;
    this.cursorX = 195*sizeManager.factor;
    this.cursorYo = [275*sizeManager.factor, 400*sizeManager.factor, 525*sizeManager.factor];
    this.cBlink = false;
    this.cBlinkInterval = 400;
    this.cBlinkTime = Date.now();
    this.toggleCBlink = function(){
        if(Date.now() > this.cBlinkTime + this.cBlinkInterval){
            this.cBlinkTime = Date.now();
            this.cBlink = !this.cBlink;
        }
    };
    
    this.rect1 = [100*sizeManager.factor, 200*sizeManager.factor, 400*sizeManager.factor, 100*sizeManager.factor];
    this.rect2 = [100*sizeManager.factor, 325*sizeManager.factor, 400*sizeManager.factor, 100*sizeManager.factor];
    this.rect3 = [100*sizeManager.factor, 450*sizeManager.factor, 400*sizeManager.factor, 100*sizeManager.factor];
    this.rect1X = [464*sizeManager.factor, 212*sizeManager.factor, 22*sizeManager.factor, 26*sizeManager.factor];
    this.rect2X = [464*sizeManager.factor, 337*sizeManager.factor, 22*sizeManager.factor, 26*sizeManager.factor];
    this.rect3X = [464*sizeManager.factor, 462*sizeManager.factor, 22*sizeManager.factor, 26*sizeManager.factor];
    this.rectLoadBtn = [200*sizeManager.factor, 650*sizeManager.factor, 200*sizeManager.factor, 100*sizeManager.factor];
    this.rectArray = [this.rect1, this.rect2, this.rect3];
    this.manageClick = function(){
        if(ui.targetCollision(this.rect1)){ this.selectedProfile = 0; }
        if(ui.targetCollision(this.rect2)){ this.selectedProfile = 1; }
        if(ui.targetCollision(this.rect3)){ this.selectedProfile = 2; }
        if(ui.targetCollision(this.rect1X) || 
           ui.targetCollision(this.rect2X) || 
           ui.targetCollision(this.rect3X) ){ this.deleteProfile(); }
        if(ui.targetCollision(this.rectLoadBtn)){ this.loadProfile(); }
        
        if(!profileManager.profileArray[this.selectedProfile]){
            //SHOW TEXT INPUT
            //ui.createTextInput(240 + this.selectedProfile*125);
            this.txtInput = true;
        }else{ this.txtInput = false; }
        if(this.txtInput && ui.targetCollision([this.rectSaveX, this.rectInputY[this.selectedProfile], this.btnW, this.btnH])){
            if(this.inputString.length > 0){
                profileManager.createNewProfile(this.inputString, this.selectedProfile);
                this.txtInput = false;
            }
        }
    };
    this.deleteProfile = function(){
        var p = profileManager.profileArray[this.selectedProfile];
        if(profileManager.profileArray[this.selectedProfile]){
            if(window.confirm("Delete profile:" + p.name + " permanantly?")){
                profileManager.deleteProfile(this.selectedProfile);
                this.inputString = "";
            }
        }
    };
    this.loadProfile = function(){
        profile = profileManager.profileArray[this.selectedProfile];
        avatar.init();
        avatar.load();
        settings.load(profile.settings);
        gameManager.profileLoaded = true;
        if(settings.musicMute){ audioSynth.muteMusic(); }
        if(settings.fxMute){ audioSynth.muteFx(); }
        gameManager.changeGameState(3);
    };
    this.manageInput = function(key){
        if(key === "Backspace"){
            this.inputString = this.inputString.slice(0,-1);
        }else{
            if(this.inputString.length < 10){
                if(key !== "CapsLock" && key !== "Tab" && key !== "Shift" && key !== "Alt" && key !== "Control"){
                    this.inputString += key;
                }
            }
        }
    };
}
//PROFILE MENU
function drawProfileMenu(){
    ctx.drawImage(profileMenu.bg, 0, 0, canvas.width, canvas.height);
    //SELECTION
    var rect = profileMenu.rectArray[profileMenu.selectedProfile];
    ctxTool.strokeRect(rect[0], rect[1], rect[2], rect[3], 5*sizeManager.factor, ctxTool.clrBlack);
    //PROFILE NAMES
    var textY = 275*sizeManager.factor;
    for(var i = 0 ; i < 3 ; i++){
        var p = profileManager.profileArray[i];
        if(p){
            ctxTool.text(p.name, 190*sizeManager.factor, textY, "left", sizeManager.fontSizeS, ctxTool.clrBlack);
        }
        else{
            ctxTool.text("EMPTY SLOT", canvas.width/2, textY, "center", sizeManager.fontSizeS, ctxTool.clrBlack);
        }
        textY += 125*sizeManager.factor;
    }
    
    //TEXT INPUT
    if(profileMenu.txtInput){
        ctxTool.rect(profileMenu.rectInputX, profileMenu.rectInputY[profileMenu.selectedProfile], profileMenu.inputW, profileMenu.inputH, ctxTool.clrWhite);
        ctxTool.rect(profileMenu.rectSaveX, profileMenu.rectInputY[profileMenu.selectedProfile], profileMenu.btnW, profileMenu.btnH, ctxTool.clrYellow);
        ctxTool.text("SAVE", profileMenu.txtX, profileMenu.txtY[profileMenu.selectedProfile], "left", sizeManager.fontSizeS, ctxTool.clrBlack);
        ctxTool.text(profileMenu.inputString, profileMenu.inputX, profileMenu.txtY[profileMenu.selectedProfile], "left", sizeManager.fontSizeInput, ctxTool.clrBlack);
        //CURSOR
        profileMenu.toggleCBlink();
        if(profileMenu.cBlink){
            var cx = profileMenu.cursorX + (17*profileMenu.inputString.length)*sizeManager.factor;
            var cy = profileMenu.cursorYo[profileMenu.selectedProfile];
            var cyt = cy - 20*sizeManager.factor;
            ctxTool.line(cx, cy, cx, cyt, 2*sizeManager.factor, ctxTool.clrBlack);
        }
    }
    
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(profileMenu.rect1) ||
           ui.targetCollision(profileMenu.rect2)||
           ui.targetCollision(profileMenu.rect3) ||
           ui.targetCollision(profileMenu.rectLoadBtn)){
       canvas.style.cursor = "pointer";
       if(ui.targetCollision(profileMenu.rect1X)){
            ctxTool.strokeRect(profileMenu.rect1X[0], profileMenu.rect1X[1], profileMenu.rect1X[2], profileMenu.rect1X[3], 2*sizeManager.factor, ctxTool.clrRed);
        }
       if(ui.targetCollision(profileMenu.rect2X)){
            ctxTool.strokeRect(profileMenu.rect2X[0], profileMenu.rect2X[1], profileMenu.rect2X[2], profileMenu.rect2X[3], 2*sizeManager.factor, ctxTool.clrRed);
        }
       if(ui.targetCollision(profileMenu.rect3X)){
            ctxTool.strokeRect(profileMenu.rect3X[0], profileMenu.rect3X[1], profileMenu.rect3X[2], profileMenu.rect3X[3], 2*sizeManager.factor, ctxTool.clrRed);
        }
    }
    else{ canvas.style.cursor = "default"; }
}

//MAIN MENU
function MainMenu(){
    this.bg;
    this.bgWarn;
    this.window = false;
    this.rectSettingsBtn = [25*sizeManager.factor, 650*sizeManager.factor, 150*sizeManager.factor, 100*sizeManager.factor];
    this.rectPlayBtn = [200*sizeManager.factor, 650*sizeManager.factor, 200*sizeManager.factor, 100*sizeManager.factor];
    this.rectInventoryBtn = [425*sizeManager.factor, 650*sizeManager.factor, 150*sizeManager.factor, 100*sizeManager.factor];
    this.rectWarnBack = [425*sizeManager.factor, 175*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor];
    this.rectWarnBtn = [246*sizeManager.factor, 580*sizeManager.factor, 108*sizeManager.factor, 40*sizeManager.factor];
    this.manageClick = function(){
        if(ui.targetCollision(this.rectSettingsBtn)){gameManager.changeGameState(4);}
        if(ui.targetCollision(this.rectInventoryBtn)){gameManager.changeGameState(5);}
        if(ui.targetCollision(this.rectPlayBtn)){
            if(avatar.checkLoadout()){ gameManager.changeGameState(6); }
            else{ this.window = true; }
        }
        if(ui.targetCollision(this.rectWarnBack)){ this.window = false; }
        if(ui.targetCollision(this.rectWarnBtn)){ this.window = false; gameManager.changeGameState(6); }
    };
}
//MAIN MENU ANIMATION
function drawMainMenu(){
    ctx.drawImage(mainMenu.bg, 0, 0, canvas.width, canvas.height);
    //CHECK WARNING WINDOW
    if(mainMenu.window){
        ctx.drawImage(mainMenu.bgWarn, 0, 0, canvas.width, canvas.height);
        //CHECK MOUSE TARGET COLLISIONS
        if(ui.targetCollision(mainMenu.rectWarnBack) ||
           ui.targetCollision(mainMenu.rectWarnBtn)){
            canvas.style.cursor = "pointer";
        }
        else{ canvas.style.cursor = "default"; }
    }
    else{
        //CHECK MOUSE TARGET COLLISIONS
        if(ui.targetCollision(mainMenu.rectSettingsBtn) || 
           ui.targetCollision(mainMenu.rectPlayBtn) ||
           ui.targetCollision(mainMenu.rectInventoryBtn) ){
            canvas.style.cursor = "pointer";
        }
        else{ canvas.style.cursor = "default"; }
    }
}

//SETTINGS MENU
function SettingsMenu(){
    this.bg;
    this.rectMusicSwitch = [415*sizeManager.factor, 135*sizeManager.factor, 70*sizeManager.factor, 35*sizeManager.factor];
    this.rectFxSwitch = [415*sizeManager.factor, 235*sizeManager.factor, 70*sizeManager.factor, 35*sizeManager.factor];
    this.rectCtrlSwitch = [265*sizeManager.factor, 560*sizeManager.factor, 70*sizeManager.factor, 35*sizeManager.factor];
    this.rectBackBtn = [200*sizeManager.factor, 650*sizeManager.factor, 200*sizeManager.factor, 100*sizeManager.factor];
    this.circle1 = [435*sizeManager.factor, 152*sizeManager.factor, 12.5*sizeManager.factor];
    this.circle2 = [435*sizeManager.factor, 252*sizeManager.factor, 12.5*sizeManager.factor];
    this.circleBX = 468*sizeManager.factor;
    this.circle3 = [285*sizeManager.factor, 577*sizeManager.factor, 12.5*sizeManager.factor];
    this.circle3BX = 318*sizeManager.factor;
    this.line1 = [125*sizeManager.factor, 175*sizeManager.factor, 175*sizeManager.factor, 125*sizeManager.factor];
    this.line2 = [125*sizeManager.factor, 275*sizeManager.factor, 175*sizeManager.factor, 225*sizeManager.factor];
    this.manageClick = function(){
        if(ui.targetCollision(this.rectMusicSwitch)){ settings.toggleMusic(); }
        if(ui.targetCollision(this.rectFxSwitch)){ settings.toggleFx(); }
        if(ui.targetCollision(this.rectCtrlSwitch)){ settings.toggleMouseControl(); }
        if(ui.targetCollision(this.rectBackBtn)){
            gameManager.changeGameState(3);
        }
    };
}
//SETTINGS MENU ANIMATION
function drawSettingsMenu(){
    ctx.drawImage(settingsMenu.bg, 0, 0, canvas.width, canvas.height);
    //DRAW SWITCHES
    //Music
    if(!settings.musicMute){
        ctxTool.circle(settingsMenu.circle1[0], settingsMenu.circle1[1], settingsMenu.circle1[2], "#4a4a4a");
    }
    else{
        ctxTool.circle(settingsMenu.circleBX, settingsMenu.circle1[1], settingsMenu.circle1[2], ctxTool.clrGrey);
        ctxTool.line(settingsMenu.line1[0], settingsMenu.line1[1], settingsMenu.line1[2], settingsMenu.line1[3], 3, ctxTool.clrRed);
    }
    //FX
    if(!settings.fxMute){
        ctxTool.circle(settingsMenu.circle2[0], settingsMenu.circle2[1], settingsMenu.circle2[2], ctxTool.clrGrey);
    }
    else{
        ctxTool.circle(settingsMenu.circleBX, settingsMenu.circle2[1], settingsMenu.circle2[2], ctxTool.clrGrey);
        ctxTool.line(settingsMenu.line2[0], settingsMenu.line2[1], settingsMenu.line2[2], settingsMenu.line2[3], 3, ctxTool.clrRed);
    }
    //MOUSE CONTROL
    if(!settings.mouseControl){
        ctxTool.circle(settingsMenu.circle3[0], settingsMenu.circle3[1], settingsMenu.circle3[2], ctxTool.clrGrey);
    }
    else{
        ctxTool.circle(settingsMenu.circle3BX, settingsMenu.circle3[1], settingsMenu.circle3[2], ctxTool.clrGrey);
    }
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(settingsMenu.rectMusicSwitch) || 
       ui.targetCollision(settingsMenu.rectFxSwitch) ||
       ui.targetCollision(settingsMenu.rectCtrlSwitch) ||
       ui.targetCollision(settingsMenu.rectBackBtn) ){
        canvas.style.cursor = "pointer";
    }
    else{ canvas.style.cursor = "default"; }
}

//INVENTORY MENU
function InventoryMenu(){
    this.bgP;
    this.bgS;
    this.bgShop;
    this.btnLoadout;
    this.tab = 1;
    this.selection = null;
    this.shopWindow = false;
    this.goldXY = [300*sizeManager.factor, 30*sizeManager.factor];
    this.rectTab0 = [50*sizeManager.factor, 75*sizeManager.factor, 500*sizeManager.factor, 50*sizeManager.factor];
    this.rectTab1 = [50*sizeManager.factor, 75*sizeManager.factor, 250*sizeManager.factor, 50*sizeManager.factor];
    this.rectTab2 = [300*sizeManager.factor, 75*sizeManager.factor, 250*sizeManager.factor, 50*sizeManager.factor];
    this.rectMain = [90*sizeManager.factor, 154*sizeManager.factor, 420*sizeManager.factor, 212*sizeManager.factor];
    this.rectBtn = [100*sizeManager.factor, 544*sizeManager.factor, 108*sizeManager.factor, 40*sizeManager.factor];
    this.rectBtnTxt = [154*sizeManager.factor, 570*sizeManager.factor];
    this.rectBack = [445*sizeManager.factor, 675*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor];
    this.rectItmX = [94*sizeManager.factor, 198*sizeManager.factor, 302*sizeManager.factor, 406*sizeManager.factor,
                     94*sizeManager.factor, 198*sizeManager.factor, 302*sizeManager.factor, 406*sizeManager.factor];
    this.rectItmY = [158*sizeManager.factor, 158*sizeManager.factor, 158*sizeManager.factor, 158*sizeManager.factor,
                     262*sizeManager.factor, 262*sizeManager.factor, 262*sizeManager.factor, 262*sizeManager.factor];
    this.rectItmW = 100*sizeManager.factor;
    this.rectInfo = [104*sizeManager.factor, 424*sizeManager.factor];
    this.rectTxtX = 220*sizeManager.factor;
    this.rectTxtY = [434*sizeManager.factor, 460*sizeManager.factor, 485*sizeManager.factor, 510*sizeManager.factor, 535*sizeManager.factor, 560*sizeManager.factor];
    this.rectLoad = [104*sizeManager.factor, 630*sizeManager.factor, 308*sizeManager.factor, 100*sizeManager.factor];
    this.rectLoadX = [104*sizeManager.factor, 208*sizeManager.factor, 312*sizeManager.factor];
    this.rectLoadY = 630*sizeManager.factor;
    this.rectLoadW = 100*sizeManager.factor;
    this.rectLoadBtn1R = [114*sizeManager.factor, 635*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtn2R = [218*sizeManager.factor, 635*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtn3R = [322*sizeManager.factor, 635*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtn1E = [114*sizeManager.factor, 695*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtn2E = [218*sizeManager.factor, 695*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtn3E = [322*sizeManager.factor, 695*sizeManager.factor, 80*sizeManager.factor, 30*sizeManager.factor];
    this.rectLoadBtnX = [114*sizeManager.factor, 218*sizeManager.factor, 322*sizeManager.factor, 114*sizeManager.factor, 218*sizeManager.factor, 322*sizeManager.factor];
    this.rectLoadBtnY = [635*sizeManager.factor, 635*sizeManager.factor, 635*sizeManager.factor, 695*sizeManager.factor, 695*sizeManager.factor, 695*sizeManager.factor];
    this.rectLoadBtnWH = [80*sizeManager.factor, 30*sizeManager.factor];
    
    this.rectShopBack = [425*sizeManager.factor, 175*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor];
    this.rectShopIcon = [250*sizeManager.factor, 250*sizeManager.factor];
    this.rectShopTxtX = 300*sizeManager.factor;
    this.rectShopTxtY = [215*sizeManager.factor, 420*sizeManager.factor, 455*sizeManager.factor, 480*sizeManager.factor, 505*sizeManager.factor, 530*sizeManager.factor, 555*sizeManager.factor];
    this.rectShopBtn = [246*sizeManager.factor, 580*sizeManager.factor, 108*sizeManager.factor, 40*sizeManager.factor];
    this.rectShopBtnTxt = [300*sizeManager.factor, 605*sizeManager.factor];
    this.shopEvent = function(){
        var weapon;
        if(this.tab === 1){
            weapon = weaponManager.weaponArrayP[this.selection];
            weapon.lvl = avatar.inventoryP[this.selection];
            if(weapon.cost[weapon.lvl] <= avatar.gold && weapon.lvl < weapon.maxLvl){
                avatar.inventoryP[this.selection]++;
                avatar.gold -= weapon.cost[weapon.lvl];
                profileManager.updateProfile();
            }
        }
        else{
            weapon = weaponManager.weaponArrayS[this.selection];
            weapon.lvl = avatar.inventoryS[this.selection];
            if(weapon.cost[weapon.lvl] <= avatar.gold && weapon.lvl < weapon.maxLvl){
                avatar.inventoryS[this.selection]++;
                avatar.gold -= weapon.cost[weapon.lvl];
                profileManager.updateProfile();
            }
        }
    };
    this.loadoutEvent = function(i){
        if(this.tab === 1){
            switch (i){
                case 0:
                case 1:
                    avatar.loadout[i] = null;
                    break;
                case 3:
                case 4:
                    if(avatar.inventoryP[this.selection] > 0){
                        avatar.loadout[i-3] = weaponManager.weaponArrayP[this.selection];
                        avatar.loadout[i-3].lvl = avatar.inventoryP[this.selection];
                    }
                    break;
            }
        }
        else{
            switch (i){
                case 2:
                    avatar.loadout[i] = null;
                    break;
                case 5:
                    if(avatar.inventoryS[this.selection] > 0){
                        avatar.loadout[i-3] = weaponManager.weaponArrayS[this.selection];
                        avatar.loadout[i-3].lvl = avatar.inventoryS[this.selection];
                    }
                    break;
            }
        }
    };
    this.manageClick = function(){
        //CHECK SHOP WINDOW
        if(this.shopWindow){
            if(ui.targetCollision(this.rectShopBack)){ this.shopWindow = false; }
            if(ui.targetCollision(this.rectShopBtn)){ this.shopEvent();}
        }
        else{
            if(ui.targetCollision(this.rectTab1)){ this.tab = 1; this.selection = null; }
            if(ui.targetCollision(this.rectTab2)){ this.tab = 2; this.selection = null;}
            if(ui.targetCollision(this.rectBack)){ gameManager.changeGameState(3); }
            for(var i = 0 ; i < 8 ; i++){
                if(ui.targetCollision([this.rectItmX[i], this.rectItmY[i], this.rectItmW, this.rectItmW])){
                    this.selection = i;
                }
            }
            if(ui.targetCollision(this.rectBtn)){
                this.shopWindow = true;
            }
            for(var i = 0 ; i < 6 ; i++){
                if(ui.targetCollision([this.rectLoadBtnX[i], this.rectLoadBtnY[i], this.rectLoadBtnWH[0], this.rectLoadBtnWH[1]])){
                    this.loadoutEvent(i);
                }
            }
        }
    };
}
//INVENTORY MENY ANIMATION
function drawInventoryMenu(){
    var weapon;
    //CHECK TAB
    if(inventoryMenu.tab === 1){
        ctx.drawImage(inventoryMenu.bgP, 0, 0, canvas.width, canvas.height);
        if(inventoryMenu.selection !== null){
            weapon = weaponManager.weaponArrayP[inventoryMenu.selection];
            if(weapon){ weapon.lvl = avatar.inventoryP[inventoryMenu.selection]; }
        }
        //WEAPON ICONS
        for(var i = 0 ; i < 8 ; i++){
            if(weaponManager.weaponArrayP[i]){
                ctx.drawImage(weaponManager.weaponArrayP[i].icon, inventoryMenu.rectItmX[i], 
                inventoryMenu.rectItmY[i], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
                //WEPON LOCKED
                if(avatar.inventoryP[i] <= 0){
                    ctx.drawImage(weaponManager.icon.lock, inventoryMenu.rectItmX[i], 
                    inventoryMenu.rectItmY[i], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
                }
            }
        }
    }
    else{
        ctx.drawImage(inventoryMenu.bgS, 0, 0, canvas.width, canvas.height);
        if(inventoryMenu.selection !== null){
            weapon = weaponManager.weaponArrayS[inventoryMenu.selection];
            if(weapon){ weapon.lvl = avatar.inventoryS[inventoryMenu.selection]; }
        }
        //WEAPON ICONS
        for(var i = 0 ; i < 8 ; i++){
            if(weaponManager.weaponArrayS[i]){
                ctx.drawImage(weaponManager.weaponArrayS[i].icon, inventoryMenu.rectItmX[i], 
                inventoryMenu.rectItmY[i], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
                //WEPON LOCKED
                if(avatar.inventoryS[i] <= 0){
                    ctx.drawImage(weaponManager.icon.lock, inventoryMenu.rectItmX[i], 
                    inventoryMenu.rectItmY[i], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
                }
            }
        }
    }
    //SELECTED WEAPON INFO
    if(weapon){
        ctxTool.text("Lvl: " + weapon.lvl, inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[1],
        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
        var btnTxt = "UPGRADE";
        if(weapon.lvl <= 0){ btnTxt = "BUY"; weapon.lvl = 1; }
        if(weapon.lvl >= 5){ btnTxt = "MAX LVL"; }
        //BUY/UPGRADE BTN
        ctxTool.text(btnTxt, inventoryMenu.rectBtnTxt[0], inventoryMenu.rectBtnTxt[1], "center", ctxTool.clrRed);
        //ICON
        ctx.drawImage(weapon.icon, inventoryMenu.rectInfo[0], 
        inventoryMenu.rectInfo[1], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
        //NAME
        ctxTool.text(weapon.name, inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[0], 
        "left", sizeManager.fontSizeS, ctxTool.clrRed);
        switch(weapon.type){
            case weaponType.PROJECTILE_BASIC:
            case weaponType.PROJECTILE_SP:
                //DMG
                ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[2], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                //SPD
                ctxTool.text("Rate: " + (1000/weapon.interval[weapon.lvl]).toFixed(2) + "/s", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[3], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                break;
            case weaponType.BEAM:
                //TICK DMG
                ctxTool.text("Tick Damage: " + weapon.tickDmg[weapon.lvl], inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[2], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                //TICK
                ctxTool.text("Tick: " + weapon.tickInterval[weapon.lvl] + "ms", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[3], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                break;
            case weaponType.SECONDARY:
                //DMG
                ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[2], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                break;
        }
        //ctxTool.text("" + weapon.desc + "", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[3],"left", sizeManager.fontSizeXS, ctxTool.clrRed);
        //OVERHEAT
        ctxTool.text("Overheat: " + weapon.overHeatTime[weapon.lvl]/1000 + "s", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[4], 
        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
        //COOLDOWN
        ctxTool.text("CoolDown: " + weapon.coolDownTime[weapon.lvl]/1000 + "s", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[5], 
        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
    }
    
    //LOADOUT
    for(var i = 0 ; i < avatar.loadout.length ; i++){
        var w = avatar.loadout[i];
        if(w){
            ctx.drawImage(w.icon, inventoryMenu.rectLoadX[i], inventoryMenu.rectLoadY, 
            inventoryMenu.rectLoadW, inventoryMenu.rectLoadW);
        }
    }
    
    //GOLD
    ctxTool.text("Gold: " + avatar.gold, inventoryMenu.goldXY[0], inventoryMenu.goldXY[1], 
    "center", sizeManager.fontSizeS, ctxTool.clrRed);
        
    //CHECK SHOP WINDOW
    if(inventoryMenu.shopWindow){
        ctx.drawImage(inventoryMenu.bgShop, 0, 0, canvas.width, canvas.height);
        //DRAW INFO
        if(weapon){
            //CHECK TAB
            if(inventoryMenu.tab === 1){ weapon.lvl = avatar.inventoryP[inventoryMenu.selection]; }
            else{ weapon.lvl = avatar.inventoryS[inventoryMenu.selection]; }
            //ICON
            ctx.drawImage(weapon.icon, inventoryMenu.rectShopIcon[0], inventoryMenu.rectShopIcon[0], 
            inventoryMenu.rectItmW, inventoryMenu.rectItmW);
            //NAME
            ctxTool.text(weapon.name, inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[0],
            "center", sizeManager.fontSizeS, ctxTool.clrRed);
            //COST
            ctxTool.text(weapon.cost[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[1],
            "center", sizeManager.fontSizeS, ctxTool.clrBlack);
            //LVL
            ctxTool.text("Lvl: " + weapon.lvl, inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[2], 
            "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
            
            var btnTxt = "UPGRADE";
            //WEAPON INFO
            if(weapon.lvl <= 0){
                btnTxt = "BUY"; weapon.lvl = 1;
                switch(weapon.type){
                    case weaponType.PROJECTILE_BASIC:
                    case weaponType.PROJECTILE_SP:
                        //DMG
                        ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        //SPD
                        ctxTool.text("Rate: " + (1000/weapon.interval[weapon.lvl]).toFixed(2) + "/s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        break;
                    case weaponType.BEAM:
                        //TICK DMG
                        ctxTool.text("Tick Damage: " + weapon.tickDmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        //TICK
                        ctxTool.text("Tick: " + weapon.tickInterval[weapon.lvl] + "ms", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        break;
                    case weaponType.SECONDARY:
                        //DMG
                        ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        break;
                }
                //OVERHEAT
                ctxTool.text("Overheat: " + weapon.overHeatTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[5], 
                "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                //COOLDOWN
                ctxTool.text("CoolDown: " + weapon.coolDownTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[6], 
                "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
            }
            else if(weapon.lvl < 5){
                switch(weapon.type){
                    case weaponType.PROJECTILE_BASIC:
                    case weaponType.PROJECTILE_SP:
                        //DMG
                        ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        ctxTool.text(" -> " + weapon.dmg[weapon.lvl+1], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                        //SPD
                        ctxTool.text("Rate: " + (1000/weapon.interval[weapon.lvl]).toFixed(2) + "/s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        ctxTool.text(" -> " + (1000/weapon.interval[weapon.lvl+1]).toFixed(2) + "/s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                        break;
                    case weaponType.BEAM:
                        //TICK DMG
                        ctxTool.text("Tick Damage: " + weapon.tickDmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        ctxTool.text(" -> " + weapon.tickDmg[weapon.lvl+1], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                        //TICK
                        ctxTool.text("Tick: " + weapon.tickInterval[weapon.lvl] + "ms", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        ctxTool.text(" -> " + weapon.tickInterval[weapon.lvl+1] + "ms", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                        break;
                    case weaponType.SECONDARY:
                        //DMG
                        ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        ctxTool.text(" -> " + weapon.dmg[weapon.lvl+1], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                        break;
                }
                //OVERHEAT
                ctxTool.text("Overheat: " + weapon.overHeatTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[5], 
                "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                ctxTool.text(" -> " + weapon.overHeatTime[weapon.lvl+1]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[5], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                //COOLDOWN
                ctxTool.text("CoolDown: " + weapon.coolDownTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[6], 
                "right", sizeManager.fontSizeXS, ctxTool.clrBlack);
                ctxTool.text(" -> " + weapon.coolDownTime[weapon.lvl+1]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[6], 
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
            }
            else{
                btnTxt = "-";
                switch(weapon.type){
                    case weaponType.PROJECTILE_BASIC:
                    case weaponType.PROJECTILE_SP:
                        //DMG
                        ctxTool.text("Damage: " + weapon.dmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        //SPD
                        ctxTool.text("Rate: " + (1000/weapon.interval[weapon.lvl]).toFixed(2) + "/s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        break;
                    case weaponType.BEAM:
                        //TICK DMG
                        ctxTool.text("Tick Damage: " + weapon.tickDmg[weapon.lvl], inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[3], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        //TICK
                        ctxTool.text("Tick: " + weapon.tickInterval[weapon.lvl] + "ms", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[4], 
                        "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                        break;
                }
                //OVERHEAT
                ctxTool.text("Overheat: " + weapon.overHeatTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[5], 
                "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
                //COOLDOWN
                ctxTool.text("CoolDown: " + weapon.coolDownTime[weapon.lvl]/1000 + "s", inventoryMenu.rectShopTxtX, inventoryMenu.rectShopTxtY[6], 
                "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
            }
            //BTN TXT
            ctxTool.text(btnTxt, inventoryMenu.rectShopBtnTxt[0], inventoryMenu.rectShopBtnTxt[1],
            "center", sizeManager.fontSizeXS, ctxTool.clrRed);
        }
        //CHECK MOUSE TARGET COLLISIONS
        if(ui.targetCollision(inventoryMenu.rectShopBack) ||
           ui.targetCollision(inventoryMenu.rectShopBtn) ) {
            canvas.style.cursor = "pointer";
        }
        else{
            canvas.style.cursor = "default";
        }
    }
    else{
        //CHECK MOUSE TARGET COLLISIONS
        if(ui.targetCollision(inventoryMenu.rectLoad)){
            if(inventoryMenu.tab === 1){
                ctx.drawImage(inventoryMenu.btnLoadout, inventoryMenu.rectLoadX[0], inventoryMenu.rectLoadY,
                inventoryMenu.rectLoadW, inventoryMenu.rectLoadW);
                ctx.drawImage(inventoryMenu.btnLoadout, inventoryMenu.rectLoadX[1], inventoryMenu.rectLoadY,
                inventoryMenu.rectLoadW, inventoryMenu.rectLoadW);
            }
            else{
                ctx.drawImage(inventoryMenu.btnLoadout, inventoryMenu.rectLoadX[2], inventoryMenu.rectLoadY,
                inventoryMenu.rectLoadW, inventoryMenu.rectLoadW);
            }
        }
        if(ui.targetCollision(inventoryMenu.rectTab0) ||
           ui.targetCollision(inventoryMenu.rectMain) ||
           ui.targetCollision(inventoryMenu.rectBtn) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn1R) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn2R) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn3R) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn1E) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn2E) ||
           ui.targetCollision(inventoryMenu.rectLoadBtn3E) ||
           ui.targetCollision(inventoryMenu.rectBack) ){
            canvas.style.cursor = "pointer";
        }
        else{
            canvas.style.cursor = "default";
        }
    }
}

//PRE GAME ANIMATION
function PreGame(){
    this.bg;
    this.barTop;
    this.barBtm;
    this.msg = "READY?";
    this.delayStart = false;
    this.delayStartTime;
    this.delay = 800;
    
    this.barW = 600*sizeManager.factor;
    this.barH = 80*sizeManager.factor;
    this.barMs = 1.5*sizeManager.factor;
    this.rectBarTopY = -80*sizeManager.factor;
    this.rectBarBtmY = canvas.height;
    this.animate = function(){
        if(this.rectBarTopY < 0){
            this.rectBarTopY += this.barMs;
            this.rectBarBtmY -= this.barMs;
        }
        else{
            this.rectBarTopY = 0;
            this.rectBarTopX = canvas.height - this.barH;
            this.msg = "COMMENCE";
            if(!this.delayStart){ this.delayStart = true; this.delayStartTime = Date.now(); }
            if(this.delayStart && Date.now() >= this.delayStartTime + this.delay){
                this.delayStart = false;
                //GO TO GAME
                gameManager.changeGameState(7);
                ctxTool.toast("LEVEL: 1");
            }
        }
    };
    this.reset = function(){
        this.msg = "READY?";
        this.rectBarTopY = -80*sizeManager.factor;
        this.rectBarBtmY = canvas.height;
    };
}
//PRE GAME ANIMATION
function drawPreGame(){
    //MAIN BG
    ctx.drawImage(preGame.bg, 0, 0, canvas.width, canvas.height);
    //Message
    ctxTool.text(preGame.msg, 300*sizeManager.factor, 300*sizeManager.factor, "center", sizeManager.fontSizeL, ctxTool.clrRed);
    //ANIMATION
    preGame.animate();
    //BARS
    ctx.drawImage(preGame.barTop, 0, preGame.rectBarTopY, preGame.barW, preGame.barH);
    ctx.drawImage(preGame.barBtm, 0, preGame.rectBarBtmY, preGame.barW, preGame.barH);
    //AVATAR
    avatar.toggleBlink();
    if(!avatar.blink){
        ctx.drawImage(avatar.sprite, avatar.x, avatar.y, avatar.width, avatar.height);
    }
}

// --- === GAME === ---
//GAME UI
function GameUI(){
    this.bg;
    this.barTop;
    this.barBtm;
    this.barHeight = 80*sizeManager.factor;
    this.gameAreaYTop = 80*sizeManager.factor;
    this.gameAreaYBtm = 80*sizeManager.factor + canvas.height - (160*sizeManager.factor);
    this.rectBarX = [25*sizeManager.factor, 175*sizeManager.factor, 400*sizeManager.factor];
    this.rectBarY = 794*sizeManager.factor;
    this.rectBarH = 4*sizeManager.factor;
    this.circleX =[75*sizeManager.factor, 225*sizeManager.factor, 450*sizeManager.factor];
    this.circleY = 760*sizeManager.factor;
    this.circleR = 25*sizeManager.factor;
    this.circleTxtY = 765*sizeManager.factor;
    
    //KILL STREAK
    this.streak = 0;
    this.endStreak = function(){
        if(this.streak > 5){
            var bonus;
            if(this.streak < 20){
                bonus = Math.floor(this.streak/2);
                avatar.score += bonus;
            }
            else{
                bonus = Math.round(this.streak/1.5);
                avatar.score += bonus;
            }
            ctxTool.toast("Streak bonus: " + bonus);
            this.streak = 0;
        }
        else{
            this.streak = 0;
        }
        
    };
    
    //AVATAR MOVMENT
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.fire = false;
    this.fireS = false;
    
    this.resetUI = function(){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.fire = false;
        this.fireS = false;
        this.streak = 0;
    };
    
    this.drawInventory = function(){
        //Primary
        if(avatar.loadout[0]){
            ctx.drawImage(avatar.loadout[0].icon, 50*sizeManager.factor, 735*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor);
            
        }
        if(avatar.loadout[1]){
            ctx.drawImage(avatar.loadout[1].icon, 200*sizeManager.factor, 735*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor);
            
        }
        //Secondary
        if(avatar.loadout[2]){ ctx.drawImage(avatar.loadout[2].icon, 425*sizeManager.factor, 735*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor); }
        //OVERHEAT BAR AND COOLDOWN
        for(var i = 0 ; i < avatar.loadout.length ; i++){
            //BAR
            if(avatar.loadout[i] && avatar.loadout[i].heatBarW > 0){
                var tx = this.rectBarX[i] + avatar.loadout[i].heatBarW;
                ctxTool.line(this.rectBarX[i], this.rectBarY, tx, this.rectBarY, this.rectBarH, ctxTool.clrRed2);
            }
            //COOLDOWN
            if(avatar.loadout[i] && avatar.loadout[i].disabled){
                var dur = avatar.loadout[i].checkDisableDur();
                var arc = Math.PI*(avatar.loadout[i].checkDisableRatio()*2 + 1.5);
                ctxTool.circle(this.circleX[i], this.circleY, this.circleR, ctxTool.clrRedT);
                ctxTool.arc(this.circleX[i], this.circleY, this.circleR, arc, ctxTool.clrRedT);
                ctxTool.text(dur, this.circleX[i], this.circleTxtY, "center", sizeManager.fontSizeXS, ctxTool.clrBlack);
            }
        }
        
        //Selection
        if(avatar.activeWeaponIndex === 0){ ctxTool.strokeRect(50*sizeManager.factor, 735*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor, 4*sizeManager.factor, ctxTool.clrRed); }
        if(avatar.activeWeaponIndex === 1){ ctxTool.strokeRect(200*sizeManager.factor, 735*sizeManager.factor, 50*sizeManager.factor, 50*sizeManager.factor, 4*sizeManager.factor, ctxTool.clrRed); }
    };
    this.drawScore = function(){
        ctxTool.text(avatar.score, 300*sizeManager.factor, 50*sizeManager.factor, "center", sizeManager.fontSizeS, ctxTool.clrRed);
        ctxTool.text(this.streak, 100*sizeManager.factor, 60*sizeManager.factor, "center", sizeManager.fontSizeS, ctxTool.clrRed);
    };
    this.drawAvatar = function(){
        if(settings.mouseControl){
            //MOUSE POSITION
            if(ui.avatarTargetY < avatar.y){ this.up    = true; } else { this.up    = false; }
            if(ui.avatarTargetY > avatar.y){ this.down  = true; } else { this.down  = false; }
            if(ui.avatarTargetX < avatar.x){ this.left  = true; } else { this.left  = false; }
            if(ui.avatarTargetX > avatar.x){ this.right = true; } else { this.right = false; }
            //DOUBLE AXIS MOVEMENT
            var distX = Math.abs(ui.avatarTargetX - avatar.x);
            var distY = Math.abs(ui.avatarTargetY - avatar.y);
            if( distX > distY ){
                avatar.msX = avatar.ms;
                avatar.msY = distY / (distX/avatar.ms);
            }
            else if(distY > distX){
                avatar.msX = distX / (distY/avatar.ms);
                avatar.msY = avatar.ms;
            }
            else{
                avatar.msX = avatar.ms;
                avatar.msY = avatar.ms;
            }
            //APPROACH POSITION
            if(distX < 8*sizeManager.factor){ avatar.msX = 2; }
            if(distY < 8*sizeManager.factor){ avatar.msY = 2; }
            if(distX < 2*sizeManager.factor){ avatar.msX = 0.5; }
            if(distY < 2*sizeManager.factor){ avatar.msY = 0.5; }
        }
        //BORDER COLLISION
        if(avatar.y <= this.gameAreaYTop)                { this.up = false; }
        if(avatar.y >= this.gameAreaYBtm - avatar.height){ this.down = false; }
        if(avatar.x <= 0)                                { this.left = false; }
        if(avatar.x >= canvas.width - avatar.width)      { this.right = false; }
        
        //FINAL POSITIONING
        if(this.up)     { avatar.y -= avatar.msY; }
        if(this.down)   { avatar.y += avatar.msY; }
        if(this.left)   { avatar.x -= avatar.msX; }
        if(this.right)  { avatar.x += avatar.msX; }
        
        // DARW
        //GODMODE
        if(avatar.godMode){
            avatar.toggleBlink();
            //DRAW
            if(!avatar.blink){
                ctx.drawImage(avatar.sprite, avatar.x, avatar.y, avatar.width, avatar.height);
            }
        }
        else{
            ctx.drawImage(avatar.sprite, avatar.x, avatar.y, avatar.width, avatar.height);
        }
        
    };
    this.drawEnemy = function(){
        //ITERATE ENEMY ARRAY
        for(var i = 0 ; i < enemyManager.enemyArray.length ; i++){
            var e = enemyManager.enemyArray[i];
            //POSITIONING / MOVEMENT
            var msM = enemyManager.spdModifier * e.ms;
            e.y += msM;
            //BORDER COLLISION (Exit bottom)
            if(e.y >= gameUI.gameAreaYBtm){
                enemyManager.enemyArray.splice(i,1);
                i--;
                this.endStreak();
            }
            //ELSE CHECK PROJECTILE COLLISION // BEAM COLLISION // AVATAR COLLISION
            else{
                //CHECK ENEMY HEATH AND KILL
                if(e.hp <= 0){
                    avatar.score += e.gold;
                    this.streak += 1;
                    enemyManager.enemyDeathArray.push(enemyManager.enemyArray.splice(i,1)[0]);
                    explosionManager.explosionArray.push(new Explosion(e.x, e.y));
                }
                //PROJECTILE COLLISION
                for(var j = 0 ; j < projectileManager.projectileArray.length ; j++){
                    var p = projectileManager.projectileArray[j];
                    switch(p.type){
                        case weaponType.PROJECTILE_BASIC:
                            if(ctxTool.objPtCollision([e.x,e.y,e.width,e.height],[p.x,p.y])){
                                projectileManager.projectileArray.splice(j,1);
                                j--;
                                e.hp -= p.dmg;
                            }
                            break;
                        case weaponType.PROJECTILE_SP:
                            if(ctxTool.objObjCollision([e.x,e.y,e.width,e.height],[p.offsetX(),p.y, p.width, p.height])){
                                projectileManager.projectileArray.splice(j,1);
                                j--;
                                e.hp -= p.dmg;
                            }
                            break;
                    }
                }
                //BEAM COLLISION
                var w = avatar.loadout[avatar.activeWeaponIndex];
                if(w && w.type === weaponType.BEAM){
                    if(w.tick){
                        if(ctxTool.objObjCollision([e.x,e.y,e.width,e.height], w.beamCoordinates())){
                            e.hp -= w.tickDmg[w.lvl];
                        }
                    }
                }
                //AVATAR COLLISION
                if(!avatar.godMode && !avatar.invincible){
                    if(ctxTool.objObjCollision([avatar.x,avatar.y,avatar.width,avatar.height],
                                                [e.x,e.y,e.width,e.height])){
                        enemyManager.enemyDeathArray.push(enemyManager.enemyArray.splice(i,1)[0]);
                        explosionManager.explosionArray.push(new Explosion(e.x, e.y));
                        i--;
                        avatar.hp -= 1;
                    }
                }
            }
            
            //DRAW
            ctx.drawImage(e.sprite, e.x, e.y, e.width, e.height);
        }
        
        //ITERATE ENEMY DEATH ARRAY
        for(var i = 0 ; i < enemyManager.enemyDeathArray.length ; i++){
            var e = enemyManager.enemyDeathArray[i];
            if(e){
                if(e.alpha > 0){
                    e.alpha -= 0.015;
                }
                else{
                    enemyManager.enemyDeathArray.splice(i,1);
                    i--;
                }
                ctx.globalAlpha = e.alpha;
                if(e.alpha <= 0){ ctx.globalAlpha = 0; }
                ctx.drawImage(e.sprite, e.x, e.y, e.width, e.height);
                ctx.globalAlpha = 1;
            }
        }
    };
    this.drawBoss = function(){
        if(enemyManager.boss && !enemyManager.bDeathTime){
            var b = enemyManager.boss;
            //TRIGGER
            b.trigger();
            //HEALTH BAR / CONTAINER
            ctxTool.strokeRect(b.hbcx(), b.hbcy(), b.healthBarContainerW, b.healthBarContainerH, b.healthBarContainerLW, ctxTool.clrBlack);
            ctxTool.line(b.hbx(), b.hby(), b.hbxt(), b.hby(), b.healthBarH, ctxTool.clrRed2);
            //MOVEMENT
            var msM = enemyManager.spdModifier * b.ms;
            if(b.y < 100*sizeManager.factor){
                b.y += msM;
            }
            else{
                b.y = 100*sizeManager.factor;
                if(b.left){
                    if(b.x > 0 ){ b.x -= msM; }
                    else{ b.left = false; b.right = true; }
                }
                if(b.right){
                    if(b.x < canvas.width-b.width){ b.x += msM; }
                    else{ b.right= false; b.left = true; }
                }
            }
            //COLLISIONS
            //PROJECTILE COLLISIONS
            for(var j = 0 ; j < projectileManager.projectileArray.length ; j++){
                var p = projectileManager.projectileArray[j];
                switch(p.type){
                    case weaponType.PROJECTILE_BASIC:
                        if(ctxTool.objPtCollision([b.x,b.y,b.width,b.height],[p.x,p.y])){
                            projectileManager.projectileArray.splice(j,1);
                            j--;
                            b.hp -= p.dmg;
                        }
                        break;
                    case weaponType.PROJECTILE_SP:
                        if(ctxTool.objObjCollision([b.x,b.y,b.width,b.height],[p.offsetX(),p.y, p.width, p.height])){
                            projectileManager.projectileArray.splice(j,1);
                            explosionManager.explosionArray.push(new Explosion(p.x, p.y));
                            j--;
                            b.hp -= p.dmg;
                        }
                        break;
                }
            }
            //BEAM COLLISION
            var w = avatar.loadout[avatar.activeWeaponIndex];
            if(w && w.type === weaponType.BEAM){
                if(w.tick){
                    if(ctxTool.objObjCollision([b.x,b.y,b.width,b.height], w.beamCoordinates())){
                        b.hp -= w.tickDmg[w.lvl];
                    }
                }
            }
            //AVATAR COLLISION
            if(!avatar.godMode && !avatar.invincible){
                if(ctxTool.objObjCollision([avatar.x,avatar.y,avatar.width,avatar.height],
                                            [b.x,b.y,b.width,b.height])){
                    explosionManager.explosionArray.push(new Explosion(b.x, b.y));
                    avatar.hp -= 1;
                }
            }
            
            //BOSS DEATH
            if(b.hp <= 0){
                enemyManager.enemyDeathArray.push(b);
                avatar.score += b.gold;
                //EXPLOSIONS
                explosionManager.explosionArray.push(new Explosion(b.ax()-sizeManager.spriteWidth/2,b.ay()-sizeManager.spriteHeight/2));
                //explosionManager.explosionArray.push(new Explosion(b.ax()-sizeManager.spriteWidth/2,b.ay()-sizeManager.spriteHeight/2, 1500));
                explosionManager.explosionArray.push(new Explosion(b.x,b.y, 300));
                explosionManager.explosionArray.push(new Explosion(b.x+b.width-sizeManager.spriteWidth,b.y+b.height-sizeManager.spriteHeight, 600));
                explosionManager.explosionArray.push(new Explosion(b.x,b.y+b.height-sizeManager.spriteHeight, 900));
                explosionManager.explosionArray.push(new Explosion(b.x+b.width-sizeManager.spriteWidth,b.y, 1200));
            }
            
            //DRAW
            ctx.drawImage(b.sprite, b.x, b.y, b.width, b.height);
        }
    };
    this.drawExplosions = function(){
        for(var i = 0 ; i < explosionManager.explosionArray.length ; i++){
            var e = explosionManager.explosionArray[i];
            if(e && !e.delay){
                if(!e.start){
                    if(!e.mute){ audioSynth.playClip(audioSynth.clip.EXPLOSION); }
                    e.start = true;
                }
                if(Date.now() >= e.frameStartTime + e.frameDuration){
                    e.frameStartTime = Date.now();
                    e.state++;
                }
                if(e.state < 3){
                    ctx.drawImage(explosionManager.spriteArray[e.state], e.x, e.y, e.width, e.height);
                }
                else{
                    explosionManager.explosionArray.splice(i,1);
                    i--;
                }
            }
            else if(e && e.delay){
                if(Date.now() > e.frameStartTime+e.delay){
                    e.delay = null;
                    e.frameStartTime = Date.now();
                }
            }
        }
    };
    this.drawWeaponEffect = function(){
        //DRAW PROJECTILES
        for(var i= 0 ; i < projectileManager.projectileArray.length ; i++){
            var p = projectileManager.projectileArray[i];
            //POSITION / MOVEMENT
            p.y -= p.ms;
            //RENDER PROJECTILE
            switch(p.type){
                case weaponType.PROJECTILE_BASIC:
                    ctxTool.circle(p.x, p.y, p.r, p.clr);
                    break;
                case weaponType.PROJECTILE_SP:
                    ctx.drawImage(p.sprite, p.x, p.y, sizeManager.spriteWidth, sizeManager.spriteHeight);
                    break;
            }
            
            //ESCAPE BORDER
            if(p.y < 0){
                projectileManager.projectileArray.splice(i,1);
                i--;
            }
        }
        //DRAW OTHER WEAPON EFFECTS
        var w = avatar.loadout[avatar.activeWeaponIndex];
        //DRAW BEAM
        if(w && w.type === weaponType.BEAM){
            if(w.origin){
                var bw;
                if(w.tick){ bw = w.widthTick; }
                else{ bw = w.width; }
                ctxTool.line(w.origin[0], w.origin[1], w.origin[0], 0, bw, w.clr);
            }
        }
        //DRAW SECONDARY WEAPON EFFECTS
        var ws = avatar.loadout[2];
        if(ws && ws.type === weaponType.SECONDARY){
            ws.effectAnimationS();
        }
    };
    this.drawEnemyWeaponEffect = function(){
        //DRAW PROJECTILES
        for(var i= 0 ; i < projectileManager.projectileArrayE.length ; i++){
            var p = projectileManager.projectileArrayE[i];
            //POSITION / MOVEMENT
            var msM = enemyManager.spdModifier * p.ms;
            p.y += msM;
            //RENDER PROJECTILE && COLLISIONS
            switch(p.type){
                case weaponType.PROJECTILE_BASIC:
                    //RENDER
                    ctxTool.circle(p.x, p.y, p.r, p.clr);
                    //COLLISION
                    if(!avatar.invincible && !avatar.godMode){
                        if(ctxTool.objPtCollision([avatar.x,avatar.y,avatar.width,avatar.height],[p.x,p.y])){
                            projectileManager.projectileArrayE.splice(i,1);
                            avatar.hp -= p.dmg;
                        }
                    }  
                    break;
                case weaponType.PROJECTILE_SP:
                    //RENDER
                    ctx.drawImage(p.sprite, p.x, p.y, sizeManager.spriteWidth, sizeManager.spriteHeight);
                    //COLLISION
                    if(!avatar.invincible && !avatar.godMode){
                        if(ctxTool.objObjCollision([avatar.x,avatar.y,avatar.width,avatar.height],[p.offsetX(),p.y, p.width, p.height])){
                            projectileManager.projectileArrayE.splice(i,1);
                            avatar.hp -= p.dmg;
                        }
                    } 
                    break;
            }
            
            //ESCAPE BORDER
            if(p.y < 0){
                projectileManager.projectileArrayE.splice(i,1);
                i--;
            }
        }
    };
    
    this.keyDown = function(keyCode){
        switch(keyCode){
            case 38:
                this.up = true;
                break;
            case 40:
                this.down = true;
                break;
            case 37:
                this.left = true;
                break;
            case 39:
                this.right = true;
                break;
            case 90:
                this.fire = true;
                break;
            case 88:
                this.fireS = true;
                break;
            case 67:
                break;
        }
    };
    this.keyUp = function(keyCode){
        switch(keyCode){
            case 38:
                this.up = false;
                break;
            case 40:
                this.down = false;
                break;
            case 37:
                this.left = false;
                break;
            case 39:
                this.right = false;
                break;
            case 90:
                this.fire = false;
                break;
            case 88:
                this.fireS = false;
                break;
            case 67:
                avatar.cycleWeapons();
                break;
            case 71:
                avatar.toggleGodMode();
        }
    };
    this.mouseDown = function(btn){
        switch(btn){
            case 0:
                this.fire = true;
                break;
            case 2:
                this.fireS = true;
        }
    };
    this.mouseUp = function(btn){
        switch(btn){
            case 0:
                this.fire = false;
                break;
            case 2:
                this.fireS = false;
        }
    };
}
//GAME ANIMATION
function drawGame(){
    //BG
    ctx.drawImage(gameUI.bg, 0, 0, canvas.width, canvas.height);
    //AVATAR
    gameUI.drawAvatar();
    //TRIGGER WEAPON / COOLDOWN
    for(var i = 0 ; i < 2 ; i++){
        if(avatar.loadout[i]){
            if(i === avatar.activeWeaponIndex && gameUI.fire){ avatar.loadout[i].triggerOn(); }
            else{ avatar.loadout[i].triggerOff(); }
        }
    }
    //TRIGGER SECONDARY WEAPON
    if(avatar.loadout[2] && gameUI.fireS){ avatar.loadout[2].triggerOn(); }
    else if(avatar.loadout[2] && !gameUI.fireS){ avatar.loadout[2].triggerOff(); }
    
    //ENEMY
    gameUI.drawEnemy();
    //BOSS
    gameUI.drawBoss();
    //EXPLOSIONS
    gameUI.drawExplosions();
    //PROJECTILE//Beam//EFFECT
    gameUI.drawWeaponEffect();
    gameUI.drawEnemyWeaponEffect();
    
    //TRY SPAWN ENEMY
    enemyManager.spawn();
    //BARS
    ctx.drawImage(gameUI.barTop, 0, 0, canvas.width, gameUI.barHeight);
    ctx.drawImage(gameUI.barBtm, 0, canvas.height - gameUI.barHeight, canvas.width, gameUI.barHeight);
    //SCORE
    gameUI.drawScore();
    //INVENTORY
    gameUI.drawInventory();
    
    if(avatar.hp <= 0){
        gameUI.endStreak();
        audioSynth.synthOffAll();
        audioSynth.playClip(audioSynth.clip.EXPLOSION);
        gameManager.changeGameState(8);
        death.initCoordinates(avatar.x, avatar.y);
    }
}

//DEATH
function Death(){
    this.bg;
    this.btnBack;
    this.msgY = 400*sizeManager.factor;
    this.scoreY = 450*sizeManager.factor;
    this.rectBtnBack = [237.5*sizeManager.factor, 625*sizeManager.factor, 125*sizeManager.factor, 50*sizeManager.factor];
    this.explosionInterval = 1500;
    this.lastExplosionTime = Date.now();
    this.explosionCount = 0;
    this.explosionX;
    this.explosionY;
    this.initCoordinates = function(x,y){
        this.explosionX = [x, x-avatar.width/2, x+avatar.width/2, x,                 x];
        this.explosionY = [y, y               , y               , y-avatar.height/2, y+avatar.width/2];
    };
    this.drawMsg = function(){
        ctxTool.text("YOU DIED", canvas.width/2, this.msgY, "center", sizeManager.fontSizeL, ctxTool.clrRed);
        ctxTool.text("Final Score: " + avatar.score, canvas.width/2, this.scoreY, "center", sizeManager.fontSizeM, ctxTool.clrRed);
        ctx.drawImage(this.btnBack, this.rectBtnBack[0], this.rectBtnBack[1], this.rectBtnBack[2], this.rectBtnBack[3]);
    };
    this.drawAvatar = function(){
        ctx.drawImage(avatar.sprite, avatar.x, avatar.y, avatar.width, avatar.height);
        //EXPLOSIONS
    };
    this.generateExplosions = function(){
        if(Date.now() > this.lastExplosionTime + this.explosionInterval){
            this.lastExplosionTime = Date.now();
            for(var i = 0 ; i < 5 ; i++){
                explosionManager.explosionArray.push(
                    new Explosion(this.explosionX[i], this.explosionY[i], 
                    (i*300), true)
                );
            }
        }
    };
    this.manageClick = function(){
        if(ui.targetCollision(this.rectBtnBack)){
            gameManager.changeGameState(1);
        }
    };
}
//DEATH ANIMATION
function drawDeath(){
    ctx.drawImage(death.bg, 0, 0, canvas.width, canvas.height);
    //SCORE
    gameUI.drawScore();
    //AVATAR
    death.drawAvatar();
    //GENERATE EXPLOSIONS
    death.generateExplosions();
    //EXPLOSIONS
    gameUI.drawExplosions();
    //MSG
    death.drawMsg();
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(death.rectBtnBack)){
        canvas.style.cursor = "pointer";
    }
    else{ canvas.style.cursor = "default"; }
}

//DRAWING TOOLS
function CtxTool(){
    this.clrBlack = "#000000";
    this.clrWhite = "#ffffff";
    this.clrGrey = "#4a4a4a";
    this.clrGreyT = "rgba(74, 74, 74, 0.5)";
    this.clrRed = "#9c1919";
    this.clrRed2 = "#ff0000";
    this.clrRedT = "rgba(156, 25, 25, 0.5)";
    this.clrYellow = "#ffff00";
    this.clrBlue = "#0078f8";
    this.clrBlueT = "rgba(0, 120, 248, 0.5)";
    this.clrGreen = "#00ff00";
    this.clrGreenT = "rgba(0, 250, 0, 0.5)";
    this.circle = function(x,y,r,clr){
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    };
    this.arc = function(x,y,r,arc,clr){
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(x, y, r, Math.PI*1.5, arc, true);
        ctx.lineTo(x,y);
        ctx.fill();
        ctx.closePath();
    };
    this.rect = function(x,y,w,h, clr){
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = clr;
        ctx.fill();
        ctx.closePath();
    };
    this.strokeRect = function(x, y, w, h, lw, clr){
        ctx.lineWidth = lw;
        ctx.strokeStyle = clr;
        ctx.strokeRect(x,y,w,h);
    };
    this.line = function(ox,oy,tx,ty,w,clr){
        ctx.beginPath();
        ctx.lineWidth = w;
        ctx.strokeStyle = clr;
        ctx.moveTo(ox,oy);
        ctx.lineTo(tx,ty);
        ctx.closePath();
        ctx.stroke();
    };
    this.text = function(text, x, y, align, size, clr){
        ctx.font = size + "px Courier";
        ctx.textAlign = align;
        ctx.fillStyle = clr;
        ctx.fillText(text, x, y);
    };
    
    var toastQueue = [];
    var toastText = null;
    var toastStart = null;
    var toastDuration = 1300;
    var toastAlpha = null;
    this.toast = function(text){
        toastQueue.push(text);
    };
    this.drawToast = function(){
        if(toastText){
            if(Date.now() < toastStart + toastDuration){
                if(toastAlpha < 1){ toastAlpha += 0.05; }
            }
            else{
                if(toastAlpha > 0){ toastAlpha -= 0.05; }
                else{ toastText = null; toastStart = null; toastAlpha = null; }
            }
            ctx.globalAlpha = toastAlpha;
            if(toastAlpha <= 0){ ctx.globalAlpha = 0 ;}
            this.text(toastText, canvas.width/2, canvas.height/3, "center", sizeManager.fontSizeM, this.clrWhite);
            ctx.globalAlpha = 1;
        }
        else{
            if(toastQueue.length > 0){
                toastText = toastQueue.splice(0,1)[0];
                toastStart = Date.now();
                toastAlpha = 0;
            }
        }
    };
    
    this.objObjCollision = function(a1,a2){
        var a1x = a1[0]; var a1y = a1[1]; var a1w = a1[2]; var a1h = a1[3];
        var a2x = a2[0]; var a2y = a2[1]; var a2w = a2[2]; var a2h = a2[3];
        if(a1x < a2x + a2w &&
           a1x + a1w > a2x &&
           a1y < a2y + a2h &&
           a1y + a1h > a2y){
            return true;
        }
    };
    this.objPtCollision = function(a1, xy){
        var a1x = a1[0]; var a1y = a1[1]; var a1w = a1[2]; var a1h = a1[3];
        var x = xy[0]; var y = xy[1];
        if(x > a1x && x < a1x + a1w && y > a1y && y < a1y + a1h){
            return true;
        }
    };
}
//UI
function UI(){
    //MOUSE / TOUCH TARGET
    this.targetX;
    this.targetY;
    
    this.avatarTargetX;
    this.avatarTargetY;
    
    //KEYBOARD
    this.keyDown = function(keyCode, key){
        switch(gameManager.gameState){
            case 0:
                break;
            case 1:
                break;
            case 2:
                profileMenu.manageInput(key);
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                gameUI.keyDown(keyCode);
                break;
        }
    };
    this.keyUp = function(keyCode, key){
        switch(gameManager.gameState){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                gameUI.keyUp(keyCode);
                break;
        }
    };
    
    //MOUSE
    this.mouseDown = function(btn){
        switch(gameManager.gameState){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                gameUI.mouseDown(btn);
                break;
        }
        
    };
    this.mouseUp = function(btn){
        switch(gameManager.gameState){
            case 0:
                break;
            case 1:
                break;
            case 2:
                profileMenu.manageClick();
                break;
            case 3:
                mainMenu.manageClick();
                break;
            case 4:
                settingsMenu.manageClick();
                break;
            case 5:
                inventoryMenu.manageClick();
                break;
            case 6:
                break;
            case 7:
                gameUI.mouseUp(btn);
                break;
            case 8:
                death.manageClick();
                break;
        }
    };
    
    //TOUCH
    this.touchScreen = false;
    
    //CHECK FOR TARGET
    this.targetCollision = function(array){
        var objX, objY, objW, objH;
        if(array){
            objX = array[0];
            objY = array[1];
            objW = array[2];
            objH = array[3];
        }
        if(this.targetX > objX && this.targetX < objX + objW && this.targetY > objY && this.targetY < objY + objH){
            return true;
        }else {return false;}
    };
    
    this.addEventListeners = function(){
        //KEYBOARD
        document.addEventListener("keydown", function(event){
            ui.keyDown(event.keyCode, event.key);
        });
        document.addEventListener("keyup", function(event){
            ui.keyUp(event.keyCode, event.key);
        });
        //MOUSE
        canvas.addEventListener("mousemove", function(event){
            ui.targetX = event.pageX - canvas.offsetLeft;
            ui.targetY = event.pageY - canvas.offsetTop;
            ui.avatarTargetX = ui.targetX - avatar.width/2;
            ui.avatarTargetY = ui.targetY - avatar.height/2;
            //document.getElementById("mouseXY").textContent = ui.targetX + " " + ui.targetY;
        });
        canvas.addEventListener("mousedown", function(event){
            event.preventDefault();
            ui.mouseDown(event.button);
        });
        canvas.addEventListener("mouseup", function(event){
            ui.mouseUp(event.button);
        });
        canvas.addEventListener("contextmenu", function(event){
            event.preventDefault();
        });
        //TOUCH
        canvas.addEventListener("touchstart", function(event){
            ui.touchScreen = true;
            ui.targetX = event.changedTouches[0].pageX - canvas.offsetLeft;
            ui.targetY = event.changedTouches[0].pageY - canvas.offsetTop;
            //document.getElementById("mouseXY").textContent = ui.touchX + " " + ui.touchY;
        });
        canvas.addEventListener("touchmove", function(event){
            ui.targetX = event.changedTouches[0].pageX - canvas.offsetLeft;
            ui.targetY = event.changedTouches[0].pageY - canvas.offsetTop;
            //document.getElementById("mouseXY").textContent = ui.touchX + " " + ui.touchY;
        });
    };
    
    //TEXT INPUT
    this.createTextInput = function(y){
        var cover = document.createElement("div");
        cover.id = "cover";
        cover.style.position = "relative";
        cover.style.top = "-" + canvas.height + "px";
        cover.style.width = canvas.width + "px";
        cover.style.height = canvas.height + "px";
        document.getElementById("canvas-holder").appendChild(cover);
        
        var input = document.createElement("input");
        input.type = "text";
        input.style.position = "relative";
        input.style.top = y*sizeManager.factor + "px";
        input.style.left = 190*sizeManager.factor + "px";
        input.style.width = 225*sizeManager.factor + "px";
        input.style.height = 40*sizeManager.factor + "px";
        input.style.font = sizeManager.fontSizeXS + "px Courier";
        input.placeholder = "-NEW PROFILE-";
        document.getElementById("cover").appendChild(input);
        
        var close = document.createElement("div");
        close.id = "circle";
        close.style.position = "absolute";
        close.style.width = sizeManager.fontSizeXS + "px";
        close.style.height = sizeManager.fontSizeXS + "px";
        close.style.top = y*sizeManager.factor + "px";
        close.style.left = 415*sizeManager.factor + "px";
        close.style.border = "1px solid red";
        close.style.borderRadius = sizeManager.fontSizeXS/2 + "px";
        close.style.font = sizeManager.fontSizeXS + "px Arial";
        close.style.color = "red";
        close.textContent = "x";
        close.style.lineHeight = "0.7";
        close.style.textAlign = "center";
        close.style.cursor = "pointer";
        document.getElementById("cover").appendChild(close);
        
        var btn = document.createElement("button");
        btn.style.font = sizeManager.fontSizeXS + "px Courier";
        btn.textContent = "SAVE";
        btn.style.position = "absolute";
        btn.style.height = 40*sizeManager.factor + "px";
        btn.style.top = y*sizeManager.factor + "px";;
        btn.style.left = 350*sizeManager.factor + "px";
        btn.style.cursor = "pointer";
        document.getElementById("cover").appendChild(btn);
        
        //EVENT LISTENERS
        btn.addEventListener("click", function(event){
            if(input.value){
                profileManager.createNewProfile(input.value, profileMenu.selectedProfile);
                cover.parentElement.removeChild(cover);
            }
        });
        close.addEventListener("click", function(event){
            cover.parentElement.removeChild(cover);
        });
    };
}