var Util = {};

Util.opt = function(result, msg) {
    return {
        result: result,
        msg: msg
    };
};

Util.nodeListToArray = function(nodeList) {
    return Array.prototype.slice.call(nodeList);
};

Util.cookie = {
    getCookie: function(url, cookieName, callback) {
        if (!chrome.cookies) {
            chrome.cookies = chrome.experimental.cookies;
        }
        chrome.cookies.get({
            "url": url,
            "name": cookieName
        }, function(cookie) {
            if (callback) {
                callback(cookie);
            }
        });
    }
};

Util.storage = {
    isEmpty: function(obj) {
        return Object.keys(obj).length === 0;
    },

    getValue: function(key, callback) {
        chrome.storage.sync.get(key, function(items) {
            if (callback) {
                callback(items);
            }
        });
    },

    /**
     * NOTICE: here we may got some errors due to the storage maxium size limit
     */
    setValue: function(key, value, callback) {
        var object = {};
        object[key] = value;
        chrome.storage.sync.set(object, function() {
            var result = null;
            if (chrome.extension.lastError) {
                result = Util.opt(false, 'An error occurred: ' + chrome.extension.lastError.message);
            }
            result = Util.opt(true, (key + ' saved.'));

            if (callback) {
                callback(result);
            }
        });
    }
};

Util.url = {
    getUrl: function(url) {
        if (url.indexOf("?") > -1) {
            url = url.substr(0, url.indexOf("?"));
        }
        return url;
    },

    getParam: function(url, name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },

    setParam: function(url, name, value) {
        url += (url.split('?')[1] ? '&' : '?') + (name + "=" + value);
        return url;
    },

    getParams: function(url) {
        //TODO
    }
};