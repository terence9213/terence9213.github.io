/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 800;

var loadedImgs = 0; 
var resourcesLoaded = false;
var gameReady = false;

var loadingStartTime;
var loadingMsg = "* * * * *";
var loadingMsgArray = ["* * * * *", "Prismatic beams aligning", "Calibrating void lenses", "Phase crystals charged"];
var currentMsg = 0;
//Phase crystals charged
//Prismatic core online
//Peradak kural

var score;
var lvl;
var nextLvlScore = 50;
var nextLvlInterval = 50;
var gameState = 0;

//ASSETS OBJ
var assetManager = new AssetManager();
function AssetManager(){
    this.loaded = false;
    this.assetArray = [];
    this.assetSrcArray = [];
    this.assetsLoaded = 0;
    this.loadAll = function(){
        for(var i = 0 ; i < this.assetArray.length ; i++){
            assetArray[i].onload = function(){
                this.assetsLoaded++;
                if(assetsLoaded >= assetArray.length){
                    this.loaded = true;
                }
            };
            this.assetArray[i].src = this.assetScrArray[i];
        }
    };
}

//TRANSITION
var transitionAlpha = 0;
var transitionBg;

//MENU BACKGROUND
var menuBg;
var mouseIcon;
var keyboardIcon;
var soundIcon;
var muteIcon;

//BACKGROUND
var bg;

//AVATAR 
var avatar;
function Avatar(){
    this.sprite;
    this.width;
    this.height;
    this.x;
    this.y;
    this.ms; // movement speed in px relative to x/y
    this.msX;
    this.msY;
    this.health;
    
    this.deathDuration;
    this.deathStartTime;
    
    this.activeWeaponIndex;
    this.inventory = [];
    this.cycleWeapons = function(){
        if(activeWeaponIndex < inventory.length){
            activeWeaponIndex++;
        }
        else{
            activeWeaponIndex = 0;
        }
    };
    this.getActiveWeapon = function(){
        return inventory[activeWeaponIndex];
    };
}

//WEAPON
var activeWeapon;
var inventory;
var weaponArray;
//WEAPON TYPES : 
//1:basic 2:sp 3:beam
//WEAPON OBJ
function Weapon(name, type){
    this.name = name;
    this.type = type;
    this.lvl = 0;
}
//BASIC WEAPON
function BasicWeapon(name, type, dmgArray, rateArray, ms, barrelCount, clr){
    Weapon.call(this, name, type);
    this.dmgArray = dmgArray;
    this.rateArray = rateArray;
    this.projectileMs = ms;
    this.barrelCount = barrelCount;
    this.projectileClr = clr;
    this.dmg = function(){return this.dmgArray[this.lvl];};
    this.rate = function(){return this.rateArray[this.lvl];};
}
BasicWeapon.prototype = Object.create(Weapon.prototype);
BasicWeapon.prototype.constructor = Weapon;
//SP WEAPON
function SpWeapon(name, type, dmgArray, rateArray, ms, barrelCount, sprite, width, height){
    BasicWeapon.call(this, name, type, dmgArray, rateArray, ms, barrelCount, null);
    this.projectileSprite = sprite;
    this.projectileWidth = width;
    this.projectileHeight = height;
}
SpWeapon.prototype = Object.create(BasicWeapon.prototype);
SpWeapon.prototype.constructor = BasicWeapon;
//BEAM WEAPON
function BeamWeapon(name, type, dmg, tickInterval, clr){
    Weapon.call(this, name, type);
    this.tickDmg = dmg;
    this.tickInterval = tickInterval;
    this.clr = clr;
    this.lastTickTime;
    this.tick = false;
    this.beamOrigin;
}

//WEAPON PROJECTILE SPRITES
var projectileFireballSprite;

//PROJECTILE
var projectileArray;
var spProjectileArray;
var projectileRadius;
var projectileClr;
var projectileDmg;
var projectiletMs;
var lastProjectile;
var projectileRate; // in ms
//PROJECTILE OBJ
function Projectile(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.actualX = x + (50-width)/2;
}

