var tubePop;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (!tubePop) {
        tubePop = new Tubepop();
    }
    tubePop.setUrl(tab.url);
    tubePop.setTabId(tab.id);
    
    chrome.tabs.sendMessage(
        tab.id,
        {event: "tubepop_clicked"},
        function(response) {
            console.log(chrome.runtime.lastError);
            tubePop.undockPlayer(response.content);
        }
    );
    
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (!tubePop) {
        tubePop = new Tubepop();
    }
    for (key in changes) {
        if (key === "tubepopOptions") {
            tubePop.setOptions(changes[key].newValue);
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;
    var regex = /youtube.com\/watch/;
    if (changeInfo.url.match(regex)) {
        console.log(changeInfo.url);
        chrome.browserAction.enable(tab.id);
    }
    else chrome.browserAction.disable(tab.id);
});

/*
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "youtube.com/watch" }
                })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
        }]);
    });
});
*/