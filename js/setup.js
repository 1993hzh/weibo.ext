var Setup = {};

Setup.showResult = function(result) {
    var success = document.getElementById("success");
    var fail = document.getElementById("fail");

    var createCloseNode = function() {
        var close = document.createElement("i");
        close.setAttribute("class", "fa fa-times pull-right");
        close.style.cursor = "pointer";
        close.addEventListener("click", function(e) {
            e.currentTarget.parentElement.style.display = "none";
        }, false);;
        return close;
    };

    var show = function(node, msg) {
        node.style.display = "block";
        node.textContent = msg;
        node.appendChild(createCloseNode());
    };

    var hide = function(node) {
        node.style.display = "none";
    };

    if (!result.result) {
        hide(success);
        show(fail, result.msg);
    } else {
        hide(fail);
        show(success, result.msg);
    }
};

Setup.load = function() {
    var options = ["messageOption", "blockOption", "diyCssDisplay", "blockedPerson", "notificationOptions", "checkTime"];

    // load messageOption
    Util.storage.getValue(options[0], function(obj) {
        var value = !Util.storage.isEmpty(obj) ? obj[options[0]] : true;
        document.querySelector("input[name=" + options[0] + "][value=" + value +"]").setAttribute("checked", true);
        if (value === "false") {
            document.getElementById("notification").style.display = "none";
        }

        Util.storage.getValue(options[4], function(notification) {
            var array = notification[options[4]];
            Object.keys(Global.attrMap).forEach(function(key) {
                Setup.createNotificationCheckBox(key, Global.attrMap[key], document.getElementById("notification"), array && array.indexOf(key) !== -1)
            });
        });

        Util.storage.getValue(options[5], function(checkTime) {
            var time = checkTime[options[5]];
            if (time) {
                document.getElementById("checkTime").value = time;
            } else {
                document.getElementById("checkTime").value = "15";
            }
        });
    });

    // load blockOption
    Util.storage.getValue(options[1], function(obj) {
        var value = !Util.storage.isEmpty(obj) ? obj[options[1]] : true;
        document.querySelector("input[name=" + options[1] + "][value=" + value + "]").setAttribute("checked", true);

        // load blocked person
        Util.storage.getValue(options[3], function(obj) {
            if (!Util.storage.isEmpty(obj)) {
                var person = obj[options[3]];
                var targetNode = document.getElementById(options[3]);
                if (value === "false") {
                	targetNode.style.display = "none";
                }
                for (i in person) {
                    var newNode = Setup.createBlockNodes(person[i].id, person[i].name);
                    targetNode.appendChild(newNode);
                }
            }
        });
    });

    // load diy css
    Setup.loadDiyCSS(options[2]);
};

Setup.loadDiyCSS = function(name) {
	Util.storage.getValue(name, function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            document.getElementById("diyCss").innerHTML = obj[name];
        }
    });
};

Setup.registerRadioHandler = function() {
    var radios = document.querySelectorAll("input[type='radio']");
    if (!radios) {
        Setup.showResult(Util.opt(false, "Cannot find any radios here."));
        return;
    }
    var radioArray = Util.nodeListToArray(radios);
    radioArray.forEach(function(r) {
        r.addEventListener("click", function(e) {
            var key = e.currentTarget.getAttribute("name");
            var value = e.currentTarget.getAttribute("value");
            Util.storage.setValue(key, value, Setup.showResult);
        }, false);
    });
};

Setup.registerMessageOptionHandler = function() {
    var messageOptions = document.getElementsByName('messageOption');
    if (!messageOptions) {
        Setup.showResult(Util.opt(false, "Cannot find messageOption here."));
        return;
    }
    var messageOptionArray = Util.nodeListToArray(messageOptions);
    messageOptionArray.forEach(function(r) {
        r.addEventListener("change", function(e) {
            var value = e.currentTarget.getAttribute("value");
            var div = document.getElementById("notification");
            if (value === "false") {
                div.style.display = "none";
            } else {
                div.style.display = "block";
            }
        }, false);
    });
};

Setup.registerBlockOptionHandler = function() {
    var blockOptions = document.getElementsByName('blockOption');
    if (!blockOptions) {
        Setup.showResult(Util.opt(false, "Cannot find blockOption here."));
        return;
    }
    var blockOptionArray = Util.nodeListToArray(blockOptions);
    blockOptionArray.forEach(function(r) {
        r.addEventListener("change", function(e) {
            var value = e.currentTarget.getAttribute("value");
            var div = document.getElementById("blockedPerson");
            if (value === "false") {
            	div.style.display = "none";
            } else {
            	div.style.display = "block";
            }
        }, false);
    });
};

