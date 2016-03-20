var currentTime = 0;

/**
 * The add-on running outside of the content-script is going to send the URL of the client-script
 * that is to be injected into the page.  This is done so I can get the youtube player off the page.
 */
self.port.on("scriptUrl", function(url) {
    var scriptTag = document.createElement("script");
    scriptTag.src = url;
    
    (document.head || document.documentElement).appendChild(scriptTag);
    
    scriptTag.onload = function() {
        scriptTag.parentNode.removeChild(this);
    };
});

/*
 * Every time the client script gets the time (and the time has changed) it calls this event.  This
 * is the mechanism used so the client-script can communicate with the content-script.  I can't get
 * the current play time otherwise.
 * I'm call to port.emit() is used to communicate the current play time from the content-script back to
 * the add-on.
 */
document.addEventListener("Tubepop_TimeChanged", function(e) {
    currentTime = e.detail;
    self.port.emit("current_time", currentTime);
});