//ENEMY
var enemySprite;
var enemyWidth;
var enemyHeight;
var enemyHealth;
var enemyArray;
var enemyDeathArray;
var lastSpawnTime;
var spawnInterval; //in ms
//ENEMY MANAGER
function EnemyManager(){
    this.sprite;
}

//ENEMY OBJ
function Enemy(x, y, width, height, health, ms){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.a = 1;
    this.health = health;
    this.ms = ms;
}

//DROPS
var dropManager = new DropManager();
//DROP MANAGER OBJ
function DropManager(){
    this.dropBoxSprite;
    this.dropArray;
    this.dropInterval;
    this.lastDropTime;
    this.triggerDrop = function(){
        if(Date.now() < this.lastDropTime + this.dropInterval){
            this.drop();
        }
    };
    this.drop = function(){
        dropArray.push(new Drop());
    };
}
//DROP OBJ
function Drop(){
    this.x;
    this.y;
    this.dropMs = 8;
    this.item;
}

//EXPLOSION EFFECT
var explosionSprite1;
var explosionSprite2;
var explosionSprite3;
var explosionWidth;
var explosionHeight;
var explosionFrameDuration;
var explosionSpriteArray;
var explosionArray;
//EXPLOSION OBJECT
function Explosion(x, y){
    this.x = x;
    this.y = y;
    this.state = 0;
    this.explosionFrameStartTime = Date.now();
    this.complete = false;
}

//UI EVENTS
var up;
var down;
var left;
var right;
var fire;

//MOUSE
var mouseControl = false;
var mouseX;
var mouseY;
var avatarTargetX;
var avatarTargetY;

//SOUND
var mute = false;

init();
// -- INIT -- //
function init(){
    loadingStartTime = Date.now();
    changeGameState(0);
    //INIT LOADING GRAPHICS
    draw();
    
    //INIT MANAGERS/OBJS
    avatar = new Avatar();
    
    
    //LOAD ASSETS
    var assetArray = [avatar.sprite, enemySprite, transitionBg, menuBg, bg, 
                    mouseIcon, keyboardIcon, soundIcon, muteIcon,
                    explosionSprite1, explosionSprite2, explosionSprite3,
                    projectileFireballSprite, dropManager.dropBoxSprite];
    var assetSrcArray = 
        [
            "img/eternityquest/avatar.png",
            "img/eternityquest/enemy.png",
            "img/eternityquest/bg-transition.png",
            "img/eternityquest/menu-bg.png",
            "img/eternityquest/bg3.png",
            "img/eternityquest/mouse-icon.png",
            "img/eternityquest/keyboard-icon.png",
            "img/eternityquest/sound-icon.png",
            "img/eternityquest/mute-icon.png",
            "img/eternityquest/explosion0.png",
            "img/eternityquest/explosion1.png",
            "img/eternityquest/explosion2.png",
            "img/eternityquest/fireball.png",
            "img/eternityquest/cube.png"
        ];
    assetManager = new AssetManager();
    assetManager.loadAll();
    
    //INIT IMAGE RESOURCES
    avatarSprite = new Image();
    enemySprite = new Image();
    transitionBg = new Image();
    menuBg = new Image();
    bg = new Image();
    mouseIcon = new Image();
    keyboardIcon = new Image();
    soundIcon = new Image();
    muteIcon = new Image();
    explosionSprite1 = new Image();
    explosionSprite2 = new Image();
    explosionSprite3 = new Image();
    projectileFireballSprite = new Image();
    dropManager.dropBoxSprite = new Image();
    
    var imgArray = [avatarSprite, enemySprite, transitionBg, menuBg, bg, 
                    mouseIcon, keyboardIcon, soundIcon, muteIcon,
                    explosionSprite1, explosionSprite2, explosionSprite3,
                    projectileFireballSprite, dropManager.dropBoxSprite];
    for(var i = 0 ; i < imgArray.length ; i++){
        imgArray[i].onload = function(){
            loadedImgs++;
            if(loadedImgs === imgArray.length){ resourcesLoaded = true; }
        };
    }
    avatarSprite.src = "img/eternityquest/avatar.png";
    enemySprite.src = "img/eternityquest/enemy.png";
    transitionBg.src = "img/eternityquest/bg-transition.png";
    menuBg.src = "img/eternityquest/menu-bg.png";
    bg.src = "img/eternityquest/bg3.png";
    mouseIcon.src = "img/eternityquest/mouse-icon.png";
    keyboardIcon.src = "img/eternityquest/keyboard-icon.png";
    soundIcon.src = "img/eternityquest/sound-icon.png";
    muteIcon.src = "img/eternityquest/mute-icon.png";
    explosionSprite1.src = "img/eternityquest/explosion1.png";
    explosionSprite2.src = "img/eternityquest/explosion2.png";
    explosionSprite3.src = "img/eternityquest/explosion3.png";
    projectileFireballSprite.src = "img/eternityquest/fireball.png";
    dropManager.dropBoxSprite.src = "img/eternityquest/cube.png";
    
    //INIT WEAPONS
    initWeapons();
    
    //INIT VARS
    resetValues(); 
    
    //EVENT LISTENERS
    addEventListeners();
    
    //FIRST DRAW
    //draw();
}

