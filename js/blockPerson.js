var BlockPerson = {};

BlockPerson.nodeListToArray = function(nodeList) {
    return Array.prototype.slice.call(nodeList);
};

BlockPerson.block = function(id, name, callback) {
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

BlockPerson.remove = function (id) {
    var nodeList = document.querySelectorAll("div[tbinfo*='" + id + "']");
    BlockPerson.nodeListToArray(nodeList).forEach(function (elem) {
        elem.remove();
    });
};

BlockPerson.getParameterByName = function(name, str) {
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(str);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

BlockPerson.registerHandler = function () {
    var blocks = document.querySelectorAll("a[action-type='feed_list_shield_novip']");
    BlockPerson.nodeListToArray(blocks).forEach(function (elem) {
        elem.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var data = e.currentTarget.getAttribute("action-data");
            var id = BlockPerson.getParameterByName("uid", data);
            var name = BlockPerson.getParameterByName("nickname", data);
            BlockPerson.block(id, name, function () {
                BlockPerson.remove(id);
            });
        }, false);
    });
};

BlockPerson.getBlocked = function(callback) {
    chrome.runtime.sendMessage({
        method: "getBlockedPerson"
    }, function(response) {
    	callback(response.result);
    });
};

BlockPerson.getBlockedCallback = function(result) {
    if (result.result) {
        (function () {
            result.msg.forEach(function (elem) {
                BlockPerson.remove(elem.id);
            });
        })();
    } else {
        alert(result.msg);
    }
};

BlockPerson.init = function() {
    BlockPerson.getBlocked(BlockPerson.getBlockedCallback);
    BlockPerson.registerHandler();
};

document.onreadystatechange = function () {
    if (document.querySelector("div[node-type='homefeed']")) {
        BlockPerson.init();
    }
};