/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//https://code.tutsplus.com/tutorials/the-web-audio-api-make-your-own-web-synthesizer--cms-23887

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API


// Create web audio api context
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

// -- Create nodes -- //
 
// Create Oscillator and gain node
//var oscillator = audioCtx.createOscillator();
var masterGain = audioCtx.createGain();

//create analyser and connect master gain to analyser
var analyser = audioCtx.createAnalyser();
masterGain.connect(analyser);

var initComplete = false;
var mute = true;

var notemap = null;
var keycodemap = null;

var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");
var bufferLength = null;
var dataArray = null;

//INIT HERE
init();

// INIT SYNTH
//Move init statement here!
function init(){
    console.log("INIT ---");
    masterGain.gain.value = 0.5;
    
    // Retrieve Notemap
    $.getJSON("keycodenotemap.json", function(data){
        parseNotemap(data);
        
        if(notemap && keycodemap)   
        { initComplete = true; initAnalyser();}
        else 
        { console.log("-- notemap null --"); }
        
        toggleMute();
        console.log("initComplete:" + initComplete);
    });
}

// INIT ANALYSER OSCILLOSCOPE
function initAnalyser(){
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    var sliceWidth = canvas.width / bufferLength;
    
    canvasCtx.fillStyle = "rgb(0,0,0)";
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0,255,0)";
    var draw = function(){
        requestAnimationFrame(draw);
        
        //Get data from analyser
        analyser.getByteTimeDomainData(dataArray);
        
        canvasCtx.clearRect(0,0, canvas.width, canvas.height);
        canvasCtx.fillRect(0,0, canvas.width, canvas.height);
        canvasCtx.beginPath();
        
        //first point
        var x = 0;
        var y = (dataArray[0]/128) * (canvas.height/2);
        canvasCtx.moveTo(x, y);
        //draw wave
        for( i = 1 ; i < bufferLength ; i++){
            x += sliceWidth;
            y = (dataArray[i]/128) * (canvas.height/2);
            canvasCtx.lineTo(x, y);
            
        }
        //last point
        canvasCtx.lineTo(canvas.width, canvas.height);
        canvasCtx.stroke();
        
    };
    draw();
    
    
}

function parseNotemap(JSONData){
    console.log(JSONData);
    notemap = new Map();
    keycodemap = new Map();
    $.each(JSONData, function(i,obj){
        notemap.set(obj.note, obj.frequency);
        keycodemap.set(obj.keycode, obj.frequency);
    });
}

function setVolume(vol){
    masterGain.gain.value = vol;
}

function toggleMute(){
    if(mute){
        masterGain.connect(audioCtx.destination);
        mute = false;
    }
    else{
        masterGain.disconnect(audioCtx.destination);
        mute = true;
    }
    
}

//WAVEFROM
var oscWaveType = "sine"; //default

//ADSR 
var attack = 0.2; //seconds
var decay = 0.3; //seconds
var sustain = 0.8; //amplitude
var release = 0.3; //seconds

//https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-midi-envelope-generator/


// SYNTH INPUT
//SYNTH DOWN
function synthDown(freq){
    if(!oscNodeMap.has(freq)){
        var startTime = audioCtx.currentTime;
        var osc = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        osc.type = oscWaveType;
        osc.frequency.value = freq;
        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.start(0);
        oscNodeMap.set(freq, [osc,gainNode]);

        //ADSR Evnelope
        gainNode.gain.cancelScheduledValues(0);
        gainNode.gain.setValueAtTime(0, startTime);
        //Attack
        gainNode.gain.linearRampToValueAtTime(1, startTime + attack);
        //Decay to Sustain
        gainNode.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
    }
    
};
//SYNTH UP
function synthUp(freq){
    var oscGainPair = oscNodeMap.get(freq);
    if(oscGainPair){
        var osc = oscGainPair[0];
        var gainNode = oscGainPair[1];
        var startTime = audioCtx.currentTime;
        //ADSR Evelope
        gainNode.gain.cancelScheduledValues(0);
        gainNode.gain.setValueAtTime(gainNode.gain.value, startTime);
        gainNode.gain.linearRampToValueAtTime(0, startTime + release);

        osc.stop(startTime + release);
        /*osc.stop(0);
        osc.disconnect();
        gainNode.disconnect();*/
        oscNodeMap.delete(freq);
        //console.log(oscNodeMap);
    }
};


//KEYBOARD INPUT
var oscNodeMap = new Map();

document.addEventListener("keydown", function(event){
    //console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
    if(freq){synthDown(freq);};
});

document.addEventListener("keyup", function(event){
    //console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
    synthUp(freq);
});


// MOUSE - KEYBOARD INPUT
var mouseDown = false;
document.getElementById("keyboard").addEventListener("mousedown", function(event){
    event.preventDefault();
    mouseDown = true;
    if(event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthDown(freq);    
    }
        
});
document.getElementById("keyboard").addEventListener("mouseover", function(event){
    event.preventDefault();
    if(mouseDown && event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthDown(freq);
    }
});
document.getElementById("keyboard").addEventListener("mouseup", function(event){
    event.preventDefault();
    mouseDown = false;
    if(event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthUp(freq);
    }
    var freq = notemap.get(event.target.id);
    synthUp(freq);
});
document.getElementById("keyboard").addEventListener("mouseout", function(event){
    event.preventDefault();
    if(mouseDown && event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthUp(freq);
    }
});

// TOUCH - TOUCH SCREEN INPUT
document.getElementById("keyboard").addEventListener("touchstart", function(event){
    event.preventDefault();
    console.log("start " + event.target.id);
    if(event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthDown(freq);
    }
});
document.getElementById("keyboard").addEventListener("touchend", function(event){
    event.preventDefault();
    console.log("end " + event.target.id);
    if(event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthUp(freq);
    }
});
document.getElementById("keyboard").addEventListener("touchmove", function(event){
    event.preventDefault();
    console.log("move " + event.target.id);
});
document.getElementById("keyboard").addEventListener("touchcancel", function(event){
    event.preventDefault();
    console.log("cancel " + event.target.id);
    if(event.target.id !== "keyboard"){
        var freq = notemap.get(event.target.id);
        synthUp(freq);
    }
});


// Volume slider
document.getElementById("volume-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    setVolume(event.target.value);
});

// Oscillator wave type picker
document.getElementById("osc-wave-type-picker").addEventListener("change", function(){
    //Take note of scroll-blocking violation! Fix later!
    oscWaveType = document.querySelector("input[name='osc-wave-type']:checked").value;
    console.log(oscWaveType);
});

//ADSR SLIDERS
//Attack
document.getElementById("attack-slider").addEventListener("input", function(event){
    attack = parseFloat(event.target.value);
    $("#attack-value").text(attack);
});
//Decay
document.getElementById("decay-slider").addEventListener("input", function(event){
    decay = parseFloat(event.target.value);
    $("#decay-value").text(decay);
});
//Sustain
document.getElementById("sustain-slider").addEventListener("input", function(event){
    sustain = parseFloat(event.target.value);
    $("#sustain-value").text(sustain);
});
//Release
document.getElementById("release-slider").addEventListener("input", function(event){
    release = parseFloat(event.target.value);
    $("#release-value").text(release);
});

