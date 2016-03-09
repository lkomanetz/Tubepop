function restoreOptions() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("get", "../options.json", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var options = JSON.parse(xhr.responseText);
            
            chrome.storage.sync.get("tubepopOptions", function(storage){
                if (storage["tubepopOptions"]) {
                    options = storage["tubepopOptions"];
                }
                
                document.getElementById("cbCloseBehavior").value = options.closeAction.toLowerCase();
                document.getElementById("chkAutoplay").checked = options.useAutoplay;
                document.getElementById("txtWidth").value = options.playerWidth;
                document.getElementById("txtHeight").value = options.playerHeight;
                document.getElementById("chkPlayAt").checked = options.startAtCurrentTime;
            });
        }
    }
    
    xhr.send(null);
}

function saveOptions() {
    var action = document.getElementById("cbCloseBehavior").value;
    var width = parseInt(document.getElementById("txtWidth").value);
    var height = parseInt(document.getElementById("txtHeight").value);
    var autoPlay = document.getElementById("chkAutoplay").checked;
    var startAtCurrentTime = document.getElementById("chkPlayAt").checked;
    
    var tubepopOptions = {
        closeAction: action,
        playerWidth: width,
        playerHeight: height,
        useAutoplay: autoPlay,
        startAtCurrentTime: startAtCurrentTime
    };
    
    chrome.storage.sync.set({"tubepopOptions": tubepopOptions}, function() {
        var status = document.getElementById("txtStatus");
        status.textContent = "Options Saved.";
        setTimeout(function() {
            status.textContent = "";
        }, 1000);
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);