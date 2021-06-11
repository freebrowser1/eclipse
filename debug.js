/**
  Debugging of Javascript
  No jQuery required.
  When appending 'd=1' after the URL, a debug button will appear on the website and when clicked on it, debug output is shown as overlay over the webpage. Click again or double click on the debug output to hide it.
*/

var g_d = location.href.match(/\bd\=[1-9]/); // || localStorage.getItem("_jsdebug");

var _jsdebug_callback = function(later) {
    var consolelog = console.info;  // avoid console.log because of cyclic recursion of console.log !!
    var consoletrace = console.trace;
    var origconsole = console;

    var jsonify=function(o){
        var seen=[];
        try {
            var jso=JSON.stringify(o, function(k,v){
                if (typeof v =='object') {
                    if ( !seen.indexOf(v) ) { return '__cycle__'; }
//console.info(v)
                    seen.push(v);
                } return v;
            });
            return jso;
        } catch (err) {
            return o.toString()
        }
    };
    //https://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
    function getStackTrace () {
        let stack = new Error().stack || '';
        stack = stack.split('\n').map(function (line) { return line.trim(); });
        return stack.splice(stack[0] == 'Error' ? 2 : 1);
    }

    function __translatestack(stacktrace)
    {
        let h = stacktrace.indexOf('@');
        let file = stacktrace;
        let func = "[anonymous]";
        if (h > 0) {
            func = stacktrace.substr(0,h);
            file = stacktrace.substr(h);
        }
        if (navigator.userAgent.indexOf("Safari") != -1)  { // Webkit
            let f = false;
            if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome / Brave / etc.
                f = file.substr(3).match(/^(.+?)\s+(\S+)\?.+?:(\d+)/);
            } else {  // Apple Safari
                // @http://localhost/strato/startpage/ephemeris/safaritest.html?d=1&clear=&clearhistory=&157993143794700141#:228:8
                f = file.match(/^((\S+?)\?.+?:(\d+))/);
                if (f) {
                    f[1] = func;  // f[5] = function, f[3] = line number
                }
            }
            if (!f) {  // occurs in Brave in beginning only
                return (file + " " + func + "(): " );
            }
            file = f[2];
            let parts = file.split("/");
            file = parts[parts.length-1] + " " + f[3];
            func = f[1];
        } else if (navigator.userAgent.indexOf("Firefox") != -1) {  // Firefox ?
            file = file.replace(/^.+?\/([^\/]+?)(\?.*?)?(\d+:\d+)$/, "$1 $3");
            file = file.replace(/(.+?)(\d+):\d+$/, "$1 $2");
        }
        let out = (file + " " + func + "(): " );
        return out;
    }

    function __makehtml(output,raw)
    {
        if (typeof(output) == "string") {
            output = output.replace(/&/g, '&amp;');
            output = output.replace(/\x3C/g, '&lt;');
            output = output.replace(/>/g, '&gt;');
            //output = output.replace(/\n/g, '<br />');
        }
        if (typeof(raw) == 'undefined' || !raw) {
            return jsonify(output) + "\n";
        } else {
            return jsonify(output) + "\n";
//            return output;
        }
    }

    console.log = function() {
        // you may do something with side effects here.
        // log to a remote server, whatever you want. here
        // for example we append the log message to the DOM
//        p.innerText = JSON.stringify(args);
//        // call the original console.log function
        console._log(1, arguments);
    }

    console.trace = function(title, level)
    {
        consoletrace.apply();   // call original function
        let params = getStackTrace();
        let stackline = new Array();
        if (typeof level == 'undefined') {
            level = 0;
        }
        for (var i in params) {
            if (i>level) {
                stackline.push(__translatestack(params[i]));
            }
        }
        var str = "\n" + stackline.join("\n");
        if (g_d) {
            if (arguments.length < 1) {
                title = "";
            }
            g_d.innerHTML += (`\n** START TRACE ${title}**` + __makehtml(str) + "\n** END TRACE **\n\n");
        }
    }

    console._log = function(level, params)
    {
        stacktrace = getStackTrace()[level+1];
        let out = __translatestack(stacktrace);
        let output = params;
//console.info(params);
        if (params.length == 1) {
            output = params[0];
        }

        consolelog(out,output);
        if (g_d) {
            g_d.innerHTML += out + __makehtml(output,1) + "\n";
        }
    }

    window.onerror = function () {
        if (g_d) {
            g_d.innerHTML += "ERROR: " + jsonify(arguments) + "\n";
        }

    }
    if (g_d) {
        var h = document.getElementsByTagName('head').item(0);
        var s = document.createElement("style");
        s.type = "text/css";
        s.appendChild(document.createTextNode("pre#js_debug { \
        border: solid black 2px;  display:none; position:fixed; top: 20px;\
        font-family: Lucida Console, monospace; background-color: white; color: black; font-size: 9pt; height: 400px; overflow:scroll; width:calc(100% - 20px);\
        white-space: pre-wrap; word-wrap: break-word; z-index:10000;\
        } \
        #js_debugclick { \
          color:red; font-weight:bold; z-index:10001; position:fixed; left: 30px; padding: 2px; background: rgba(128,128,128, .5); \
        } \
        "));
        h.appendChild(s);
        _toggleelement = function (elementid)
        {
            var u = document.getElementById(elementid);
            //console.info(u.style.display);
            if (u.style.display != 'none') {
                u.style.display = 'none';
            } else {
                u.style.display = 'block';
            }
        }
        var body = document.getElementsByTagName('body');
        _adddebug = function()
        {
            if (!document.getElementById('js_debug')) {
                //console.info(document.getElementsByTagName('body')[0]);
                document.getElementsByTagName('body')[0].insertAdjacentHTML("afterbegin",
                "<div class=\"js_debug\" id=\"js_debugclick\" onclick=\"_toggleelement('js_debug')\">JS DEBUG</div>\
        <pre id='js_debug'  style=\"display:none;\" ondblclick=\"_toggleelement('js_debug');\"></pre>\n");
                g_d = document.getElementById('js_debug');
            }
        }
        if (typeof(later) != "undefined") {
            window.addEventListener('load', (event) => {
                _adddebug();
                ///console.info('page is fully loaded');
            });
        } else {
            _adddebug();
        }
    }

};
/*
// only when jQuery is loaded (optional !) does not load earlier
if (typeof($) != 'undefined' && typeof($.fn.jquery) != 'undefined') {
    $(document).ready(function() {
        _jsdebug_callback();
    });
}
else */
if (document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    _jsdebug_callback();
} else {
    document.addEventListener("DOMContentLoaded", _jsdebug_callback);
}

function p_r()
{
    if (!g_d) return;
    if (arguments[0] == "__STACK__") {
        console.trace("p_r", 1);
        return;
    }
    if (typeof console._log != 'undefined') {
        console._log(1, arguments);
    } else {
        console.log(arguments);
    }
}
if (g_d) {
    var __moredebug = location.href.match(/\bd\=[2-9]/);
//    if (__moredebug) console.log(["which", __iswebkit, __ischrome, __issafari, __isopera, __isfirefox]);
}
