var buttons = require("sdk/ui/button/action");
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var useAutoplay = require("sdk/simple-prefs").prefs["useAutoplay"];
var closeAction = require("sdk/simple-prefs").prefs["closeAction"];
var windows = require("sdk/windows").browserWindows;
var data = require("sdk/self").data;

var regex = /(\w+:\/\/\w{3}\.\w+\.(\w{3}|\w{2}))(\/\w+\?\w{1}=([^\&]*))/;
var currentTime = 0;
var videoUrl;

require("sdk/simple-prefs").on("", onSettingChanged);

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

/**
 * I'm sending the url of the client script from here to the content script
 * that is being attached to the tab.  This allows the content script to 
 * generate a <script> tag on the page and inject the clientScript.js file
 * location into the <script> tag's source property.
 */
tabs.on("ready", function(tab) {
    var worker = tab.attach({
        contentScriptFile: data.url("scripts/contentScript.js"),
    });
    
    worker.port.emit("scriptUrl", data.url("scripts/clientScript.js"))
    worker.port.on("current_time", setCurrentTime);
});

windows.on("close", function(window) {
	if (closeAction === "redock") {
		windows.activeWindow.tabs.open(videoUrl);
	}
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

	videoUrl = tabl.url;
        
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
	var useAutoplay = require("sdk/simple-prefs").prefs["useAutoplay"];
	var embeddedUrl = match[1] + "/embed/" + match[4] + "?start=" + parseInt(currentTime);
	
	if (useAutoplay) {
		embeddedUrl += "&autoplay=1";
	}
	
    return embeddedUrl;
}

function isCurrentTabYoutube() {
    var match = regex.exec(tabs.activeTab.url);
    var isYoutube = false;
    
    if (match) {
        isYoutube = match[0].indexOf("youtube") != -1;
    }
    
    return isYoutube;
}

function onSettingChanged(setting) {
	switch (setting) {
		case "closeAction":
			closeAction = require("sdk/simple-prefs").prefs[setting];
			break;
		case "useAutoplay":
			useAutoplay = require("sdk/simple-prefs").prefs[setting];
			break;
	}
}
