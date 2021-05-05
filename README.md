# Eclipse Javascript application

***

**Eclipse** is an application to be run standalone and offline in a web browser. The data is approximate, the times are in Universal Time and rounded to 1 minute, and the magnitudes to 1 percent, so it is not as accurate as the >NASA site of Fred Espenak](https://eclipse.gsfc.nasa.gov/eclipse.html). It is based upon the _Tables of Moon and Sun (Kessel-Lo: Kesselberg Sterrenwacht, 1962)_ and _Astronomical Formulae for Calculators (1979), 1st ed, ISBN 0-943396-22-0_.

Originally I have written it in [Fortran](https://en.wikipedia.org/wiki/Fortran) and then translated it into [C][https://en.wikipedia.org/wiki/C \(programming language\)) and adding graphic representation of eclipse phases and solar eclipse world maps. Years later when Javascript became common in browsers I translated it again in Javacript, first just the calculations with numeric output. Later on, I used the Javascript Canvas to implement the graphical representations for which I translated the C code to Javascript and making Canvas basic graphing routines. I found a Worldmap and d3.v3.js to add the worldmap for plotting solar eclipse areas. In the meantime I jQueryfied much code as well, as it is much easier then plain Javascript.


### Contents
- eclipse.html (main app containing layout and calculations in Javascript
- worldmap folder containing Javascript plotting code and json code with coastlines and country borders (got from the internet in 2013, source is probably gone)
- general.js containing basic (spherical) trigonometic and other functions
- style.css (some extra css, however most i defined withing the main eclipse.html).

Location data is stored in browser local storage (not cookies).
When location data is filled in (or can be obtained from GPS or browser location if supported and location is enabled), local circumstances are displayed as well.
- Solar eclipses: start, maximum phase and end, all shown with altitude at location.
- Lunar eclipses: the approximate altitude of the Moon is shown at each phase when above local horizon. When below horizon, the phase data is grayed out.
Clicking on the solar eclipse world map (with a crosshair icon) on a location within the (pen)umbral area shows the solar eclipse as it appears at that location.

### Installation

Download the Zip file and unzip it into the desired folder. If you have a web server, you should in install in a folder under the Document root folder of the Apache / Lighttpd. When using as a 'local' html (without a local web server) file you can just open 'eclipse.html' with a web browser.
Note for iOS: In iOS there is no shared folder, so you should use an app which has a builtin file browser and web browser within its sandbox, e.g.[Readdie Documents] (https://apps.apple.com/app/id364901807) (free, iPhone and iPad), but there are more similar free or paid file manager apps. There you can unzip the aforementioned zip in the folder within Documents you wish.

### For Devs and Contributors
_NOTE :_ This code is a result from years of development and translation, so it has gone rather spaghetti. Most parts use the rather standard indentation rule of four spaces per indentation, braces at end of line (except function definitions) and braces around a single conditional line of code. A few parts still contain old style two spaces per indent and single line conditional code not in braces.

The function p_r() does nothing but when [https://github.com/freebrowser1/jsdebug](debug.js) is included, this function calls console.log() when the debug command line ?d=1 is added after the URL. In that case, a popup window can be opened when clicking on the red text "JS DEBUG" on top left which even works when using a browser without element inspector (e.g. an Android or iOS browser).

The world map for plotting solar eclipse charts is rendered by d3.v3.js, here I still use a modified 2013 version which is adequate for this app. Modified, because the original version uses XMLHttpRequest() which is not supported in local file:/// html / javascript files as it issues a _Cross-Origin Request Blocked:(Reason: CORS request not http)_ in most modern browsers. So I included the worldmap JSON as if it were an included javascript file and that works in both http(s) and local file access.
