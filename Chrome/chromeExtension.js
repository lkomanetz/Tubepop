var tubePop;

chrome.pageAction.onClicked.addListener(function(tab) {
    if (!tubePop) {
        tubePop = new Tubepop();
    }
    tubePop.setUrl(tab.url);
    tubePop.setTabId(tab.id);
    
    chrome.tabs.sendMessage(
        tab.id,
        {event: "tubepop_clicked"},
        function(response) {
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

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "youtube.com/watch" }
                })
                // new chrome.declarativeContent.PageStateMatcher({
                //     css: ["video"]
                // })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
        }]);
    });
});