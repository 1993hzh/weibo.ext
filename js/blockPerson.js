var blockPerson = {};

blockPerson.block = function(id, name, callback) {
    chrome.runtime.sendMessage({
        method: "blockPerson",
        id: id,
        name: name
    }, function(response) {
        var result = response.result;
        if (result.result) {
            callback();
        } else {
            alert(result.msg);
        }
    });
};

blockPerson.remove = function(id) {
    var nodeList = document.querySelectorAll("div[tbinfo*='" + id + "']");
    for (i in nodeList) {
        nodeList[i].remove();
    }
};

blockPerson.getParameterByName = function(name, str) {
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(str);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

blockPerson.registerHandler = function() {
    var block = document.querySelectorAll("a[action-type='feed_list_shield_novip']");
    for (i in block) {
        block[i].addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            var data = e.currentTarget.getAttribute("action-data");
            var id = blockPerson.getParameterByName("uid", data);
            var name = blockPerson.getParameterByName("nickname", data);
            blockPerson.block(id, name, function() {
                blockPerson.remove(id);
            });
        }, false);
    }
};

blockPerson.getBlocked = function(callback) {
    chrome.runtime.sendMessage({
        method: "getBlockedPerson"
    }, function(response) {
    	callback(response.result);
    });
};

blockPerson.getBlockedCallback = function(result) {
    if (result.result) {
        result.msg.forEach(function(elem) {
            blockPerson.remove(elem.id);
        });
    } else {
        alert(result.msg);
    }
};

blockPerson.init = function() {
    blockPerson.getBlocked(blockPerson.getBlockedCallback);
    blockPerson.registerHandler();
};

blockPerson.init();