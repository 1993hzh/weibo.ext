var Util = {};

Util.opt = function(result, msg) {
    return {
        result: result,
        msg: msg
    };
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

Util.file = {
    read: function(path, callback) {
        chrome.fileSystem.chooseEntry({
            type: 'openFile'
        }, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    var text = this.result;
                    console.log(text);
                    if (callback) {
                        callback(text);
                    }
                };
                reader.readAsText(file);
            });
        });
    },

    write: function() {

    }
};