function Tubepop(url, tabId) {
    this.regex = /(\w+:\/\/\w{3}\.\w+\.(com|org|gov|be))(\/\w+\?\w{1}=(.+?)(?!\w+))/;
    this.match = null;
    this.dialog = null;
    this._url = url;
    this._tabId = tabId;
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
    this.match = this.regex.exec(this._url);
    var embeddedUrl = this.match[1] + "/embed/" + this.match[4];
    return embeddedUrl;
};

Tubepop.prototype.undockPlayer = function() {
    if (this._isCurrentTabYoutube()) {
        this._createWindow();
        this._disposeOriginalTab();
    }
    else {
        alert("I'm sorry :(\nYou're current tab is not Youtube.");
    }
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