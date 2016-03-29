document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#go-to-options').addEventListener("click", function() {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('setup.html'));
        }
    });
});