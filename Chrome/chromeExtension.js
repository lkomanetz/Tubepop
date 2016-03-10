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