function initWeapons(){
    weaponArray = 
    [
        new BasicWeapon("Blaster", "basic", 
                    [5, 10, 15, 20, 25, 30], 
                    [100, 90, 80, 70, 60, 50], 10, 1, "red"),
        new BasicWeapon("Triple Blaster", "basic", 
                    [5, 10, 15, 20, 25, 30], 
                    [100, 90, 80, 70, 60, 50], 10, 3, "blue"),
        new SpWeapon("Fireball", "sp", 
                    [25, 35, 50, 70, 90, 100], 
                    [200, 180, 150, 120, 80, 40], 8, null, projectileFireballSprite, 30, 50),
        new BeamWeapon("Laser", "beam", 5, 100, "red")
    ];
}

function resetValues(){
    varsLoaded = false;
    
    score = 0;
    lvl = 1;
    
    //AVATAR NEW
    avatar.width = 50;
    avatar.Height = 50;
    avatar.x = (canvas.width/2) - (avatar.width/2);
    avatar.y = canvas.height - 70;
    avatar.ms = 8;
    avatar.msX = 8;
    avatar.msY = 8;
    avatar.health = 1;
    avatar.deathDuration = 2000;
    
    //WEAPONS
    activeWeapon = weaponArray[3];
    inventory = [weaponArray[0], weaponArray[1], weaponArray[2], weaponArray[3]];
    
    //PROJECTILE
    projectileArray = [];
    spProjectileArray = [];
    projectileRadius = 5;
    projectileClr = "red";
    projectileDmg = 5;
    projectiletMs = 10;
    lastProjectile = Date.now();
    projectileRate = 100;
    
    //ENEMY
    enemyWidth = 50;
    enemyHeight = 50;
    enemyHealth = 10;
    enemyArray = [];
    enemyDeathArray = [];
    lastSpawnTime = Date.now();
    spawnInterval = 1000;
    
    //EXPLOSION
    explosionWidth = 50;
    explosionHeight = 50;
    explosionFrameDuration = 100;
    explosionState = 0;
    explosionSpriteArray = [explosionSprite1, explosionSprite2, explosionSprite3];
    explosionArray = [];
    
    up = false;
    down = false;
    left = false;
    right = false;
    fire = false;
    
    varsLoaded = true;
}

function nextLvl(){
    enemyHealth += 5;
    spawnInterval -= 100;
}

function toggleMouseControl(){
    mouseControl = !mouseControl;
    avatarMsX = avatarMs;
    avatarMsY = avatarMs;
}

