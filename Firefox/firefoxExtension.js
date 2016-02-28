var buttons = require("sdk/ui/button/action");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var panels = require("sdk/panel");
var frame = require("sdk/ui/frame");
var regex = /(\w+:\/\/\w{3}\.\w+\.(com|org|gov|be))(\/\w+\?\w{1}=(.+?)(?!\w+))/;

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
                window.resizeTo(1024, 576);
                tab.close();
            }
        });
        
    }
}

function getEmbedLink() {
    var match = regex.exec(tabs.activeTab.url);
    return match[1] + "/embed/" + match[4];
}

function isCurrentTabYoutube() {
    var match = regex.exec(tabs.activeTab.url);
    var isYoutube = false;
    
    if (match) {
        isYoutube = match[0].indexOf("youtube") != -1;
    }
    
    return isYoutube;
}