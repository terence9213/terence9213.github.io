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
        this.inventory = avatar.inventory.join("");
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
    this.loadout = [];
    this.inventory = [];
    this.inventoryS = [];
    
    this.cycleWeapons = function(){
        if(activeWeaponIndex < inventory.length){
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
        this.inventory = profile.inventory.split("").map(Number);
        this.inventoryS = profile.inventoryS.split("").map(Number);
    };
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
        if(ui.targetCollision(null, null, null, null, this.rect1)){ this.selectedProfile = 0; }
        if(ui.targetCollision(null, null, null, null, this.rect2)){ this.selectedProfile = 1; }
        if(ui.targetCollision(null, null, null, null, this.rect3)){ this.selectedProfile = 2; }
        if(ui.targetCollision(null, null, null, null, this.rect1X) || 
           ui.targetCollision(null, null, null, null, this.rect2X) || 
           ui.targetCollision(null, null, null, null, this.rect3X) ){ this.deleteProfile(); }
        if(ui.targetCollision(null, null, null, null, this.rectLoadBtn)){ this.loadProfile(); }
        
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
    if(ui.targetCollision(null, null, null, null, profileMenu.rect1) ||
           ui.targetCollision(null, null, null, null, profileMenu.rect2)||
           ui.targetCollision(null, null, null, null, profileMenu.rect3) ||
           ui.targetCollision(null, null, null, null, profileMenu.rectLoadBtn)){
       canvas.style.cursor = "pointer";
       ctx.lineWidth = 2;
       ctx.strokeStyle = "red";
       if(ui.targetCollision(null, null, null, null, profileMenu.rect1X)){
            ctx.strokeRect(profileMenu.rect1X[0], profileMenu.rect1X[1], profileMenu.rect1X[2], profileMenu.rect1X[3]);
        }
       if(ui.targetCollision(null, null, null, null, profileMenu.rect2X)){
            ctx.strokeRect(profileMenu.rect2X[0], profileMenu.rect2X[1], profileMenu.rect2X[2], profileMenu.rect2X[3]);
        }
       if(ui.targetCollision(null, null, null, null, profileMenu.rect3X)){
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
        if(ui.targetCollision(null, null, null, null, mainMenu.rectSettingsBtn)){
            gameManager.changeGameState(4);
        }
    };
}
//MAIN MENU ANIMATION
function drawMainMenu(){
    ctx.drawImage(mainMenu.bg, 0, 0, canvas.width, canvas.height);
    //CHECK MOUSE TARGET COLLISIONS
    if(ui.targetCollision(null, null, null, null, mainMenu.rectSettingsBtn) || 
       ui.targetCollision(null, null, null, null, mainMenu.rectPlayBtn) ||
       ui.targetCollision(null, null, null, null, mainMenu.rectInventoryBtn) ){
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
        if(ui.targetCollision(null, null, null, null, settingsMenu.rectMusicSwitch)){ settings.toggleMusic(); }
        if(ui.targetCollision(null, null, null, null, settingsMenu.rectFxSwitch)){ settings.toggleFx(); }
        if(ui.targetCollision(null, null, null, null, settingsMenu.rectCtrlSwitch)){ settings.toggleMouseControl(); }
        if(ui.targetCollision(null, null, null, null, settingsMenu.rectBackBtn)){
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
    if(ui.targetCollision(null, null, null, null, settingsMenu.rectMusicSwitch) || 
       ui.targetCollision(null, null, null, null, settingsMenu.rectFxSwitch) ||
       ui.targetCollision(null, null, null, null, settingsMenu.rectCtrlSwitch) ||
       ui.targetCollision(null, null, null, null, settingsMenu.rectBackBtn) ){
        canvas.style.cursor = "pointer";
    }
    else{ canvas.style.cursor = "default"; }
}

//DRAWING TOOLS
function CtxTool(){
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
                break;
        }
    };
    
    //TOUCH
    this.touchScreen = false;
    
    //CHECK FOR TARGET
    this.targetCollision = function(objX, objY, objW, objH, array){
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