var currentTime = 0;

var intervalHandle = setInterval(function() {
    var player = document.getElementById("movie_player");
    
    if (player) {
        var newTime = player.getCurrentTime();
        if (currentTime != newTime) {
            currentTime = newTime;
            sendTimeChangedEvent(currentTime);
        }
    }
}, 1000);

document.onunload = function() {
    clearInterval(intervalHandle);
    intervalHandle = 0;
};

function sendTimeChangedEvent(time) {
    document.dispatchEvent(new CustomEvent("Tubepop_TimeChanged", {
        detail: time
    }));
}