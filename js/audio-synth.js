/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function AudioSynth(){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    
    this.loop = {
        BGM_MAIN_MENU: 0,
        BGM_GAME: 1
    };
    
    this.clip = {
        READY: 0,
        EXPLOSION: 1,
        BLAST: 2,
        GATLING: 3,
        FIREBALL: 4,
        LASER: 5,
        BLIZZARD: 6
    };
    
    var loopFiles = ["audio/eternityquest/jingle.ogg", //"audio/eternityquest/menu.ogg",
                     "audio/eternityquest/bells.ogg"//"audio/eternityquest/eternity.ogg"
                    ];
                 
    var clipFiles = ["audio/eternityquest/ready.ogg", 
                     "audio/eternityquest/explosion.ogg", 
                     "audio/eternityquest/blast.ogg", 
                     "audio/eternityquest/gatling.ogg",
                     "audio/eternityquest/fireball.ogg",
                     "audio/eternityquest/laser.ogg",
                     "audio/eternityquest/blizzard.ogg"];
    var loopBufferArray = [];
    var clipBufferArray = [];
    
    var sourceArrayLoop = [];
    var sourceArrayClip = [];
    
    var musicGain = audioCtx.createGain();
    var fxGain = audioCtx.createGain();
    var musicVol = 0.75;
    var fxVol = 0.75;
    var musicMute = false;
    var fxMute = false;
    
    var onError = function(type, index){
        console.log("Error loading audio file: " + type + " " + index);
    };
    
    this.ready = function(){
        for(var i = 0 ; i < loopFiles.length ; i++){
            if(!loopBufferArray[i]){
                return false;
            }
        }
        for(var i = 0 ; i < clipFiles.length ; i++){
            if(!clipBufferArray[i]){
                return false;
            }
        }
        return true;
    };
    
    this.init = function(){
        musicGain.gain.value = 0.5;
        fxGain.gain.value = 0.8;
        musicGain.connect(audioCtx.destination);
        fxGain.connect(audioCtx.destination);
        
        
        for(var i = 0 ; i < loopFiles.length ; i++){
            var requestL = new XMLHttpRequest();
            requestL.open('GET', loopFiles[i], true);
            requestL.responseType = 'arraybuffer';
            requestL.index = i;
            requestL.onload = function(){
                var index = this.index;
                audioCtx.decodeAudioData(this.response, function(buffer){
                    loopBufferArray[index] = buffer;
                }, onError);
            };
            requestL.send();
        }
        
        
        //Clips
        for(var i = 0 ; i < clipFiles.length ; i++){
            var requestC  = new XMLHttpRequest();
            requestC.open('GET', clipFiles[i], true);
            requestC.responseType = 'arraybuffer';
            requestC.index = i;
            requestC.onload = function(){
                var index = this.index;
                audioCtx.decodeAudioData(this.response, function(buffer) {
                    clipBufferArray[index] = buffer;
                  }, onError);
            };
            requestC.send();
        }
    };
    
    this.muteMusic = function(){
        musicMute = true;
        musicGain.disconnect(audioCtx.destination);
        
    };
    this.muteFx = function(){
        fxMute = true;
        fxGain.disconnect(audioCtx.destination);
    };
    
    this.toggleMusicMute = function(){
        if(musicMute){
            musicMute = false;
            musicGain.gain.value = 0;
            musicGain.connect(audioCtx.destination);
            musicGain.gain.linearRampToValueAtTime(musicVol, audioCtx.currentTime+0.5);
        }
        else{
            musicMute = true;
            //musicGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.5).disconnect(audioCtx.destination);
            musicGain.disconnect(audioCtx.destination);
            //musicGain.gain.value = musicVol;
        }
    };
    this.toggleFxMute = function(){
        if(fxMute){
            fxMute = false;
            //fxGain.gain.value = 0;
            fxGain.connect(audioCtx.destination);
            //fxGain.gain.linearRampToValueAtTime(musicVol, audioCtx.currentTime+0.5);
        }
        else{
            fxMute = true;
            //fxGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.5);
            fxGain.disconnect(audioCtx.destination);
            //fxGain.gain.value = musicVol;
        }
    };
    
    this.changeMusicVol = function(vol){
        musicVol = vol;
        musicGain.gain.value = vol;
    };
    this.changeFxVol = function(vol){
        fxVol = vol;
        fxGain.gain.value = vol;
    };
    
    this.playLoop = function(i){
        var source = audioCtx.createBufferSource();
        source.connect(musicGain);
        source.buffer = loopBufferArray[i];
        source.loop = true;
        musicGain.gain.value = 0;
        source.start(0);
        musicGain.gain.linearRampToValueAtTime(musicVol, audioCtx.currentTime+0.8);
        sourceArrayLoop[i] = source;
    };
    
    this.stopLoop = function(i){
        if(sourceArrayLoop[i]){
            sourceArrayLoop[i].stop();
            sourceArrayLoop[i] = null;
        }
    };
    
    this.stopAllLoops = function(){
        for(var i = 0 ; i < sourceArrayLoop.length ; i++){
            this.stopLoop(i);
        }
    };
    
    this.playClip = function(i){
        var source = audioCtx.createBufferSource();
        source.connect(fxGain);
        source.buffer = clipBufferArray[i];
        source.loop = false;
        source.start(0);
    };
    
    this.playClipLoop = function(i){
        if(!sourceArrayClip[i]){
            var source = audioCtx.createBufferSource();
            source.connect(fxGain);
            source.buffer = clipBufferArray[i];
            source.loop = true;
            fxGain.gain.value = 0;
            source.start(0);
            fxGain.gain.linearRampToValueAtTime(fxVol, audioCtx.currentTime+0.3);
            sourceArrayClip[i] = source;
        }
    };
    
    this.stopClipLoop = function(i){
        if(sourceArrayClip[i]){
            sourceArrayClip[i].stop();
            sourceArrayClip[i] = null;
        }
    };
    
    this.synth = {
        LASER: 0,
        VOID: 1,
        ORACLE: 2
    };
    
    //SYNTH
    var attack = 0.1;
    var decay = 0;
    var sustain = 0.05;
    var release = 0.3;
    var bend = 0.3;
    var synthArray = [];
    var osc1 = null;
    var osc2 = null;
    var osc3 = null;
    var gainNode = null;
    
    this.synthOn = function(synth){
        var s = synthArray[synth];
        if(!s){
            synthArray[synth] = [audioCtx.currentTime, audioCtx.createOscillator(), audioCtx.createOscillator(), audioCtx.createOscillator(), audioCtx.createGain()];
            s = synthArray[synth];
            var startTime = audioCtx.currentTime;
            switch(synth){
                case this.synth.LASER:
                    s[1].type = "square";
                    s[2].type = "triangle";
                    s[3].type = "sawtooth";
                    s[1].frequency.value = 110; // --> 220
                    s[2].frequency.value = 120; // --> 147
                    s[3].frequency.value = 50; // --> 73
                    s[1].connect(s[4]);
                    s[2].connect(s[4]);
                    s[3].connect(s[4]);
                    s[4].connect(fxGain);
                    s[1].start(0);
                    s[2].start(0);
                    s[3].start(0);
                    //PITCH BEND
                    s[1].frequency.linearRampToValueAtTime(125, startTime + bend);
                    s[2].frequency.linearRampToValueAtTime(147, startTime + bend);
                    s[3].frequency.linearRampToValueAtTime(73, startTime + bend);

                    //ADSR Evnelope
                    s[4].gain.cancelScheduledValues(0);
                    s[4].gain.setValueAtTime(0, startTime);
                    //Attack
                    s[4].gain.linearRampToValueAtTime(0.05, startTime + attack);
                    //Decay to Sustain
                    s[4].gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
                    
                    break;
                case this.synth.VOID:
                    s[1].type = "square";
                    s[2].type = "square";
                    s[3].type = "sawtooth";
                    s[1].frequency.value = 45; // --> 60
                    s[2].frequency.value = 50; // --> 147
                    s[3].frequency.value = 50; // --> 73
                    s[1].connect(s[4]);
                    s[2].connect(s[4]);
                    s[3].connect(s[4]);
                    s[4].connect(fxGain);
                    s[1].start(0);
                    s[2].start(0);
                    s[3].start(0);
                    //PITCH BEND
                    s[1].frequency.linearRampToValueAtTime(60, startTime + bend);
                    s[2].frequency.linearRampToValueAtTime(73, startTime + bend);
                    s[3].frequency.linearRampToValueAtTime(73, startTime + bend);

                    //ADSR Evnelope
                    s[4].gain.cancelScheduledValues(0);
                    s[4].gain.setValueAtTime(0, startTime);
                    //Attack
                    s[4].gain.linearRampToValueAtTime(0.05, startTime + attack);
                    //Decay to Sustain
                    s[4].gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
                    
                    break;
                case this.synth.ORACLE:
                    s[1].type = "square";
                    s[2].type = "sawtooth";
                    s[3].type = "triangle";
                    s[1].frequency.value = 150; // --> 60
                    s[2].frequency.value = 50; // --> 147
                    s[3].frequency.value = 147; // --> 73
                    s[1].connect(s[4]);
                    s[2].connect(s[4]);
                    s[3].connect(s[4]);
                    s[4].connect(fxGain);
                    s[1].start(0);
                    s[2].start(0);
                    s[3].start(0);
                    //PITCH BEND
                    //s[1].frequency.linearRampToValueAtTime(60, startTime + bend);
                    s[2].frequency.linearRampToValueAtTime(73, startTime + bend);
                    //s[3].frequency.linearRampToValueAtTime(73, startTime + bend);

                    //ADSR Evnelope
                    s[4].gain.cancelScheduledValues(0);
                    s[4].gain.setValueAtTime(0, startTime);
                    //Attack
                    s[4].gain.linearRampToValueAtTime(0.05, startTime + attack);
                    //Decay to Sustain
                    s[4].gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
                    break;
            }
        }
    };
    
    this.synthOff = function(synth){
        var s = synthArray[synth];
        if(s){
            var startTime = audioCtx.currentTime;
            //ADSR Evelope
            s[4].gain.cancelScheduledValues(0);
            s[4].gain.setValueAtTime(s[4].gain.value, startTime);
            s[4].gain.linearRampToValueAtTime(0, startTime + release);
            s[1].stop(startTime + release);
            s[2].stop(startTime + release);
            s[3].stop(startTime + release);
            synthArray[synth] = null;
        }
    };
    
    this.synthOffAll = function(){
        for(var i = 0 ; i < synthArray.length ; i++){
            this.synthOff(i);
        }
        for(var i = 0 ; i < sourceArrayClip.length ; i++){
            this.stopClipLoop(i);
        }
    };
}
