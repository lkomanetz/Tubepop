var buttons = require("sdk/ui/button/action");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var data = require("sdk/self").data;

var regex = /(\w+:\/\/\w{3}\.\w+\.(\w{3}|\w{2}))(\/\w+\?\w{1}=([^\&]*))/;
var currentTime = 0;

var button = buttons.ActionButton({
    id: "tubepop",
    label: "Tubepop",
    icon: {
        "16": "./button_black_eject_16.png",
        "32": "./button_black_eject_32.png",
        "64": "./button_black_eject_64.png"
    },
    onClick: handleClick
});

tabs.on("ready", function(tab) {
    var worker = tab.attach({
        contentScriptFile: data.url("scripts/contentScript.js"),
    });
    
    worker.port.emit("scriptUrl", data.url("scripts/clientScript.js"))
    worker.port.on("current_time", setCurrentTime);
});

function setCurrentTime(newTime) {
    currentTime = newTime;
}

function handleClick(state) {
    if (!isCurrentTabYoutube()) {
        notifications.notify({
            text: "I'm sorry:(\nYour current tab is not youtube.",
            iconURL: "./button_black_eject_64.png"
        });
        
        return;
    }
    else {
        var embedLink = getEmbedLink();
        var tab = tabs.activeTab;
        
        windows.open({
            url: embedLink,
            onOpen: function(window) {
                tab.close();
            }
        });
    }
}

function getEmbedLink() {
    var match = regex.exec(tabs.activeTab.url);
    return match[1] + "/embed/" + match[4] + "?start=" + parseInt(currentTime) + "&autoplay=1";
}

function isCurrentTabYoutube() {
    var match = regex.exec(tabs.activeTab.url);
    var isYoutube = false;
    
    if (match) {
        isYoutube = match[0].indexOf("youtube") != -1;
    }
    
    return isYoutube;
}
