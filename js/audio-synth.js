/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function AudioSynth(){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    var files = ["audio/eternityquest/eternity.ogg"];
    var audioBufferArray = [];
    
    var sourceArray = [];
    
    var musicGain = audioCtx.createGain();
    var fxGain = audioCtx.createGain();
    
    
    var onError = function(){
        console.log("Error loading audio file");
    };
    
    this.ready = function(){
        for(var i = 0 ; i < files.length ; i++){
            if(!audioBufferArray[i]){
                return false;
            }
        }
        return true;
    };
    
    this.init = function(){
        musicGain.connect(audioCtx.destination);
        fxGain.connect(audioCtx.destination);
        for(var i = 0 ; i < files.length ; i++){
            var request  = new XMLHttpRequest();
            request.open('GET', files[i], true);
            request.responseType = 'arraybuffer';
            request.index = i;
            request.onload = function(){
                audioCtx.decodeAudioData(request.response, function(buffer) {
                    audioBufferArray[request.index] = buffer;
                  }, onError);
            };
            request.send();
        }
        
    };
    
    this.toggleMusicMute = function(){
        if(musicGain.gain.value === 0){
            musicGain.gain.value = 1;
        }
        else{
            musicGain.gain.value = 0;
        }
    };
    this.toggleFxMute = function(){
        if(fxGain.gain.value === 0){
            fxGain.gain.value = 1;
        }
        else{
            fxGain.gain.value = 0;
        }
    };
    
    
    
    this.playLoop = function(i){
        var source = audioCtx.createBufferSource();
        source.connect(musicGain);
        source.buffer = audioBufferArray[i];
        source.loop = true;
        source.start(0);
        sourceArray[i] = source;
    };
    
    this.stopLoop = function(i){
        sourceArray[i].stop();
        sourceArray[i] = null;
    };
}
