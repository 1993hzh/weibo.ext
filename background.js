var Background = {};

Background.blockPerson = function (id, name, callback) {
    Util.storage.getValue("blockedPerson", function (obj) {
        var blockedPerson = Util.storage.isEmpty(obj) ? [] : obj["blockedPerson"];
        var newBlockPerson = {
            id: id,
            name: name
        };
        if (blockedPerson.indexOf(newBlockPerson) === -1) {
            blockedPerson.push(newBlockPerson);
        }
        Util.storage.setValue("blockedPerson", blockedPerson, callback);
    });
};

Background.getBlockedPerson = function (callback) {
    Util.storage.getValue("blockedPerson", function (obj) {
        var blockedPerson = Util.storage.isEmpty(obj) ? [] : obj["blockedPerson"];
        if (callback) {
            callback(blockedPerson);
        }
    });
};

Background.isBlockEnabled = function (callback) {
    Util.storage.getValue("blockOption", function (obj) {
        var value = !Util.storage.isEmpty(obj) ? obj["blockOption"] : true;
        if (callback) {
            callback(value !== "false");
        }
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method) {
        case "getCSS":
            Util.storage.getValue("diyCss", function (obj) {
                sendResponse({
                    result: Util.opt(true, obj["diyCss"])
                });
            });
            return true;
        case "blockPerson":
            Background.isBlockEnabled(function(isBlockEnabled) {
                if (!isBlockEnabled) {
                    sendResponse({
                        result: Util.opt(false, "没有启用屏蔽用户功能。")
                    });
                    return true;
                }

                Background.blockPerson(request.id, request.name, function(result) {
                    sendResponse({
                        result: result
                    });
                });
            });
            return true;
        case "getBlockedPerson":
            Background.isBlockEnabled(function(isBlockEnabled) {
                if (!isBlockEnabled) {
                    sendResponse({
                        result: Util.opt(true, [])
                    });
                    return true;
                }

                Background.getBlockedPerson(function (result) {
                    sendResponse({
                        result: Util.opt(true, result)
                    });
                });
            });
            return true;
        default:
            sendResponse({});
            break;
    }
});