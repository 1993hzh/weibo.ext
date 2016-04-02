var Background = {};

Background.attrMap = {
    "status": "新微博未读数",
    "follower": "新粉丝数",
    "cmt": "新评论数",
    "dm": "新私信数",
    "mention_status": "新提及我的微博数",
    "mention_cmt": "新提及我的评论数",
    "group": "微群消息未读数",
    "private_group": "私有微群消息未读数",
    "notice": "新通知未读数",
    "invite": "新邀请未读数",
    "badge": "新勋章数",
    "photo": "相册消息未读数",
    "msgbox": "{{{3}}}（这什么我也不知道啊！新浪API说明就是这个鬼啊摔！）"
};

Background.unreadMsg = {
    notificationId: "",
    source: null,
    checkTime: 15 * 60 *  1000,
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

Background.scheduleGetUnreadMsgJob = function() {
    setInterval(function() {
        var notification = new Notification(Background.unreadMsg.baseUrl, Background.unreadMsg.source, Background.unreadMsg.notificationId);
        notification.execute();
        notification = null;
    }, Background.unreadMsg.checkTime);
}();

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