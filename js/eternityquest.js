/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

var cookieManager;

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
    assetManager.addAsset(mainMenu.bg, "img/eternityquest/bg-menu.png");
    
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
    
    weaponType = {
        PROJECTILE_BASIC: 0,
        PROJECTILE_SP: 1,
        BEAM: 2,
        SECONDARY: 3
    };
    weaponManager = new WeaponManager();
    weaponManager.icon.blaster = new Image();
    weaponManager.icon.fireball = new Image();
    weaponManager.icon.laser = new Image();
    weaponManager.sprites.fireball = new Image();
    assetManager.addAsset(weaponManager.icon.blaster, "img/eternityquest/blaster.png");
    assetManager.addAsset(weaponManager.icon.fireball, "img/eternityquest/fireball.png");
    assetManager.addAsset(weaponManager.icon.laser, "img/eternityquest/laser.png");
    weaponManager.sprites.fireball = weaponManager.icon.fireball;
    weaponManager.initWeapons();
    
    avatar = new Avatar();
    avatar.sprite = new Image();
    assetManager.addAsset(avatar.sprite, "img/eternityquest/avatar.png");
    
    //LOAD ASSETS
    assetManager.loadAll();
    
    //LOAD COOKIES / SETTINGS
    cookieManager = new CookieManager();
    settings = new Settings();
    
    //CTX TOOL
    ctxTool = new CtxTool();
    
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
    this.fontSizeL;
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
        this.fontSizeL = this.factor * 60;
    };
}

//GAME MANAGER
function GameManager(){
    this.gameState;
    this.changeGameState = function(target){
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
                break;
            //SETTINGS MENU
            case 4:
                canvas.style.cursor = "default";
                break;
            //INVENTORY/SHOP
            case 5:
                canvas.style.cursor = "default";
                break;
            //MAIN GAME
            case 6:
                canvas.style.cursor = "crosshair";
                break;
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
    this.settings = "000";
    this.highScore = 0;
    this.gold = 0;
    this.inventory = "00000";
    this.inventoryS = "000";
    
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
    };
    this.toggleFx = function(){
        this.fxMute = !this.fxMute;
        profileManager.updateProfile();
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
    
    this.name;
    this.score;
    this.highScore;
    this.gold;
    this.health;
    
    this.deathDuration;
    this.deathStartTime;
    
    this.activeWeaponIndex;
    this.loadout = [null, null, null];
    this.inventoryP = [];
    this.inventoryS = [];
    
    this.cycleWeapons = function(){
        if(activeWeaponIndex < 1){
            activeWeaponIndex++;
        }
        else{
            activeWeaponIndex = 0;
        }
    };
    
    this.init = function(){
        this.width = sizeManager.spriteWidth;
        this.height = sizeManager.spriteHeight;
    };
    this.load = function(){
        this.name = profile.name;
        this.highScore = profile.highScore;
        this.gold = profile.gold;
        this.inventoryP = profile.inventory.split("").map(Number);
        this.inventoryS = profile.inventoryS.split("").map(Number);
    };
}

//WEAPON MANAGER
function WeaponManager(){
    this.icon = {
        blaster: null,
        fireball: null,
        laser: null
    };
    this.sprites = {
        fireball: null
    };
    this.weaponArrayP = [];
    this.weaponArrayS = [];
    this.initWeapons = function(){
        this.weaponArrayP = [
            new WeaponPProjectileB("Blaster", weaponType.PROJECTILE_BASIC, 0,
                this.icon.blaster, 
                [0, 300, 500, 750, 1000, 1500], //COST
                [0, 5, 10, 15, 20, 25], //DMG
                [0, 100, 90, 80, 70, 60], //INTERVAL
                10, "red" //SPD // CLR
            ),
            new WeaponPProjectileSP("Fireball", weaponType.PROJECTILE_SP, 0,
                this.icon.fireball, 
                [500, 500, 750, 1000, 1300, 1800], //COST
                [0, 25, 35, 55, 75, 100], //DMG
                [0, 200, 190, 180, 175, 150], //INTERVAL
                10, this.sprites.fireball, 30, 50 //SPD //SPRITE //WIDTH //HEIGHT
            ),
            new WeaponPBeam("Laser", weaponType.BEAM, 0,
                this.icon.laser, 
                [1500, 800, 1200, 1700, 2300, 3000], //COST
                [0, 5, 10, 15, 20, 25], //TICK DMG
                [0, 120, 110, 100, 90, 80] //INTERVAL
            )
        ];
        this.weaponArrayS = [
            new WeaponS("EMP", weaponType.SECONDARY, 0)
        ];
    };
}
function Weapon(name, type, lvl, icon, cost){
    this.name = name;
    this.type = type;
    this.lvl = lvl;
    this.icon = icon;
    this.cost = cost;
    this.maxLvl = 5;
}
function WeaponPProjectileB(name, type, lvl, icon, cost, dmg, interval, spd, clr){
    Weapon.call(this, name, type, lvl, icon, cost);
    this.dmg = dmg;
    this.interval = interval;
    this.spd = spd;
    this.clr = clr;
}
function WeaponPProjectileSP(name, type, lvl, icon, cost, dmg, interval, spd, sprite, width, height){
    WeaponPProjectileB.call(this, name, type, lvl, icon, cost, dmg, interval, spd);
    this.sprite = sprite;
    this.spriteWidth = width;
    this.spriteHeight = height;
}
function WeaponPBeam(name, type, lvl, icon, cost, tickDmg, tickInterval){
    Weapon.call(this, name, type, lvl, icon, cost);
    this.tickDmg = tickDmg;
    this.tickInterval = tickInterval;
}
function WeaponS(name, type, lvl, icon, cost){
    Weapon.call(this, name, type, lvl, icon, cost);
    this.coolDown;
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
            drawGame();
            break;
    }
    
    requestAnimationFrame(draw);
}

