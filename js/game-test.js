/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

var score = 0;
var lives = 3;

var ballRadius = 10;

var x = canvas.width/2;
var y = canvas.height/2;

var dx = 3;
var dy = -3;


var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;


var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


//UI
var rightDown = false;
var leftDown = false;

draw();

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    
    //BALL COLLISION DETECTION
    if(x > canvas.width - ballRadius || x < 0 + ballRadius){
        dx = -dx;
    }
    if(y < 0 + ballRadius){
        dy = -dy;
    }
    else if(y > canvas.height - ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else{
            lives--;
            if(!lives){
                //alert("GAME OVER");
                //document.location.reload();
            }
            else{
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
        
    }
    
    //PADDLE MOVEMENT
    if(rightDown && paddleX < canvas.width-paddleWidth) {
        paddleX += 5;
    }
    else if(leftDown && paddleX > 0) {
        paddleX -= 5;
    }
    
    //BALL BRICK COLLISION DETECTION
    collisionDetection();
    
    x += dx;
    y += dy;
    
    requestAnimationFrame(draw);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

document.addEventListener("keydown", function(event){
    switch(event.keyCode)
    {
        case 39:
            rightDown = true;
            break;
        case 37:
            leftDown = true;
            break;
    }
});
document.addEventListener("keyup", function(event){
    switch(event.keyCode)
    {
        case 39:
            rightDown = false;
            break;
        case 37:
            leftDown = false;
            break;
    }
});

document.addEventListener("mousemove", function(event){
    var relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
});
