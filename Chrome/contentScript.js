var currentTime = 0;
var s = document.createElement("script");

s.src = chrome.extension.getURL("clientScript.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(this);
};

document.addEventListener("Tubepop_TimeChanged", function(e) {
    currentTime = e.detail;
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.event === "tubepop_clicked") {
        sendResponse({content: currentTime});
    }
});