//LOADER
function Loader(){
    this.msgStartTime = Date.now();
    this.msgInterval = 1000;
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
    if(assetManager && assetManager.loaded && cookieManager){
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
        gameManager.changeGameState(2);
    }
}

//PROFILE MENU
function ProfileMenu(){
    this.bg;
    this.selectedProfile = 0;
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
            ui.createTextInput(240 + this.selectedProfile*125);
        }
    };
    this.deleteProfile = function(){
        var p = profileManager.profileArray[this.selectedProfile];
        if(profileManager.profileArray[this.selectedProfile]){
            if(window.confirm("Delete profile:" + p.name + " permanantly?")){
                profileManager.deleteProfile(this.selectedProfile);
            }
        }
    };
    this.loadProfile = function(){
        profile = profileManager.profileArray[this.selectedProfile];
        avatar.init();
        avatar.load();
        settings.load(profile.settings);
        gameManager.changeGameState(3);
    };
}
//PROFILE MENU
function drawProfileMenu(){
    ctx.drawImage(profileMenu.bg, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.font = sizeManager.fontSizeS + "px Courier";
    var rect = profileMenu.rectArray[profileMenu.selectedProfile];
    ctx.strokeRect(rect[0], rect[1], rect[2], rect[3]);
    var textY = 275*sizeManager.factor;
    for(var i = 0 ; i < 3 ; i++){
        var p = profileManager.profileArray[i];
        if(p){
            ctx.textAlign = "left";
            ctx.fillText(p.name, 190*sizeManager.factor, textY);
        }
        else{
            ctx.textAlign = "center";
            ctx.fillText("EMPTY SLOT", canvas.width/2, textY);
        }
        textY += 125*sizeManager.factor;
    }
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(profileMenu.rect1) ||
           ui.targetCollision(profileMenu.rect2)||
           ui.targetCollision(profileMenu.rect3) ||
           ui.targetCollision(profileMenu.rectLoadBtn)){
       canvas.style.cursor = "pointer";
       ctx.lineWidth = 2;
       ctx.strokeStyle = "red";
       if(ui.targetCollision(profileMenu.rect1X)){
            ctx.strokeRect(profileMenu.rect1X[0], profileMenu.rect1X[1], profileMenu.rect1X[2], profileMenu.rect1X[3]);
        }
       if(ui.targetCollision(profileMenu.rect2X)){
            ctx.strokeRect(profileMenu.rect2X[0], profileMenu.rect2X[1], profileMenu.rect2X[2], profileMenu.rect2X[3]);
        }
       if(ui.targetCollision(profileMenu.rect3X)){
            ctx.strokeRect(profileMenu.rect3X[0], profileMenu.rect3X[1], profileMenu.rect3X[2], profileMenu.rect3X[3]);
        }
    }
        
    else{ canvas.style.cursor = "default"; }
}

