var Setup = {};

Setup.attrMap = {
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
    var options = ["messageOption", "blockOption", "diyCssDisplay", "blockedPerson"];

    // load messageOption
    Util.storage.getValue(options[0], function(obj) {
        var value = !Util.storage.isEmpty(obj) ? obj[options[0]] : true;
        document.querySelector("input[name=" + options[0] + "][value=" + value +"]").setAttribute("checked", true);

        Object.keys(Setup.attrMap).forEach(function(key) {
            Setup.createNotificationCheckBox(key, Setup.attrMap[key], document.getElementById("notification"))
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

Setup.createNotificationCheckBox = function(value, displayName, parent) {
	var label = document.createElement("label");
	label.className = "my-label";
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "notificationCheckBox";
    checkBox.value = value;
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
    Setup.registerRadioHandler();
    Setup.registerDiyCssHandler();
});