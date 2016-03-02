chrome.browserAction.onClicked.addListener(function(tab) {
    var tubePop = new Tubepop(tab.url, tab.id);
    
    chrome.tabs.sendMessage(
        tab.id,
        {event: "tubepop_clicked"},
        function(response) {
            tubePop.undockPlayer(response.content);
        }
    );
    
});