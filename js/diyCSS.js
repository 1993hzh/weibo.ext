var DiyCSS = {};

DiyCSS.init = function () {
    DiyCSS.retrieve(DiyCSS.render);
    DiyCSS.getBlockedPerson();
};

DiyCSS.getBlockedPerson = function () {
    chrome.runtime.sendMessage({
        method: "getBlockedPerson"
    }, function (response) {
        var result = response.result;
        if (result.result) {
            if (result.result) {
                DiyCSS.renderBlockedStyle(result.msg);
            } else {
                alert(result.msg);
            }
        } else {
            alert(result.msg);
        }
    });
};

DiyCSS.renderBlockedStyle = function (obj) {
    var content = "";
    obj.forEach(function (elem) {
        content += "div[tbinfo*='" + elem.id + "'] {display:none !important;} ";
    });
    DiyCSS.render("blockedPerson", content);
};

DiyCSS.retrieve = function (callback) {
    chrome.runtime.sendMessage({
        method: "getCSS"
    }, function (response) {
        var result = response.result;
        if (result.result) {
            callback("diyCSS", result.msg);
        } else {
            alert(result.msg);
        }
    });
};

DiyCSS.render = function (elementId, content) {
    if (!content) {
        console.log("Did not retrieve any css content.");
        return false;
    }
    var css = document.createElement('style');
    css.id = elementId;
    css.type = "text/css";
    css.innerHTML = content;
    document.head.appendChild(css);
};

(function () {
    DiyCSS.init();
})();