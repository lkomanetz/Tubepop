var tubePop = new Tubepop();

chrome.browserAction.onClicked.addListener(function(tab) {
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
    for (key in changes) {
        if (key === "tubepopOptions") {
            alert("Hello");
            tubePop.setOptions(changes[key].newValue);
        }
    }
});