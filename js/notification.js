function Notification(baseUrl, source, notificationId) {
    this.baseUrl = baseUrl;
    this.source = source;
    this.notificationId = notificationId;
}

Notification.prototype.execute = function() {
    var self = this;
    self.retrieveUnreadMsg();

    // Currently the tabs open has defects. So deprecated it now.
    // chrome.notifications.onClicked.addListener(function(notificationId) {
    //     self.createTab();
    // });
};

Notification.prototype.retrieveUnreadMsg = function() {
    var self = this;

    if (!self.baseUrl) {
        console.log("retrieveUnreadMsg is invoked, however, no url provided, it should not be happened.");
        return false;
    }
    if (!self.source) {
        console.log("Did not find any source from url, check it.");
        return false;
    }
    var targetURL = Util.url.setParam(self.baseUrl, "source", self.source);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", targetURL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            self.parseUnreadJSON(xhr.responseText);
        }
    };
    xhr.send();
};

Notification.prototype.parseUnreadJSON = function(json) {
    var self = this;
    var isCreateNotification = false;
    var message = "";

    json = JSON.parse(json);
    var getNotifications = function(array) {
        array.forEach(function(key) {
            if (json[key] && json[key] > 0) {
                isCreateNotification = true;
                message += Global.attrMap[key] + ": " + json[key] + "\n";
            }
        });

        if (isCreateNotification) {
            console.log(new Date() + ": decide to send a notification.");
            self.createNotification(message.substring(0, message.lastIndexOf("\n")));
        } else {
            console.log(new Date() + ": no notification to send.");
        }
    };
    Background.getNotificationKeys(getNotifications);
};

Notification.prototype.createTab = function(callback) {
    chrome.tabs.create({
        url: "http://weibo.com/"
    }, function(tab) {
        if (callback) {
            callback();
        }
    });
};

Notification.prototype.createNotification = function(msg, callback) {
    var self = this;

    var options = {
        type: "basic",
        iconUrl: "img/favicon48.png",
        title: "您的微博有新提醒，请及时查看。",
        message: msg,
        isClickable: true
    };

    var upsert = function(nId, options, callback) {
        if (nId) {
            return chrome.notifications.update(nId, options);
        } else {
            return chrome.notifications.create(nId, options, callback);
        }
    };

    upsert(self.notificationId, options, function(notificationId) {
        Background.unreadMsg.notificationId = notificationId;
    });
};