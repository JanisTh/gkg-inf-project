///////////////////
// CONFIGURATION //
///////////////////


// Path of the page directory
const pagesDirectory = "page/";

// Default html page (home page)
const defaultPage = "home";


//////////////////
// INCLUDE HTML //
//////////////////


/**
 * Function that injects a html file into a tag having the property include-html="path.html".
 * Source: https://www.w3schools.com/howto/howto_html_include.asp
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    // Loop through a collection of all HTML elements:
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        // Search for elements with a certain atrribute:
        file = elmnt.getAttribute("include-html");
        if (file === "$page") {
            const urlParams = new URLSearchParams(window.location.search);
            let page = urlParams.get("page");
            if (!page) {
                page = defaultPage; 
            }
            file = pagesDirectory + page + ".html";
        }
        if (file) {
            // Make an HTTP request using the attribute value as the file name
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

/**
 * Function that is called when the page has finished loading.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    includeHTML();
});


///////////////////
// OTHER SCRIPTS //
///////////////////

var room;
var focusRoom;

function changeRoomValue(value) {
    room = value;
    console.log("room changed to " + value);
}
function changeFocusRoom(btnNmbr) {
    console.log("btn" + btnNmbr);
    focusRoom = btnNmbr;
}


function changeColor(btnNmbr, color) {
    var btn = document.getElementById('btn' + btnNmbr.toString());
    console.log(btn);
    btn.style.backgroundColor = color;
}


//Keller und erster Stock
var nmbrOfGruppenzimmer = 4;
var nmbrOfLuxuxSuites = 2;
var nmbrOfFamilienzimmer = 25;
var nmbrOfDoppelzimmer = 15;