Setup.registerDiyCssHandler = function() {
    var diyCss = document.getElementById("diyCss");
    var cancel = document.getElementById("cancel");
    var save = document.getElementById("save");
    if (!diyCss) {
        Setup.showResult(Util.opt(false, "Cannot find diy css here."));
        return;
    }

    var enableButtons = function() {
        save.removeAttribute("disabled");
        cancel.removeAttribute("disabled");
    };

    var disableButtons = function() {
    	save.setAttribute("disabled", "disabled");
        cancel.setAttribute("disabled", "disabled");
    };

    // register double click handler
    diyCss.addEventListener("dblclick", function(e) {
        e.currentTarget.setAttribute("contenteditable", true);
        e.currentTarget.focus();
        enableButtons();
    }, false);

    // register cancel handler
    cancel.addEventListener("click", function(e) {
        Setup.loadDiyCSS("diyCssDisplay");
        diyCss.setAttribute("contenteditable", false);
        disableButtons();
    }, false);

    // register save handler
    save.addEventListener("click", function(e) {
        diyCss.setAttribute("contenteditable", false);
        Util.storage.setValue("diyCss", diyCss.textContent, Setup.showResult);
        Util.storage.setValue("diyCssDisplay", diyCss.innerHTML, Setup.showResult);
        disableButtons();
    }, false);
};

Setup.registerCheckBoxHandler = function(checkbox) {
    checkbox.addEventListener("change", function(e) {
        var self = this;
        var target = e.target;
        var value = target.getAttribute("value");
        Util.storage.getValue("notificationOptions", function(obj) {
            var array = obj.notificationOptions || [];
            var index = array.indexOf(value);
            if (target.checked && index === -1) {
                array.push(value);
            } else if (!target.checked && index !== -1) {
                array.splice(index, 1);
            }
            Util.storage.setValue("notificationOptions", array, Setup.showResult);
        });
    }, false);
};

Setup.registerCheckTimeHandler = function() {
    var saveTime = document.getElementById("saveTime");
    if (!saveTime) {
        console.log("No button named saveTime found.");
        return false;
    }
    saveTime.addEventListener("click", function(e) {
        var value = document.getElementById("checkTime").value;
        if (!value) {
            console.log("No input named checkTime found.");
            return false;
        }
        if (value <= 0) {
            Setup.showResult(Util.opt(false, "检查时间不能小于等于0."));
            return false;
        }
        Util.storage.setValue("checkTime", value, Setup.showResult);
        // here we need to reschedule the job
        // actually we need to first check if the messageOption is really enabled
        chrome.extension.getBackgroundPage().Background.scheduleGetUnreadMsgJob();
    }, false);
};

Setup.close = function(e) {
    var targetNode = e.currentTarget.parentElement;
    var id = targetNode.getAttribute("id");
    if (!id) {
        Setup.showResult(Util.opt(false, "No target id found."));
        return false;
    }
    Util.storage.getValue("blockedPerson", function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            var blockedPersonNew = obj["blockedPerson"].filter(function(person) {
                return person.id != id;
            });
            Util.storage.setValue("blockedPerson", blockedPersonNew, Setup.showResult);
            targetNode.remove();
        }
    });
};

Setup.createNotificationCheckBox = function(value, displayName, parent, isChecked) {
	var label = document.createElement("label");
	label.className = "my-label";
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "notificationCheckBox";
    checkBox.value = value;
    checkBox.checked = isChecked;
    Setup.registerCheckBoxHandler(checkBox);
    label.appendChild(checkBox);

	label.appendChild(document.createTextNode(displayName));
    parent.appendChild(label);
};

Setup.createBlockNodes = function(id, name) {
    var span = document.createElement("span");
    span.setAttribute("class", "label label-default");
    span.setAttribute("id", id);
    var text = document.createTextNode(name);
    span.appendChild(text);

    var href = document.createElement("a");
    href.setAttribute("href", "javascript:void(0)");
    href.setAttribute("class", "blockedPersonHref closed");
    href.addEventListener("click", Setup.close, false);

    var fa = document.createElement("i");
    fa.setAttribute("class", "fa fa-times");

    href.appendChild(fa);
    span.appendChild(href);
    return span;
};

document.addEventListener("DOMContentLoaded", function(event) {
    Setup.load();
    // prettyPrint();
    // document.getElementById("diyCss").setAttribute("class", "prettyprint lang-css");

    Setup.registerBlockOptionHandler();
    Setup.registerMessageOptionHandler();
    Setup.registerRadioHandler();
    Setup.registerDiyCssHandler();
    Setup.registerCheckTimeHandler();
});