function toggleMute(){
    mute = !mute;
}

function changeGameState(targetGameState){
    switch(targetGameState){
        case 0:
            gameState = 0;
            canvas.style.cursor = "wait";
            break;
        case 1:
            gameState = 1;
            canvas.style.cursor = "default";
            break;
        case 2:
            gameState = 2;
            canvas.style.cursor = "crosshair";
            break;
        case 3:
            gameState = 3;
            canvas.style.cursor = "none";
            break;
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(!gameReady){
        loadingAnimation();
    }
    else{
        switch(gameState){
            case 0:
                drawTransition();
                break;
            case 1:
                drawMenu();
                break;
            case 2:
                drawGame();
                break;
            case 3:
                drawAvatarDeath();
                break;
        }
        
    }
    if(score >= nextLvlScore){
        lvl++;
        nextLvlScore += nextLvlInterval;
        nextLvl();
    }
    
    requestAnimationFrame(draw);
}

//LOADING SCREEN
function loadingAnimation(){
    if(Date.now() - loadingStartTime > 1000){
        loadingStartTime = Date.now();
        if(currentMsg < 3){ currentMsg++; }
        else{ currentMsg = 0; }
        loadingMsg = loadingMsgArray[currentMsg];
    }
    ctx.font = "60px Courier";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("LOADING", canvas.width/2, canvas.height/2);
    ctx.font = "35px Courier";
    ctx.fillText(loadingMsg, canvas.width/2, canvas.height/2 + 50);
    gameReady = resourcesLoaded;
}

//TRANSITION ANIMATION
//gameState: 0
function drawTransition(){
    ctx.globalAlpha = transitionAlpha;
    ctx.drawImage(transitionBg, 0, 0);
    if(transitionAlpha < 1){
        transitionAlpha += 0.02;
    }
    else{
        ctx.globalAlpha = 1;
        changeGameState(1);
        transitionAlpha = 0;
    }
    
}

//MENU ANIMATION
//gameState: 1
function drawMenu(){
    ctx.drawImage(menuBg, 0, 0);
    if((mouseX > 200 && mouseX < 400 && mouseY > 655 && mouseY < 745) || 
       (mouseX > 425 && mouseX < 575 && mouseY > 655 && mouseY < 745) ||
       ((mouseX > 25 && mouseX < 175 && mouseY > 655 && mouseY < 745))){
        canvas.style.cursor = "pointer";
    }
    else{
        canvas.style.cursor = "default";
    }
    
    if(mouseControl){
        ctx.drawImage(mouseIcon, 475, 675);
    }
    else{
        ctx.drawImage(keyboardIcon, 475, 675);
    }
    
    if(mute){
        ctx.drawImage(muteIcon, 75, 675);
    }
    else{
        ctx.drawImage(soundIcon, 75, 675);
    }
    
}

//MAIN GAME ANIMATIONS
//gameState: 2
function drawGame(){
    drawBg();
    drawAvatar();
    drawTriggerWeapon();
    drawEnemys();
    animateEnemyDeath();
    animateExplosions();
    drawScore();
    drawLvl();
    if(avatarHealth <= 0){
        avatarDeathStart = Date.now();
        explosionFrameStartTime = Date.now();
        changeGameState(3);
    }
}

//AVATAR DEATH ANIMATION
//gameState: 3;
function drawAvatarDeath(){
    if(Date.now() < avatarDeathStart + avatarDeathDuration){
        drawBg();
        drawDeadAvatar();
        animateExplosions();
        drawDeathMessage();
    }
    else{
        resetValues();
        changeGameState(0);
    }
    
}


function drawBg(){
    ctx.drawImage(bg, 0, 0);
}

function drawAvatar(){
    //POSITIONING
    if(mouseControl){
        //MOUSE POSITION
        if(avatarTargetY < avatarY){ up    = true; } else { up    = false; }
        if(avatarTargetY > avatarY){ down  = true; } else { down  = false; }
        if(avatarTargetX < avatarX){ left  = true; } else { left  = false; }
        if(avatarTargetX > avatarX){ right = true; } else { right = false; }
        var distX = Math.abs(avatarTargetX - avatarX);
        var distY = Math.abs(avatarTargetY - avatarY);
        //DOUBLE AXIS MOVEMENT
        if( distX > distY ){
            avatarMsX = avatarMs;
            avatarMsY = distY / (distX/avatarMs);
        }
        else if(distY > distX){
            avatarMsX = distX / (distY/avatarMs);
            avatarMsY = avatarMs;
        }
        else{
            avatarMsX = avatarMs;
            avatarMsY = avatarMs;
        }
        
        //APPROACH POSITION
        if(distX < 10){
            avatarMsX = 1;
        }
        if(distY < 10){
            avatarMsY = 1;
        }
        
    }
    //BORDER COLLISION
    if(avatarY <= 0){ up = false; }
    if(avatarY >= canvas.height - avatarHeight){ down = false; }
    if(avatarX <= 0){ left = false; }
    if(avatarX >= canvas.width - avatarWidth){ right = false; }
    
    //FINAL POSITION
    if(up){ avatarY -= avatarMsY; }
    if(down){ avatarY += avatarMsY; }
    if(left){ avatarX -= avatarMsX; }
    if(right){ avatarX += avatarMsX; }
    
    ctx.drawImage(avatarSprite, avatarX, avatarY, avatarWidth, avatarHeight);
    
}

function drawDeadAvatar(){
    ctx.drawImage(avatarSprite, avatarX, avatarY, avatarWidth, avatarHeight);
}

function drawTriggerWeapon(){
    switch(activeWeapon.type){
        case "basic":
            if(fire && Date.now() >= lastProjectile + activeWeapon.rate()){
                if(activeWeapon.barrelCount === 1){
                    projectileArray.push(new Projectile(avatarX + avatarWidth/2, avatarY + avatarHeight/2));
                    lastProjectile = Date.now();
                }
                else{
                    projectileArray.push(new Projectile(avatarX + 10, avatarY + avatarHeight/2));
                    projectileArray.push(new Projectile(avatarX + 25, avatarY + avatarHeight/2 - 5));
                    projectileArray.push(new Projectile(avatarX + 40, avatarY + avatarHeight/2));
                    lastProjectile = Date.now();
                }
            }
            break;
        case "sp":
            if(fire && Date.now() >= lastProjectile + activeWeapon.rate()){
                spProjectileArray.push(new Projectile(avatarX, avatarY, activeWeapon.projectileWidth, activeWeapon.projectileHeight));
                lastProjectile = Date.now();
            }
            break;
        case "beam":
            if(fire){
                activeWeapon.beamOrigin = [avatarX + avatarWidth/2, avatarY + avatarHeight/2];
            }
            else{
                activeWeapon.beamOrigin = null;
            }
            break;
    }
    drawBasicProjectiles();
    drawSpProjectiles();
    drawBeam();
}

function drawBasicProjectiles(){
    for(var i = 0 ; i < projectileArray.length ; i++){
        var p = projectileArray[i];
        //BORDER COLLISION
        if(p.y <= 0){
            projectileArray.splice(i,1);
        }
        //POSITIONING
        p.y -= activeWeapon.projectileMs;
        //RENDER
        ctx.beginPath();
        ctx.arc(p.x, p.y, projectileRadius, 0, Math.PI*2, false);
        ctx.fillStyle = activeWeapon.projectileClr;
        ctx.fill();
        ctx.closePath();
    }
}

function drawSpProjectiles(){
    for(var i = 0 ; i < spProjectileArray.length ; i++){
        var p = spProjectileArray[i];
;        //BORDER COLLISION
        if(p.y <= 0){
            spProjectileArray.splice(i,1);
        }
        //POSITIONING
        p.y -= activeWeapon.projectileMs;
        //RENDER
        ctx.drawImage(activeWeapon.projectileSprite, p.x, p.y, 50, 50);
    }
}

function drawBeam(){
    if(activeWeapon.beamOrigin){
        ctx.beginPath();
        if(Date.now() < activeWeapon.lastTickTime + activeWeapon.tickInterval){
            ctx.rect(activeWeapon.beamOrigin[0], 0, 1, activeWeapon.beamOrigin[1]);
            activeWeapon.tick = false;
        }
        else{
            ctx.rect(activeWeapon.beamOrigin[0] - 1, 0, 3, activeWeapon.beamOrigin[1]);
            activeWeapon.tick = true;
            activeWeapon.lastTickTime = Date.now();
        }
        ctx.fillStyle = activeWeapon.clr;
        ctx.fill();
        ctx.closePath();
    }
}

function drawEnemys(){ //Yes I know
    //Generate random enemy randomly
    if(Date.now() >= lastSpawnTime + spawnInterval){
        //SPAWN
        var x = Math.floor(Math.random() *(canvas.width - enemyWidth));
        enemyArray.push(new Enemy(x, 0, enemyWidth, enemyHeight, enemyHealth, 5));
        lastSpawnTime = Date.now();
    }
    
    //Iterate enemyArray
    for(var i = 0 ; i < enemyArray.length ; i++){
        var e = enemyArray[i];
        //BORDER COLLISION (exit canvas bottom)
        if(e.y >= canvas.height){
            enemyArray.splice(i,1);
        }
        //PROJECTILE COLLISIONS
        else{
            //BASIC PROJECTILES
            for(var j = 0 ; j < projectileArray.length ; j++){
                var p = projectileArray[j];
                if(p.x > e.x && p.x < e.x + e.width && p.y > e.y && p.y < e.y + e.height){
                    e.health -= activeWeapon.dmg();
                    projectileArray.splice(j,1);
                    if(e.health <= 0){
                        enemyDeathArray.push(enemyArray.splice(i,1)[0]);
                        explosionArray.push(new Explosion(e.x, e.y));
                        score += 1;
                    }
                }
            }
            //SP PROJECTILES
            for(var k = 0 ; k < spProjectileArray.length ; k++){
                var p = spProjectileArray[k];
                if(p.actualX < e.x + e.width &&
                    p.actualX + p.width > e.x &&
                    p.y < e.y + e.height &&
                    p.y + p.height > e.y){
                    e.health -= activeWeapon.dmg();
                    spProjectileArray.splice(k,1);
                    if(e.health <= 0){
                        enemyDeathArray.push(enemyArray.splice(i,1)[0]);
                        explosionArray.push(new Explosion(e.x, e.y));
                        score += 1;
                    }
                }
            }
            //BEAM
            if(activeWeapon.beamOrigin && activeWeapon.tick && 
                    activeWeapon.beamOrigin[0] > e.x && activeWeapon.beamOrigin[0] < e.x + e.width){
                e.health -= activeWeapon.tickDmg;
                
                if(e.health <= 0){
                    enemyDeathArray.push(enemyArray.splice(i,1)[0]);
                    explosionArray.push(new Explosion(e.x, e.y));
                    score += 1;
                }
            }
            
            
        }
        //AVATAR COLLISION
        if(avatarX < e.x + e.width &&
            avatarX + avatarWidth > e.x &&
            avatarY < e.y + e.height &&
            avatarY + avatarHeight > e.y){
            enemyDeathArray.push(enemyArray.splice(i,1)[0]);
            explosionArray.push(new Explosion(avatarX, avatarY));
            avatarHealth -= 1;
        }
        //POSITIONING
        e.y += e.ms;
        //RENDER
        ctx.drawImage(enemySprite, e.x, e.y, e.width, e.height);
    }
    
}

function animateEnemyDeath(){
    if(enemyDeathArray.length > 0){
        for(var i = 0 ; i < enemyDeathArray.length ; i++){
            var e = enemyDeathArray[i];
            if(e){
                if(e.a > 0){
                    e.a -= 0.02;
                }
                else if(e.a <= 0){
                    enemyDeathArray.splice(i,1);
                }
                ctx.globalAlpha = e.a;
                if(e.a <= 0){ ctx.globalAlpha = 0; }
                ctx.drawImage(enemySprite, e.x, e.y, e.width, e.height);
                ctx.globalAlpha = 1;
                //ctx.restore();
            }
        }
    }
}

function animateExplosions(){
    if(explosionArray.length > 0){
        for(var i = 0 ; i < explosionArray.length ; i++){
            var e = explosionArray[i];
            if(!e.complete){
                if(Date.now() < e.explosionFrameStartTime + explosionFrameDuration){
                    ctx.drawImage(explosionSpriteArray[e.state], e.x, e.y, explosionWidth, explosionHeight);
                }
                else if(e.state < 2){
                    e.state++;
                    e.explosionFrameStartTime = Date.now();
                    ctx.drawImage(explosionSpriteArray[e.state], e.x, e.y, explosionWidth, explosionHeight);
                }
                else{
                    e.complete = true;
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.textAlign = "start";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLvl(){
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + lvl, canvas.width/2, 20);
}

function drawDeathMessage(){
    ctx.font = "65px Courier";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("YOU DIED", canvas.width/2, canvas.height/2);
    ctx.font = "50px Courier";
    ctx.fillText("Final Score : " + score, canvas.width/2, canvas.height - 300);
}


function addEventListeners(){
    //UI EVENT LISTENERS
    // up:38 down:40 left:37 right:39 z:90
    document.addEventListener("keydown", function(event){
        //event.preventDefault();
        switch(event.keyCode){
            case 38:
                up = true;
                break;
            case 40:
                down = true;
                break;
            case 37:
                left = true;
                break;
            case 39:
                right = true;
                break;
            case 90:
                fire = true;
                break;
        }
    });

    document.addEventListener("keyup", function(event){
        //event.preventDefault();
        //console.log(event.keyCode);
        switch(event.keyCode){
            case 38:
                up = false;
                break;
            case 40:
                down = false;
                break;
            case 37:
                left = false;
                break;
            case 39:
                right = false;
                break;
            case 90:
                fire = false;
                break;
        }
    });
    
    //MOUSE
    //Mouse POS
    document.addEventListener("mousemove", function(event){
        //mouseX = event.clientX - canvas.offsetLeft;
        //mouseY = event.clientY - canvas.offsetTop;
        mouseX = event.pageX - canvas.offsetLeft;
        mouseY = event.pageY - canvas.offsetTop;
        mouseXYDisplay.textContent = "X: " + mouseX + " Y: " + mouseY;
        if(gameState === 2){
            avatarTargetX = mouseX - avatarWidth/2;
            avatarTargetY = mouseY - avatarHeight/2;
        }
    });
    //Mouse DOWN
    document.addEventListener("mousedown", function(event){
        switch(gameState){
            case 1:
                //MENU
                //Do nothing (action on mouse up only)
                //console.log(event);
                break;
            case 2:
                //GAME
                fire = true;
                break;
        }
    });
    //Mouse UP
    document.addEventListener("mouseup", function(event){
        switch(gameState){
            case 1:
                //MENU
                //playbutton center (300,700)
                // width: 200 || height: 90
                if(mouseX > 200 && mouseX < 400 && mouseY > 655 && mouseY < 745){
                    changeGameState(2);
                }
                if(mouseX > 425 && mouseX < 575 && mouseY > 655 && mouseY < 745){
                    toggleMouseControl();
                }
                if(mouseX > 25 && mouseX < 175 && mouseY > 655 && mouseY < 745){
                    toggleMute();
                }
                break;
            case 2:
                //GAME
                fire = false;
                break;
        }
    });
}

//REMOVE AFTER DEBUG FOR RELEASE
var mouseXYDisplay = document.getElementById("mouseXY");