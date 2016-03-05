var buttons = require("sdk/ui/button/action");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var panels = require("sdk/panel");
var frame = require("sdk/ui/frame");
var regex = /(\w+:\/\/\w{3}\.\w+\.(\w{3}|\w{2}))(\/\w+\?\w{1}=([^\&]*))/;

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

pageMod.PageMod({
    include: "*.youtube.com",
    contentScriptFile: data.url("scripts/clientScript.js")
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
