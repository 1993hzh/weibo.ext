var background = {};

background.blockPerson = function(id, name, callback) {
    Util.storage.getValue("blockedPerson", function(obj) {
        var blockedPerson = Util.storage.isEmpty(obj) ? [] : obj["blockedPerson"];
        blockedPerson.push({
            id: id,
            name: name
        });
        Util.storage.setValue("blockedPerson", blockedPerson, callback);
    });
};

background.getBlockedPerson = function(id, name, callback) {
    Util.storage.getValue("blockedPerson", function(obj) {
        var blockedPerson = Util.storage.isEmpty(obj) ? [] : obj["blockedPerson"];
        if (callback) {
            callback(blockedPerson);
        }
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.method) {
        case "getCSS":
            Util.storage.getValue("diyCss", function(obj) {
                sendResponse({
                    css: obj["diyCss"]
                });
            });
            return true;
        case "blockPerson":
            background.blockPerson(request.id, request.name, function(result) {
                sendResponse({
                    result: result
                });
            });
            return true;
        case "getBlockedPerson":
            background.getBlockedPerson(request.id, request.name, function(result) {
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