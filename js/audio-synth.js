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
        READY: 0
    };
    
    var loopFiles = ["audio/eternityquest/menu.ogg","audio/eternityquest/eternity.ogg"];
    var clipFiles = ["audio/eternityquest/ready.ogg"];
    var loopBufferArray = [];
    var clipBufferArray = [];
    
    var sourceArray = [];
    
    var musicGain = audioCtx.createGain();
    var fxGain = audioCtx.createGain();
    var musicVol = 0.5;
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
        sourceArray[i] = source;
    };
    
    this.stopLoop = function(i){
        if(sourceArray[i]){
            sourceArray[i].stop();
            sourceArray[i] = null;
        }
    };
    
    this.stopAllLoops = function(){
        for(var i = 0 ; i < sourceArray.length ; i++){
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
    
    this.get = function(){
        return loopBufferArray;
    };
}
