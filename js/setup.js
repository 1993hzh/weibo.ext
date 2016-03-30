var Setup = {};

Setup.showResult = function(result) {
    var success = document.getElementById("success");
    var fail = document.getElementById("fail");

    var show = function(node, msg) {
        node.style.display = "block";
        node.innerHTML = msg;
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
    var options = ["messageOption", "blockOption", "diyCss", "blockedPerson"];

    // load messageOption
    Util.storage.getValue(options[0], function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            document.querySelector("input[name=" + options[0] + "][value=" + obj[options[0]] + "]").setAttribute("checked", true);
        }
    });

    // load blockOption
    Util.storage.getValue(options[1], function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            document.querySelector("input[name=" + options[1] + "][value=" + obj[options[1]] + "]").setAttribute("checked", true);
        }
    });

    // load diy css
    Util.storage.getValue(options[2], function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            document.getElementById(options[2]).innerHTML = obj[options[2]];
        }
    });

    // load blocked person
    Util.storage.getValue(options[3], function(obj) {
        if (!Util.storage.isEmpty(obj)) {
            var person = obj[options[3]];
            var targetNode = document.getElementById(options[3]);
            for (i in person) {
                var newNode = Setup.createBlockNodes(person[i].id, person[i].name);
                targetNode.appendChild(newNode);
            }
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

Setup.registerDiyCssHandler = function() {
    var diyCss = document.getElementById("diyCss");
    if (!diyCss) {
        Setup.showResult(Util.opt(false, "Cannot find diy css here."));
        return;
    }

    // register double click handler
    diyCss.addEventListener("dblclick", function(e) {
        e.currentTarget.setAttribute("contentEditable", true);
        e.currentTarget.focus();
    }, false);

    // register onblur handler
    diyCss.addEventListener("blur", function(e) {
        e.currentTarget.setAttribute("contentEditable", false);
        Util.storage.setValue("diyCss", diyCss.innerHTML, Setup.showResult);
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

    Setup.registerRadioHandler();
    Setup.registerDiyCssHandler();
});