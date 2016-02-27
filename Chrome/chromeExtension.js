chrome.browserAction.onClicked.addListener(function(tab) {
    var tubePop = new Tubepop(tab.url, tab.id);
    tubePop.undockPlayer();
});