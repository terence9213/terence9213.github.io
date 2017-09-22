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

var initComplete = false;
var mute = true;

var notemap = null;
var keycodemap = null;


//INIT HERE
init();

// INIT SYNTH
//Move init statement here!
function init(){
    console.log("INIT ---");
    // Connect Nodes
    //  Oscillator >> Gain >> audioCtx.Destination
    //oscillator.connect(gainNode);
    //gainNode.connect(audioCtx.destination);


    masterGain.gain.value = 0.1;
    //oscillator.frequency.value = 440;

    //oscillator.detune.value = 100; // value in cents
    //oscillator.start(0);
    
    // Retrieve Notemap
    $.getJSON("keycodenotemap.json", function(data){
        parseNotemap(data);
        
        if(notemap && keycodemap)   
        { initComplete = true; }
        else 
        { console.log("-- notemap null --"); }
        console.log("initComplete:" + initComplete);
    });
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

//ADSR 
var attack = 0.1; //seconds
var decay = 0.1; //seconds
var sustain = 0.5; //amplitude
var release = 0.1; //seconds

//https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-midi-envelope-generator/

//KEYBOARD INPUT
var oscNodeMap = new Map();

document.addEventListener("keydown", function(event){
    console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
    if(freq && !oscNodeMap.has(freq)){
        var startTime = audioCtx.currentTime;
        var osc = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
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
    
});


document.addEventListener("keyup", function(event){
    console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
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
        console.log(oscNodeMap);
    }
});

//workaround for individual notes
//var down = false;
/*
document.addEventListener("keydown", function(event){
    console.log(event.keyCode);
    if(!down){
        var freq = keycodemap.get(event.keyCode);
        console.log(freq);
        if(freq){
            down = true;
            oscillator.frequency.value = freq;
            toggleMute();
        }
        
    }
    
});

document.addEventListener("keyup", function(event){
    console.log(event.keyCode);
    if(down)
    {
        down = false;
        toggleMute();
    }
});

*/


// Test volume slider
document.getElementById("volume-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    setVolume(event.target.value);
});

//ADSR SLIDERS
//Attack
document.getElementById("attack-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    attack = parseFloat(event.target.value);
    $("#attack-value").text(attack);
});
//Decay
document.getElementById("decay-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    decay = parseFloat(event.target.value);
    $("#decay-value").text(decay);
});
//Sustain
document.getElementById("sustain-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    sustain = parseFloat(event.target.value);
    $("#sustain-value").text(sustain);
});
//Release
document.getElementById("release-slider").addEventListener("change", function(event){
    console.log(event.target.value);
    release = parseFloat(event.target.value);
    $("#release-value").text(release);
});

/*
$("#test-window").keydown(function(event){
    event.preventDefault();
    console.log("down - " + event.keyCode);
});
$("#test-window").keyup(function(event){
    event.preventDefault();
    console.log("up   - " + event.keyCode);
});
*/