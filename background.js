var Background = {};

Background.scheduledJob = null;

Background.getNotificationKeys = function(callback) {
    Util.storage.getValue("notificationOptions", function (obj) {
        var array = obj["notificationOptions"] || [];
        if (callback) {
            callback(array);
        }
    });
};

Background.unreadMsg = {
    notificationId: "",
    source: null,
    baseUrl: "https://rm.api.weibo.com/2/remind/unread_count.json"
};

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

/**
 * Since chrome does not allow developers to get the response body of webrequest
 * we have to do such a trick, sigh...
 */
Background.retrieveSource = function(details) {
    if (details && details.url && !Background.unreadMsg.source) {
        Background.unreadMsg.source = Util.url.getParam(details.url, "source");
    }
};

Background.cancelJob = function() {
    // if the job already exists, clear it
    if (Background.scheduledJob) {
        console.log(new Date() + ": clear scheduled job.");
        clearInterval(Background.scheduledJob);
    }
};

Background.scheduleGetUnreadMsgJob = function() {
    Background.cancelJob();

    var job = function() {
        var notification = new Notification(Background.unreadMsg.baseUrl, Background.unreadMsg.source, Background.unreadMsg.notificationId);
        console.log(new Date() + ": check job start.");
        notification.execute();
        console.log(new Date() + ": check job end.");
        notification = null;
    };

    Util.storage.getValue("checkTime", function(checkTime) {
        var time = checkTime["checkTime"] || 15;
        console.log(new Date() + ": scheduled a job, check per " + time * 60 + " seconds.");
        Background.scheduledJob = setInterval(job, time * 1000 * 60);
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

chrome.webRequest.onCompleted.addListener(function(details) {
    Background.retrieveSource(details);
}, {
    urls: ["*://rm.api.weibo.com/2/remind/*"]
}, []);


document.addEventListener("DOMContentLoaded", function(event) {
    Util.storage.getValue("messageOption", function(obj) {
        var isMessageOptionEnabled = obj["messageOption"];
        if (isMessageOptionEnabled && isMessageOptionEnabled !== "false") {
            Background.scheduleGetUnreadMsgJob();
        } else {
            console.log("MessageOption is not enabled.");
        }
    });
});