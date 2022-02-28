/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function AudioSynth(){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    
    this.loop = {
        ROLL: 0
    };
    
    this.clip = {
        WOOSH: 0,
		BANG: 1
    };
    
    var loopFiles = [];
                 
    var clipFiles = ["audio/fireworks/woosh.ogg",
					"audio/fireworks/bang.ogg"];

    var loopBufferArray = [];
    var clipBufferArray = [];
    
    var sourceArrayLoop = [];
    var sourceArrayClip = [];
    
    var musicGain = audioCtx.createGain();
    var fxGain = audioCtx.createGain();
    var musicVol = 0.75;
    var fxVol = 0.1;
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
    var attack = 0.02;
    var decay = 0;
    var sustain = 0.15;
    var release = 0.05;
    var bend = 0.3;
    var synthArray = [];
	var curSynth = null;
    var osc1 = null;
    var osc2 = null;
    var osc3 = null;
    var gainNode = null;
	
	var firstNote = true;
	var freqArray = [261, 391];
	
	this.tap = function(){
		if(!curSynth){
			this.synthOn(0);
			window.setTimeout(function(s){
				s.synthOff(0);
			}, 50, this);
		}
	};
	
    this.synthOn = function(synth){
        //var s = synthArray[synth];
        
        if(!curSynth){
			var freq = 261;
			if(firstNote){
				freq = freqArray[0];
			}else{
				freq = freqArray[1];
			}
			firstNote = !firstNote;
            curSynth = [audioCtx.currentTime, audioCtx.createOscillator(), audioCtx.createOscillator(), audioCtx.createOscillator(), audioCtx.createGain()];
            //s = curSynth;
            var startTime = audioCtx.currentTime;
            switch(synth){
                case this.synth.LASER:
                    curSynth[1].type = "triangle";
                    //s[2].type = "triangle";
                    //s[3].type = "sawtooth";
                    curSynth[1].frequency.value = freq; // --> 391
                    //s[2].frequency.value = 120; // --> 147
                    //s[3].frequency.value = 50; // --> 73
                    curSynth[1].connect(curSynth[4]);
                    //s[2].connect(s[4]);
                    //s[3].connect(s[4]);
                    curSynth[4].connect(fxGain);
                    curSynth[1].start(0);
                    //s[2].start(0);
                    //s[3].start(0);
                    //PITCH BEND
                    //s[1].frequency.linearRampToValueAtTime(125, startTime + bend);
                    //s[2].frequency.linearRampToValueAtTime(147, startTime + bend);
                    //s[3].frequency.linearRampToValueAtTime(73, startTime + bend);

                    //ADSR Evnelope
                    curSynth[4].gain.cancelScheduledValues(0);
                    curSynth[4].gain.setValueAtTime(0, startTime);
                    //Attack
                    curSynth[4].gain.linearRampToValueAtTime(sustain, startTime + attack);
                    //Decay to Sustain
                    curSynth[4].gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
                    
                    break;
                
            }
        }
    };
    
    this.synthOff = function(synth){
        //var s = synthArray[synth];
        if(curSynth){
            var startTime = audioCtx.currentTime;
            //ADSR Evelope
            curSynth[4].gain.cancelScheduledValues(0);
            //s[4].gain.setValueAtTime(s[4].gain.value, startTime);
            curSynth[4].gain.linearRampToValueAtTime(0, startTime + release);
            curSynth[1].stop(startTime + release);
            //s[2].stop(startTime + release);
            //s[3].stop(startTime + release);
            curSynth = null;
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
