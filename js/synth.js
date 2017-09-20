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
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

var initComplete = false;
var mute = true;

var notemap = null;
var keycodemap = null;


//INIT HERE
init();

// INIT SYNTH
function init(){
    console.log("INIT ---");
    // Connect Nodes
    //  Oscillator >> Gain >> audioCtx.Destination
    oscillator.connect(gainNode);
    //gainNode.connect(audioCtx.destination);


    gainNode.gain.value = 0.1;
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
    gainNode.gain.value = vol;
}

function toggleMute(){
    if(mute){
        gainNode.connect(audioCtx.destination);
        mute = false;
    }
    else{
        gainNode.disconnect(audioCtx.destination);
        mute = true;
    }
    
}


function playTune(notes){
    toggleMute();
    for(var i = 0; i < notes.length ; i++)
    {
        oscillator.frequency.value = notes[i];
        wait(300);
    }
    toggleMute();
}

function wait(ms) {
    var now = new Date().getTime();
    var end = now + ms;
    while(now < end){
        now = new Date().getTime();
    }
}



//TEST KEYBOARD INPUT

var oscNodeArray = [];
var oscNodeMap = new Map();

document.addEventListener("keydown", function(event){
    console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
    if(freq && !oscNodeMap.has(freq)){
        var osc = audioCtx.createOscillator();
        osc.frequency.value = freq;
        osc.connect(gainNode);
        osc.start(0);
        oscNodeMap.set(freq, osc);
    }
    
});


document.addEventListener("keyup", function(event){
    console.log(event.keyCode);
    var freq = keycodemap.get(event.keyCode);
    var osc = oscNodeMap.get(freq);
    if(osc){
        osc.stop(0);
        osc.disconnect();
        oscNodeMap.delete(freq);
    }
});

//workaround for individual notes
var down = false;
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