//MAIN MENU
function MainMenu(){
    this.bg;
    this.rectSettingsBtn = [25*sizeManager.factor, 650*sizeManager.factor, 150*sizeManager.factor, 100*sizeManager.factor];
    this.rectPlayBtn = [200*sizeManager.factor, 650*sizeManager.factor, 200*sizeManager.factor, 100*sizeManager.factor];
    this.rectInventoryBtn = [425*sizeManager.factor, 650*sizeManager.factor, 150*sizeManager.factor, 100*sizeManager.factor];
    this.manageClick = function(){
        if(ui.targetCollision(this.rectSettingsBtn)){
            gameManager.changeGameState(4);
        }
        if(ui.targetCollision(this.rectInventoryBtn)){
            gameManager.changeGameState(5);
        }
    };
}
//MAIN MENU ANIMATION
function drawMainMenu(){
    ctx.drawImage(mainMenu.bg, 0, 0, canvas.width, canvas.height);
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(mainMenu.rectSettingsBtn) || 
       ui.targetCollision(mainMenu.rectPlayBtn) ||
       ui.targetCollision(mainMenu.rectInventoryBtn) ){
        canvas.style.cursor = "pointer";
    }
    else{ canvas.style.cursor = "default"; }
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
    this.rectTxtY = [434*sizeManager.factor, 460*sizeManager.factor, 485*sizeManager.factor, 510*sizeManager.factor, 535*sizeManager.factor];
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
    this.rectShopTxtY = [215*sizeManager.factor, 420*sizeManager.factor, 455*sizeManager.factor, 480*sizeManager.factor, 505*sizeManager.factor];
    this.rectShopBtn = [246*sizeManager.factor, 580*sizeManager.factor, 108*sizeManager.factor, 40*sizeManager.factor];
    this.rectShopBtnTxt = [300*sizeManager.factor, 605*sizeManager.factor];
    this.shopEvent = function(){
        var weapon;
        if(this.tab === 1){
            weapon = weaponManager.weaponArrayP[this.selection];
            weapon.lvl = avatar.inventoryP[this.selection];
            if(weapon.cost[weapon.lvl] < avatar.gold && weapon.lvl < weapon.maxLvl){
                avatar.inventoryP[this.selection]++;
                avatar.gold -= weapon.cost[weapon.lvl];
                profileManager.updateProfile();
            }
        }
        else{
            weapon = weaponManager.weaponArrayS[this.selection];
            weapon.lvl = avatar.inventoryS[this.selection];
            if(weapon.cost[weapon.lvl] < avatar.gold && weapon.lvl < weapon.maxLvl){
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
    //CHECK TAB
    if(inventoryMenu.tab === 1){
        ctx.drawImage(inventoryMenu.bgP, 0, 0, canvas.width, canvas.height);
        //WEAPON ICONS
        for(var i = 0 ; i < 8 ; i++){
            if(weaponManager.weaponArrayP[i]){
                ctx.drawImage(weaponManager.weaponArrayP[i].icon, inventoryMenu.rectItmX[i], 
                inventoryMenu.rectItmY[i], inventoryMenu.rectItmW, inventoryMenu.rectItmW);
            }
        }
        //SELECTED WEAPON INFO
        if(inventoryMenu.selection !== null){
            var weapon = weaponManager.weaponArrayP[inventoryMenu.selection];
            if(weapon){
                weapon.lvl = avatar.inventoryP[inventoryMenu.selection];
                ctxTool.text("Lvl: " + weapon.lvl, inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[1],
                "left", sizeManager.fontSizeXS, ctxTool.clrRed);
                var btnTxt = "UPGRADE";
                if(weapon.lvl <= 0){ btnTxt = "BUY"; weapon.lvl = 1; }
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
                }
                //ctxTool.text("" + weapon.desc + "", inventoryMenu.rectTxtX, inventoryMenu.rectTxtY[3],"left", sizeManager.fontSizeXS, ctxTool.clrRed);
            }
        }
        //LOADOUT
        for(var i = 0 ; i < avatar.loadout.length ; i++){
            var weapon = avatar.loadout[i];
            if(weapon){
                ctx.drawImage(weapon.icon, inventoryMenu.rectLoadX[i], inventoryMenu.rectLoadY, 
                inventoryMenu.rectLoadW, inventoryMenu.rectLoadW);
            }
        }
    }
    else{
        ctx.drawImage(inventoryMenu.bgS, 0, 0, canvas.width, canvas.height);
    }
    //GOLD
    ctxTool.text("Gold: " + avatar.gold, inventoryMenu.goldXY[0], inventoryMenu.goldXY[1], 
    "center", sizeManager.fontSizeS, ctxTool.clrRed);
        
    //CHECK SHOP WINDOW
    if(inventoryMenu.shopWindow){
        ctx.drawImage(inventoryMenu.bgShop, 0, 0, canvas.width, canvas.height);
        //CHECK TAB
        if(inventoryMenu.tab === 1){
            var weapon = weaponManager.weaponArrayP[inventoryMenu.selection];
            if(weapon){
                weapon.lvl = avatar.inventoryP[inventoryMenu.selection];
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
                weapon.lvl = avatar.inventoryP[inventoryMenu.selection];
                var btnTxt = "UPGRADE";
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
                    }
                }
                else{
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
                    }
                }
                //BTN TXT
                ctxTool.text(btnTxt, inventoryMenu.rectShopBtnTxt[0], inventoryMenu.rectShopBtnTxt[1],
                "center", sizeManager.fontSizeXS, ctxTool.clrRed);
            }
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

//DRAWING TOOLS
function CtxTool(){
    this.clrBlack = "#000000";
    this.clrGrey = "#4a4a4a";
    this.clrRed = "#9c1919";
    this.circle = function(x,y,r,clr){
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
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
}

//UI
function UI(){
    //GAME FUCNTION
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.fire = false;;
    
    //MOUSE / TOUCH TARGET
    this.targetX;
    this.targetY;
    
    //KEYBOARD
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
        }
    };
    
    //MOUSE
    this.mouseDown = function(){
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
        }
        
    };
    this.mouseUp = function(){
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
        canvas.addEventListener("keydown", function(event){
            ui.keyDown(event.keyCode);
        });
        canvas.addEventListener("keyup", function(event){
            ui.keyUp(event.keycode);
        });
        //MOUSE
        canvas.addEventListener("mousemove", function(event){
            ui.targetX = event.pageX - canvas.offsetLeft;
            ui.targetY = event.pageY - canvas.offsetTop;
            document.getElementById("mouseXY").textContent = ui.targetX + " " + ui.targetY;
        });
        canvas.addEventListener("mousedown", function(event){
            ui.mouseDown();
        });
        canvas.addEventListener("mouseup", function(event){
            ui.mouseUp();
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