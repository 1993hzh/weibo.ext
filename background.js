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

Background.getBlockedPerson = function (id, name, callback) {
    Util.storage.getValue("blockedPerson", function (obj) {
        var blockedPerson = Util.storage.isEmpty(obj) ? [] : obj["blockedPerson"];
        if (callback) {
            callback(blockedPerson);
        }
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method) {
        case "getCSS":
            Util.storage.getValue("diyCss", function (obj) {
                sendResponse({
                    css: obj["diyCss"]
                });
            });
            return true;
        case "blockPerson":
            Background.blockPerson(request.id, request.name, function (result) {
                sendResponse({
                    result: result
                });
            });
            return true;
        case "getBlockedPerson":
            Background.getBlockedPerson(request.id, request.name, function (result) {
                sendResponse({
                    result: Util.opt(true, result)
                });
            });
            return true;
        default:
            sendResponse({});
            break;
    }
});