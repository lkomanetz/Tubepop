function Tubepop() {
    this._options = null;
    this.regex = /(\w+:\/\/\w{3}\.\w+\.(\w{3}|\w{2}))(\/\w+\?\w{1}=([^\&]*))/;
    this.match = null;
    this.dialog = null;
    this._url = null;
    this._tabId = null;
    this._timestamp = 0;
}

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
    
    alert(this._options);
    if (this._options.startAtCurrentTime) {
        embeddedUrl += "?start=" + timestampStr;
    }
    if (this._options.useAutoplay) {
        embeddedUrl += "&autoplay=1";
    }
    
    return embeddedUrl;
};

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

Tubepop.prototype.setUrl(url) {
    alert("hi");
    this._url = url;
};

Tubepop.prototype.setTabId(id) {
    this._tabId = id;
};

Tubepop.prototype.setOptions = function(newOptions) {
    alert("hello");
    this._options = newOptions;
};

Tubepop.prototype._disposeOriginalTab = function() {
    if (chrome) {
        chrome.tabs.remove(this._tabId);
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
            "width": 1024,
            "height": 576,
        },
        function(window) {
            chrome.windows.onRemoved.addListener(function(windowId) {
                if (windowId == window.id) {
                    that._createNewTab(windowId);
                }
            });
        });
    }
};
