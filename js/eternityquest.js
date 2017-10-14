/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 800;

var totalImgs = 2;  
var loadedImgs = 0; 
var resourcesLoaded = false;
var gameReady = false;

var loadingStartTime;
var loadingMsg = "* * * * *";
var loadingMsgArray = ["* * * * *", "Prismatic beams aligning", "Calibrating void lenses", "Prismatic core online"];
var currentMsg = 0;
//Phase crystals charged
//Peradak kural

var score = 0;

//BACKGROUND
var bg;

//AVATAR 
var avatarSprite;
var avatarWidth;
var avatarHeight;
var avatarX;
var avatarY;
var avatarMs; // movement speed in px relative to x/y

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

//UI EVENTS
var up = false;
var down = false;
var left = false;
var right = false;
var fire = false;

init();
// -- INIT -- //
function init(){
    loadingStartTime = Date.now();
    //INIT LOADING GRAPHICS
    draw();
    
    //INIT IMAGE RESOURCES
    avatarSprite = new Image();
    enemySprite = new Image();
    bg = new Image();
    var imgArray = [avatarSprite, enemySprite, bg];
    for(var i = 0 ; i < imgArray.length ; i++){
        imgArray[i].onload = function(){
            loadedImgs++;
            if(loadedImgs === imgArray.length){ resourcesLoaded = true; }
        };
    }
    avatarSprite.src = "img/eternityquest/avatar.png";
    enemySprite.src = "img/eternityquest/enemy.png";
    bg.src = "img/eternityquest/bg3.png";
    
    //INIT VARS
    resetValues();
    
    
    //FIRST DRAW
    //draw();
}

function resetValues(){
    varsLoaded = false;
    
    //AVATAR
    avatarWidth = 50;
    avatarHeight = 50;
    avatarX = (canvas.width/2) - (avatarWidth/2);
    avatarY = canvas.height - avatarHeight;
    avatarMs = 8;
    
    //PROJECTILE
    projectileArray = [];
    projectileRadius = 5;
    projectileClr = "red";
    projectileDmg = 5;
    projectiletMs = 10;
    lastProjectile = Date.now();
    projectileRate = 50;
    
    //ENEMY
    enemyWidth = 50;
    enemyHeight = 50;
    enemyHealth = 10;
    enemyArray = [];
    enemyDeathArray = [];
    lastSpawnTime = Date.now();
    spawnInterval = 500;
    
    varsLoaded = true;
}



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(!gameReady){
        loadingAnimation();
    }
    else{
        drawBg();
        drawAvatar();
        drawProjectiles();
        drawEnemys();
        animateEnemyDeath();
        drawScore();
    }
    
    requestAnimationFrame(draw);
}

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

function drawBg(){
    ctx.drawImage(bg, 0, 0);
}

function drawAvatar(){
    //BORDER COLLISION
    if(avatarY <= 0){ up = false; }
    if(avatarY >= canvas.height - avatarHeight){ down = false; }
    if(avatarX <= 0){ left = false; }
    if(avatarX >= canvas.width - avatarWidth){ right = false; }
    
    //POSITIONING
    if(up){ avatarY -= avatarMs; }
    if(down){ avatarY += avatarMs; }
    if(left){ avatarX -= avatarMs; }
    if(right){ avatarX += avatarMs; }
    /*
    ctx.beginPath();
    ctx.rect(avatarX, avatarY, avatarWidth, avatarHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    */
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
    
    for(var i = 0 ; i < enemyArray.length ; i++){
        var e = enemyArray[i];
        //BORDER COLLISION
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
                        score += 1;
                    }
                }
            }
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

function drawScore(){
    ctx.font = "16px Arial";
    ctx.textAlign = "start";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

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