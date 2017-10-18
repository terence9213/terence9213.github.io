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

var score = 0;
var lvl = 1;
var nextLvlScore = 50;
var nextLvlInterval = 50;
var gameState = 0;

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

var avatarDeathDuration;
var avatarDeathStart;
//AVATAR 
var avatarSprite;
var avatarWidth;
var avatarHeight;
var avatarX;
var avatarY;
var avatarMs; // movement speed in px relative to x/y
var avatarMsX;
var avatarMsY;
var avatarHealth;

//PROJECTILE
var projectileArray;
var projectileRadius;
var projectileClr;
var projectileDmg;
var projectiletMs;
var lastProjectile;
var projectileRate; // in ms
//PROJECTILE OBJ
function Projectile(){
    this.x = avatarX + avatarWidth/2;
    this.y = avatarY + avatarHeight/2;
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
    
    var imgArray = [avatarSprite, enemySprite, transitionBg, menuBg, bg, 
                    mouseIcon, keyboardIcon, soundIcon, muteIcon,
                    explosionSprite1, explosionSprite2, explosionSprite3];
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
    
    
    //INIT VARS
    resetValues();
    
    //EVENT LISTENERS
    addEventListeners();
    
    //FIRST DRAW
    //draw();
}

function resetValues(){
    varsLoaded = false;
    
    avatarDeathDuration = 1000;
    //AVATAR
    avatarWidth = 50;
    avatarHeight = 50;
    avatarX = (canvas.width/2) - (avatarWidth/2);
    avatarY = canvas.height - 70;
    avatarMs = 8;
    avatarMsX = 8;
    avatarMsY = 8;
    avatarHealth = 1;
    
    //PROJECTILE
    projectileArray = [];
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
    drawProjectiles();
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

function drawProjectiles(){
    if(fire && Date.now() >= lastProjectile + projectileRate){
        projectileArray.push(new Projectile());
        lastProjectile = Date.now();
    }
    
    for(var i = 0 ; i < projectileArray.length ; i++){
        var p = projectileArray[i];
        //BORDER COLLISION
        if(p.y <= 0){
            projectileArray.splice(i,1);
        }
        //POSITIONING
        p.y -= projectiletMs;
        //RENDER
        ctx.beginPath();
        ctx.arc(p.x, p.y, projectileRadius, 0, Math.PI*2, false);
        ctx.fillStyle = projectileClr;
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
            for(var j = 0 ; j < projectileArray.length ; j++){
                var p = projectileArray[j];
                if(p.x > e.x && p.x < e.x + e.width && p.y > e.y && p.y < e.y + e.height){
                    e.health -= projectileDmg;
                    projectileArray.splice(j,1);
                    if(e.health <= 0){
                        enemyDeathArray.push(enemyArray.splice(i,1)[0]);
                        explosionArray.push(new Explosion(e.x, e.y));
                        score += 1;
                    }
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
                    console.log("CLICKED");
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