var previousTime = 0;

var intervalHandle = setInterval(function() {
    try {
        var player = document.getElementById("movie_player");

        if (player) {
            var newTime = player.getCurrentTime();
            
            if (previousTime != newTime) {
                previousTime = newTime;
                sendCurrentTime(newTime);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    
}, 1000);

document.onunload = function() {
    clearInterval(intervalHandle);
    intervalHandle = 0;
};

function sendCurrentTime(time) {
    document.dispatchEvent(new CustomEvent("Tubepop_TimeChanged", {
        detail: time
    }));
}