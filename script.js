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
var focusDay; //speichert die ID des ausgewählten Tags als String
var currentlyHovered; //speichert die ID des überhoverten Tags als String
//const allBtns = ["btn1","btn2","btn3","btn4","btn5","btn6","btn7","btn8","btn9","btn10","btn11","btn12","btn13","btn14","btn15","btn16","btn17","btn18","btn19","btn20","btn21","btn22","btn23","btn24","btn25","btn26","btn27","btn28","btn29","btn30","btn31"];
//var currentlyInBetween = [];

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monthsNmbrOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth = 4; //starts with april (4-1)

var focusDaysDate;
var currentlyHoveredDate;

function addUpNmbrOfDaysArray(x) {//addiert alle Werte im monthsNmbrOfDays Array bis zur Spalte X (x wird nicht addiert)
    var i = 0;
    var container = 0;
    while (i < x) {
        container += monthsNmbrOfDays[i];
        i += 1;
    }
    return container;
}

function addDateTag() { //weist allen knöpfen ein Datum und eine Verfügbarkeit zu
    var i = 1;
    while (i <= monthsNmbrOfDays[currentMonth]) {
        document.getElementById("btn" + i).date = i + addUpNmbrOfDaysArray(currentMonth);
        document.getElementById("btn" + i).available = true;
        console.log(document.getElementById("btn" + i).date)
        i += 1;
    }
}

function getElementByDate(searchedDate) {//findet den Knopf mit einem bestimmten Datum 
    var i = 1;
    var checkedElement;
    while (i <= 31) {
        checkedElement = document.getElementById("btn"+i);
        if (checkedElement.date == searchedDate) {
            //console.log("found" + checkedElement);
            return checkedElement;
        }
        i += 1;
    }
}

function resetAllButtons() {//setzt die Farbe aller nicht ausgebuchten Tage zurück mit ausnahme des ausgewählten und des überhoverten Tages
    var i = 1
    while (i <= 31) {
        var btnName = "btn" + i;
        var btn = document.getElementById(btnName);
        if (btn.available && btnName != focusDay && btnName != currentlyHovered) {
            btn.style.backgroundColor = "#e1e1e1";
            btn.style.borderColor = "#777";
        }
        i += 1;
    }
    currentlyInBetween.length = 0;
}

function coloriseDaysBetween() { //färbt alle Tage zwischen dem ausgewählten und dem überhoverten Tag
    var startPoint = document.getElementById(focusDay);
    var endPoint = document.getElementById(currentlyHovered);
    console.log("startpoint:"+startPoint.date+"  endpoint:"+endPoint.date);
    resetAllButtons();
    if (startPoint.date < endPoint.date) {
        var i = 1;
        while (i < endPoint.date - startPoint.date) {
            var btnDate = startPoint.date + i;
            getElementByDate(btnDate).style.backgroundColor = "#B3E6B5";
            currentlyInBetween.push(getElementByDate(btnDate));
            i += 1;
        }
        console.log(currentlyInBetween);
    }
    else if (startPoint.date > endPoint.date) {
        var ii = 1;
        while (ii < startPoint.date - endPoint.date) {
            var btnDate = endPoint.date + ii;
            getElementByDate(btnDate).style.backgroundColor = "#B3E6B5";
            currentlyInBetween.push(getElementByDate(btnDate));
            ii += 1;
        }
        currentlyInBetween.push(getElementByDate(btnDate));
    }
}

function changeRoomValue(value) {//saves the kind of room you wanted to book
    room = value;
    console.log("room changed to " + value);
}
function changeFocusDay(btnNmbr) {//saves the currently focused day 
    if (focusDay != undefined) {//checks if theres already a focused day and resets the old one if thats the case
        document.getElementById(focusDay).style.backgroundColor = "#e1e1e1";
        document.getElementById(focusDay).style.borderColor = "#777";
    }
    focusDay = "btn" + btnNmbr;
    focusDaysDate = document.getElementById(focusDay).date;
}
function setHoveredElement(btnNmbr){ //saves the currently hovered day, if you stop hovering it without hovering a new one it still considers it hovered
    currentlyHovered = "btn" + btnNmbr;

    if (focusDay != undefined && currentlyHovered != focusDay) { //changes the hovered days color if you've already focused a day
        coloriseDaysBetween();
        document.getElementById(currentlyHovered).style.backgroundColor = "#1abc9c";
        document.getElementById(currentlyHovered).style.borderColor = "#005a5c";
    }
}

function makeElementUnhoveredAgain(btnNmbr) { //resets the day if you stop hovering it
    const btn = "btn" + btnNmbr;
    if (btn != focusDay) {
        document.getElementById(btn).style.backgroundColor = "#e1e1e1";
        document.getElementById(btn).style.borderColor = "#777";
    }
}

function changeColor(btnNmbr, color) {//changes color of a given day 
    var btn = document.getElementById('btn' + btnNmbr.toString());
    console.log(btn);
    btn.style.backgroundColor = color;
}


//Keller und erster Stock
var nmbrOfGruppenzimmer = 4;
var nmbrOfLuxuxSuites = 2;
var nmbrOfFamilienzimmer = 25;
var nmbrOfDoppelzimmer = 15;

