/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 800;

var score = 0;

//AVATAR 
var avatarX = canvas.width/2;
var avatarY = canvas.height/2;
var avatarWidth = 20;
var avatarHeight = 20;
var avatarMs = 8; // movement speed in x/y

//PROJECTILE
var projectileArray = [];
var projectileRadius = 5;
var projectileClr = "red";
var projectileDmg = 50;
var projectiletMs = 10;
var lastProjectile = Date.now();
var projectileRate = 50; // in ms
//PROJECTILE OBJ
function Projectile(){
    this.x = avatarX + avatarWidth/2;
    this.y = avatarY + avatarHeight/2;
}

//ENEMY
var enemyArray = [];
var enemyDeathArray = [];
var lastSpawnTime = Date.now();
var spawnInterval = 2000; //in ms
var maxHealth = 1000;
var minHealth = 500;
var enemyColour = "rgba(200, 200, 50, 1)";
//ENEMY OBJ
function Enemy(x, y, width, height, colour, health, ms){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.health = health;
    this.ms = ms;
    this.rgba = [200, 200, 50, 1];
}

//UI EVENTS
var up = false;
var down = false;
var left = false;
var right = false;
var fire = false;

draw();
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawAvatar();
    drawProjectiles();
    drawEnemys();
    animateEnemyDeath();
    drawScore();
    
    requestAnimationFrame(draw);
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
    
    ctx.beginPath();
    ctx.rect(avatarX, avatarY, avatarWidth, avatarHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
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
        var x = Math.floor(Math.random() *canvas.width);
        var health = Math.floor(Math.random() * (maxHealth - minHealth) + minHealth);
        var width = health / 10;
        var height = Math.floor(width * 0.8);
        enemyArray.push(new Enemy(x, 0, width, height, enemyColour, health, 5));
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
        ctx.beginPath();
        ctx.rect(e.x, e.y, e.width, e.height);
        ctx.fillStyle = e.colour;
        ctx.fill();
        ctx.closePath();
    }
    
}

function animateEnemyDeath(){
    if(enemyDeathArray.length > 0){
        for(var i = 0 ; i < enemyDeathArray.length ; i++){
            var e = enemyDeathArray[i];
            //var a = e.rgba[3];
            if(e.rgba[3] > 0){
                e.rgba[3] -= 0.02;
            }
            else if(e.rgba[3] <= 0){
                enemyDeathArray.splice(i,1);
            }
            ctx.beginPath();
            ctx.rect(e.x, e.y, e.width, e.height);
            ctx.fillStyle = "rgba(" + e.rgba[0] + "," + e.rgba[1] + "," + e.rgba[2] + "," + e.rgba[3] + ")";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

//UI EVENT LISTENERS
// up:38 down:40 left:37 right:39
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