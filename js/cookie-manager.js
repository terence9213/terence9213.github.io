/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function CookieManager(){
    
    this.exp = ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    this.inf = ";expires=Tue, 19 Jan 2038 03:14:07 GMT";
    this.path = ";path=" + location.pathname;
    
    this.cookies = document.cookie.split(";");
    
    this.test = function(){
        var c = document.cookie;
        c = null;
    };
    
    this.setCookie = function(c, v){
        document.cookie = c + "=" + v + this.inf + this.path;
    };
    
    this.getCookie = function(c){
        var cookies = document.cookie.split(";");
        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var cookieArray = cookie.split("=");
            if(cookieArray[0] === c){
                return cookieArray[1];
            }
        }
        return null;
    };
    
    this.clearCookie = function(c){
        var cookies = document.cookie.split(";");
        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var cookieArray = cookie.split("=");
            if(cookieArray[0] === c){
                console.log(cookie + this.exp + this.path);
                document.cookie = cookie + this.exp + this.path;
            }
        }
    };
    
    this.clearAll = function() {
        var cookies = document.cookie.split(";");
        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=" + this.exp + this.path;
        }
    };
}