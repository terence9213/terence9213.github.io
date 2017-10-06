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

/*  NODES
 * [[osc][gain]] -> [synthGain] -> [distortion] -> [masterGain] -> [compressor] -> [audioCtx Destination]
 *                                                                              -> [analyser]
 */
 
//COMPRESSOR
var compressor = audioCtx.createDynamicsCompressor();
compressor.connect(audioCtx.destination);
compressor.threshold.value = -50;
compressor.knee.value = 40;
compressor.ratio.value = 18;
compressor.attack.value = 0.003;
compressor.release.value = 0.25;
//compressor.reduction (get current reduction)
//https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode

//ANALYSER
var analyser = audioCtx.createAnalyser();
compressor.connect(analyser);

//MASTER GAIN
var masterGain = audioCtx.createGain();
masterGain.connect(compressor);

//DISTORTION
var distortion = audioCtx.createWaveShaper();
distortion.connect(masterGain);

//SYNTH GAIN
var synthGain = audioCtx.createGain();
synthGain.connect(distortion);

//ADSR VALUES
var attack = 0.2; //seconds
var decay = 0.3; //seconds
var sustain = 0.8; //amplitude
var release = 0.3; //seconds

//https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-midi-envelope-generator/

//WAVEFROM
var oscWaveType = "sine"; //default

//DISTORTION
var distortionLvl = 0;
var distortionOn = true;

var mute = false;

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
    
    initUIValues();
    
    initAnalyser();
    initMaps();
    
    setDistortionCurve();
    
    console.log("initComplete");
    
}

//INIT UI VALUES
function initUIValues(){
    document.getElementById("volume-slider").value = 0.5;
    document.getElementById("attack-slider").value = attack;
    document.getElementById("decay-slider").value = decay;
    document.getElementById("sustain-slider").value = sustain;
    document.getElementById("release-slider").value = release;
    document.getElementById("distortion-lvl-slider").value = distortionLvl;
    $("#attack-value").text(attack);
    $("#decay-value").text(decay);
    $("#sustain-value").text(sustain);
    $("#release-value").text(release);
    $("#distortion-lvl-value").text(distortionLvl);
    
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

// INIT NOTE-FREQ & KEYCODE_FREQ MAP
function initMaps(){
    var noteFreqArray = 
        [
            ["C4", 261.6255653005985],
            ["C#4", 277.182630976872],
            ["D4", 293.66476791740746],
            ["D#4", 311.1269837220808],
            ["E4", 329.62755691286986],
            ["F4", 349.2282314330038],
            ["F#4", 369.99442271163434],
            ["G4", 391.99543598174927],
            ["G#4", 415.3046975799451],
            ["A4", 440],
            ["A#4", 466.1637615180899],
            ["B4", 493.8833012561241],
            ["C5", 523.2511306011974],//
            ["C#5", 554.3652619537443],
            ["D5", 587.3295358348153],
            ["D#5", 622.253967444162],
            ["E5", 659.2551138257401],
            ["F5", 698.456462866008]
        ];
    var keycodeFreqArray =
        [
            [65, 261.6255653005985],
            [87, 277.182630976872],
            [83, 293.66476791740746],
            [69, 311.1269837220808],
            [68, 329.62755691286986],
            [70, 349.2282314330038],
            [84, 369.99442271163434],
            [71, 391.99543598174927],
            [89, 415.3046975799451],
            [72, 440],
            [85, 466.1637615180899],
            [74, 493.8833012561241],
            [75, 523.2511306011974],//
            [79, 554.3652619537443],
            [76, 587.3295358348153],
            [80, 622.253967444162],
            [186, 659.2551138257401],
            [222, 698.456462866008]
        ];
    notemap = new Map(noteFreqArray);
    keycodemap = new Map(keycodeFreqArray);
    
}

// INIT DISTORTION
//https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function setDistortionCurve(){
    var curve = new Float32Array(44100);
    var n_samples = 44100;
    for (i=0 ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        //curve[i] = (Math.PI + distortionLvl) * x / (Math.PI + distortionLvl * Math.abs(x));
        curve[i] = x*x*x;
        //curve[i] = 1 * x * x * x + 1 * x * x ;
        //curve[i] = x * x ;
    }
    distortion.curve = curve;
}


// UI FUNCTIONS
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

function toggleDistortion(){
    if(distortionOn){
        distortion.disconnect(masterGain);
        synthGain.connect(masterGain);
        distortionOn = false;
    }
    else{
        distortion.connect(masterGain);
        synthGain.disconnect(masterGain);
        distortionOn = true;
    }
}

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
        gainNode.connect(synthGain);
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
    setVolume(event.target.value);
});

// Oscillator wave type picker
document.getElementById("osc-wave-type-picker").addEventListener("change", function(){
    oscWaveType = document.querySelector("input[name='osc-wave-type']:checked").value;
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

// DISTORTION SLIDER
document.getElementById("distortion-lvl-slider").addEventListener("input", function(event){
    distortionLvl = parseFloat(event.target.value);
    setDistortionCurve();
    $("#distortion-lvl-value").text(distortionLvl);
});