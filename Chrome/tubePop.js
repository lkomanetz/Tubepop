function Tubepop() {
    this._options = null;
    this._url = null;
    this._tabId = null;
    this._timestamp = 0;
    this.regex = /(\w+:\/\/\w{3}\.\w+\.(\w{3}|\w{2}))(\/\w+\?\w{1}=([^\&]*))/;
    this.match = null;
    this.dialog = null;
	
	this._loadSettings();
}

Tubepop.prototype.undockPlayer = function(timestamp) {
    this._timestamp = timestamp;
    
    if (this._isCurrentTabYoutube()) {
        this._createWindow();
        this._disposeOriginalTab();
    }
    else {
        alert("I'm sorry :(\nYou're current tab is not Youtube.");
    }
};

Tubepop.prototype.setUrl = function(url) {
    this._url = url;
};

Tubepop.prototype.setTabId = function(id) {
    this._tabId = id;
};

Tubepop.prototype.setOptions = function(newOptions) {
    this._options = newOptions;
};

Tubepop.prototype._isCurrentTabYoutube = function() {
    this.match = this.regex.exec(this._url);
    var isYoutube = false;
    
    if (this.match) {
        isYoutube = this.match[0].indexOf("youtube") != -1;
    }
    
    return isYoutube;
};

Tubepop.prototype._getEmbedLink = function() {
    var timestampStr = parseInt(this._timestamp).toString();
    this.match = this.regex.exec(this._url);
    var embeddedUrl = this.match[1] + "/embed/" + this.match[4];
	
	embeddedUrl += "?start=" + timestampStr;
	
    if (this._options.useAutoplay) {
        embeddedUrl += "&autoplay=1";
    }
    
    return embeddedUrl;
};

Tubepop.prototype._loadSettings = function() {
    var that = this;
    chrome.storage.sync.get("tubepopOptions", function(storage) {
        if (!storage["tubepopOptions"]) {
            that._loadDefaultSettings();
        }
        else {
            that.setOptions(storage["tubepopOptions"]);
        }
    });
}

Tubepop.prototype._disposeOriginalTab = function() {
    if (chrome) {
        chrome.tabs.remove(this._tabId);
    }
};

Tubepop.prototype._loadDefaultSettings = function() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("get", "options.json", false);
    xhr.send(null);
    
    var options = JSON.parse(xhr.responseText);
    if (!this._options) {
        this._options = options;
    }
};

Tubepop.prototype._createNewTab = function(windowId) {
    chrome.tabs.create({
        url: this._url,
        active: true
    });
};

Tubepop.prototype._createWindow = function() {
    var that = this; 
    if (chrome) {
        chrome.windows.create({
            "url": this._getEmbedLink(this._url),
            "type": "detached_panel",
            "width": this._options.playerWidth,
            "height": this._options.playerHeight,
        },
        function(window) {
            if (that._options.closeAction.toLowerCase() === "redock") {
                chrome.windows.onRemoved.addListener(function(windowId) {
                    if (windowId == window.id) {
                        that._createNewTab(windowId);
                    }
                });
            }
        });
    }
};
