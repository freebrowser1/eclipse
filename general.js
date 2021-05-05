//***************************************************************
function hmstring(t, accuracy, type)
{
    var prefix = '';
    var allseconds = Math.abs(t*3600);
    if (accuracy == 1)
        allseconds += 30;
    else if (accuracy == 2)
        allseconds += 3;
    else if (accuracy == 3)
        allseconds += 0.5;
    var seconds = allseconds % 60;
    var minutes = Math.floor(((allseconds - seconds) / 60)%60);
    var hours   = Math.floor(allseconds/3600)
    hmstr = hours + ":" + pad(minutes,2,"0");
    if (accuracy == 2)
        hmstr += '.' + Math.floor(seconds/6);
    else if (accuracy == 3)
        hmstr += ":" + pad(""+Math.floor(seconds),2,"0");
    if (arguments.length == 2)
        return (t < 0 ? '-' : '') + hmstr;
    else if (type == 1)
        return hmstr + (t < 0 ? ' S' : ' N');
    else if (type == 2)
        return hmstr + (t < 0 ? ' W' : ' E');
}


/*
 * Return parameter value of name (case sensitive !)
 */
function get_value(parametername)
{
    readvalue=(location.search ? location.search.substring(1) : false);

    if (readvalue)
    {
       parameter=readvalue.split('&');
       for (i=0; i<parameter.length; i++)
       {
           if (parameter[i].split('=')[0] == parametername)
             return parameter[i].split('=')[1];
       }
    }
    return false;
}

function showhide(id, on)
{
   var disp_id = document.getElementById(id);
   if (arguments.length < 2 || on == -1) on = (disp_id.style.display != 'block');

   if (on)
       disp_id.style.display = 'block';
   else
       disp_id.style.display = 'none';
//   var textid = document.getElementById("text_" + id);
   return disp_id.style.display;
}

//document.write("<input type=text onchange=\"alert(zhmstring(this.value,1)+ ',' + zhmstring(this.value,2)+ ','+zhmstring(this.value,3));\">");

function getaltazimuth(theta, lat, alfa, delta) {
    var alt = sphsin(lat, delta, alfa-theta);

    var azymuth = range(sphcos(alt, lat, delta, range(alfa-theta) >= 180 ? -1 : 1));
    return new Array(alt, azymuth);
}


function dsin(x) {
    if (x==0) return 0;  // Dolphin sometimes returns 0.467...
    return Math.sin((Math.PI / 180) * x)
    }

function dcos(x) {
    if (x==0) return 1;  // Dolphin sometimes returns 0.88...
    return Math.cos((Math.PI / 180) * x)
    }

function dtan(x) {
    if (x==0) return 0;  // Dolphin sometimes returns 0.467...
    return Math.tan((Math.PI / 180) * x)
    }

function dasin(x) {
    return (180/ Math.PI) * Math.asin(x)
    }

function dacos(x) {
    return (180/ Math.PI) * Math.acos(x)
    }

function datan(x) {
    return (180/ Math.PI) * Math.atan(x)
    }

function datan2(y, x) {
    var a;
    if ((x == 0) && (y == 0)) {
        return 0;
        }
    else    {
        a = datan(y / x);
        if (x < 0) {
            a = a + 180;
            }
        if (y < 0 && x > 0) {
            a = a + 360;
            }
        return a;
        }
    }

function ipart(x) {
    var a;
    if (x> 0) {
        a = Math.floor(x);
        }
    else {
        a = Math.ceil(x);
        }
    return a;
    }

function sphsin(a,b,gamma) {
    return dasin(dsin(a) * dsin(b) + dcos(a) * dcos(b) * dcos(gamma));
}

function sphcos(alpha,beta,c, sgn) {
    return sgn * dacos(dsin(c) / (dcos(alpha)*dcos(beta)) - dtan(alpha)*dtan(beta));
}

function range(x, therange, offset)
{
  var a, b;
  if (arguments.length < 2) therange = 360;
  if (arguments.length < 3) offset = 0;
  b = x / therange;
  a = therange * (b - ipart(b));
  if (a  < 0 ) {
    a = a + therange;
  }
  return a
}

//
// round rounds the number num to dp decimal places
// the second line is some C like jiggery pokery I
// found in an O'Reilly book which means if dp is null
// you get 2 decimal places.
//
function round(num, dp)
{
   if (dp == 0) return Math.round(num);
   num = Math.round (num * Math.pow(10, dp))  / Math.pow(10, dp);
   var x = Math.abs(num);
   var s = num < 0 ? '-' : '';
   s += (Math.floor(x) + '.');
   x = Math.floor(Math.pow(10, dp) * (x - Math.floor(x)) + 0.5);
   s += pad(x.toString(),dp, '0');
   return s;

//   return Math.round (num * Math.pow(10, dp)) / Math.pow(10, dp);
}


//alert(round(123.34567788,4) + ' ' + round(-123.34567788,4) + ' ' + round(0,4) + ' ' + round(123,4) + ' ' + round(123.34567788,1) + ' ' + round(-0.0034567788,4));


// parsefield converts deg:min:sec or hr:min:sec to a number

function parsefield(field) {
  var str = field.value;
  var res = 0;
  if (str != undefined)
      cleanupfield(field);
  else
      str = field;
  if (str.indexOf('.') >= 0) {
     res = str * 1;
     if (!isNaN(res)) return res;
        else return 0;
  }
  var col1=str.indexOf(":");
//  if (col1 < 0) col1=str.indexOf("*");
  var col2=str.lastIndexOf(":");
//  if (col2 < 0) col2=str.lastIndexOf("*");
  if (col1 < 0) return parseInt(str);
  if (str.substring(0,1) == "-") {
    res=parseInt(str.substring(1,col1),10);
  } else {
    res=parseInt(str.substring(0,col1),10);
  }
  if (col2 > col1) {
    res+=(parseInt(str.substring(col1+1,col2),10)/60.0) +
         (parseInt(str.substring(col2+1,str.length),10)/3600.0);
  } else {
    res+=(parseInt(str.substring(col1+1,str.length),10)/60.0);
  }
  if (str.substring(0,1) == "-") {
    return -res;
  } else {
    return res;
  }
}

function cleanupfield(field)
{
  var str = field.value;

  // - key not accessible in phone
  str = str.replace(/^[\*#]/g,"-");
  str = str.replace(/[\*#]/g,":");
  field.value = str;
}


/*  PAD  --  Pad a string to a given length with a given fill character.  */

function pad(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
        s = padwith + s;
    }
    return s;
}


/*
   Netfront 3.0 has a bug in which String.fromCharCode(x) returns an empty string
   instead of the character with the code x.
   This workaround, use this instead on unescape().
   */
function unescape_u(x)
{
    if (navigator.appName != 'ACCESS NetFront' || navigator.appVersion != '3.0')
        return unescape(x);

    x = x.replace(/%u([0-9A-F][0-9A-F])[0-9A-F][0-9A-F]/g, "%$1");
    var z="",y,ind;

    y = x;
    while ((ind = y.indexOf('%')) >= 0)
    {
          z += y.substr(0,ind) + eval("\"\\u" + y.substr(ind+1,2) + "00\"");
          y = y.substr(ind+3);
    }
    z += y;
    return z;
}


function clearCookie()
{
   var expDays = -1;
   var exp = new Date();
   exp.setTime(exp.getTime() - 86400000);
   document.cookie = "; expires=" + exp.toGMTString();
}
