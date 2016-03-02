
var intervalHandle = setInterval(function() {
    var player = document.getElementById("movie_player");
    
    document.dispatchEvent(new CustomEvent("Tubepop_ExtensionConnection", {
        detail: player.getCurrentTime()
    })); 
}, 1000);

document.onunload = function() {
    clearInterval(intervalHandle);
    intervalHandle = 0;
};