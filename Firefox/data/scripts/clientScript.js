var doc = window.content.document;

if (doc) {
    var intervalHandle = setInterval(function() {
        var player = doc.getElementById("movie_player");

        if (player) {
            console.log(player);
        }
    }, 1000);

    document.onunload = function() {
        clearInterval(intervalHandle);
        intervalHandle = null;
    }
}