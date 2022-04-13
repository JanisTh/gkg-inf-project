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
            xhttp.addEventListener("loadend", displayBookingDates(file)) //ruft die Funktion auf, sobald eine Seite geladen wird
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
var focusDay; //speichert die ID des ausgewählten days als String
var currentlyHovered; //speichert die ID des überhoverten days als String

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monthsNmbrOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth = 3; //speichert den Monat als Array Behälter, beginnt mit April (4-1)

var focusDaysDate; //bleibt gleich, auch wenn der Monat geändert wurde
var currentlyHoveredDate;

function changeRoomValue(value) {//speichert die Raum-Art die gebucht werden soll
    room = value;
    console.log("room changed to " + value);
}



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
        document.getElementById("btn" + i).available = true; //würde vielleicht eines Tages durch serverside & DB geändert werden
        //console.log(document.getElementById("btn" + i).date)
        i += 1;
    }
}
function convertDateToRealDate(date) { //konvertiert den Tag im Jahr zu einem Datums-Array aus [tag, monat]
    var day = date;
    var month = 0;
    while (day > 0) {
        day -= monthsNmbrOfDays[month];
        month += 1;
    }
    day += monthsNmbrOfDays[month - 1];
    const realDate = [day, month];
    return realDate;
}
function getElementByDate(searchedDate) {//findet den Knopf mit einem bestimmten Datum 
    var i = 1;
    var checkedElement;
    while (i <= 31) {
        checkedElement = document.getElementById("btn"+i);
        if (checkedElement.date == searchedDate) {
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
}





function changeMonth(delta) {
    currentMonth += delta; 
    if (currentMonth == 12) {
        currentMonth = 0;
    }
    else if (currentMonth == -1) {
        currentMonth = 11;
    }
    console.log(currentMonth);
    document.getElementById("monthsName").innerHTML = months[currentMonth];
    resetAllButtons();
    console.log(focusDaysDate);
    addDateTag();
    console.log(focusDaysDate);
}
function changeFocusDay(btnNmbr) {//speichert den gerade Fokusierten Tag
    if (focusDay != undefined) {//beendet den Buchungsprozess falls schon zum zweiten Mal ein Tag angeklickt wird
        var date1 = focusDaysDate;
        var date2 = document.getElementById("btn" + btnNmbr).date;
        sessionStorage.setItem('startDate', date1);
        sessionStorage.setItem('endDate', date2);
        window.location.href = '?page=danke';
    }
    focusDay = "btn" + btnNmbr;
    addDateTag();//fügt beim ersten Klick dateTags hinzu
    focusDaysDate = document.getElementById(focusDay).date;
}
function setHoveredElement(btnNmbr){//speichert den gerade überhoverten Tag, zählt ihn immer noch als gehovert falls man ihn verlässt ohne einen neuen zu hovern
    currentlyHovered = "btn" + btnNmbr;

    if (focusDay != undefined && currentlyHovered != focusDay) {//färbt den gehoverten Tag, falls man schon ein Startsatum ausgewählt hat
        coloriseDaysBetween();
        document.getElementById(currentlyHovered).style.backgroundColor = "#1abc9c";
        document.getElementById(currentlyHovered).style.borderColor = "#005a5c";
    }
}
function makeElementUnhoveredAgain(btnNmbr) { //setzt den Tag zurück falls man ihn nicht mehr überhovered
    const btn = "btn" + btnNmbr;
    if (btn != focusDay) {
        document.getElementById(btn).style.backgroundColor = "#e1e1e1";
        document.getElementById(btn).style.borderColor = "#777";
    }
}
function coloriseDaysBetween() { //färbt alle Tage zwischen dem ausgewählten und dem überhoverten Tag
    var startPoint = document.getElementById(focusDay);
    var endPoint = document.getElementById(currentlyHovered);
    console.log("startpoint:"+startPoint.date+"  endpoint:"+endPoint.date);
    resetAllButtons();
    if (focusDaysDate < endPoint.date) {
        if (convertDateToRealDate(focusDaysDate)[1] == convertDateToRealDate(endPoint.date)[1]) {    
            var i = 1;
            while (i < endPoint.date - startPoint.date) {
                var btnDate = startPoint.date + i;
                getElementByDate(btnDate).style.backgroundColor = "#B3E6B5";
                i += 1;
            }
        }
        else{//endpoints month > startpoints month
            document.getElementById(focusDay).style.backgroundColor = "#e1e1e1";
            document.getElementById(focusDay).style.borderColor = "#777";
            var i = 1;
            while (i < convertDateToRealDate(endPoint.date)[0]) {
                document.getElementById("btn" + i).style.backgroundColor = "#B3E6B5";
                i += 1;
            }
        }
    }
    else if (focusDaysDate > endPoint.date) {
        if (convertDateToRealDate(focusDaysDate)[1] == convertDateToRealDate(endPoint.date)[1]) {
            var i = 1;
            while (i < startPoint.date - endPoint.date) {
                var btnDate = endPoint.date + i;
                getElementByDate(btnDate).style.backgroundColor = "#B3E6B5";
                i += 1;
            }
        }
        else {//endpoints month < startpoints month
            console.log("endPoints month < startpoints month");
            document.getElementById(focusDay).style.backgroundColor = "#e1e1e1";
            document.getElementById(focusDay).style.borderColor = "#777";
            var i = 31;
            while (i > convertDateToRealDate(endPoint.date)[0]) {
                document.getElementById("btn"+i).style.backgroundColor = "#B3E6B5";
                i -= 1;
            }
        }
    }
}



var pageIsDanke = false; //wird von displayBookingDates() benötigt
function displayBookingDates(file) {//wird 3 mal aufgerufen: für menu, page & footer
    if (file == pagesDirectory + "danke.html") {//ändert pageIsDanke falls beim 2. Aufruf danke.html aufgerufen wird
        pageIsDanke = true;
        console.log("");
    }
    else if (pageIsDanke){//zeigt die Buchungsdaten falls beim 3. Aufruf pageIsDanke schon geändert wurde (erst beim 3. Aufruf, weil page erst NACH dem 2. Aufrurf fertig geladen wurde)
        console.log(document.getElementById("dankePageDates"));
        var date1 = sessionStorage.getItem('startDate');
        var date2 = sessionStorage.getItem('endDate');
        var realDate1 = convertDateToRealDate(date1);
        var realDate2 = convertDateToRealDate(date2);
        console.log(date1 + " = " + realDate1);
        console.log(date2 + " = " + realDate2);
        if (realDate1[1] < realDate2[1]) { //month1 < month2
            document.getElementById("dankePageDates").innerHTML = realDate1[0] + "." + realDate1[1] + " - " + realDate2[0] + "." + realDate2[1];
        }
        else if (realDate1[1] > realDate2[1]) { // month1 > month2
            document.getElementById("dankePageDates").innerHTML = realDate2[0] + "." + realDate2[1] + " - " + realDate1[0] + "." + realDate1[1];
        }
        else if (realDate1[0] < realDate2[0]) { // month1 == month2, day1 < day2
            document.getElementById("dankePageDates").innerHTML = realDate1[0] + "." + realDate1[1] + " - " + realDate2[0] + "." + realDate2[1];
        }
        else if (realDate1[0] > realDate2[0]) { // month1 == month2, day1 > day2
            document.getElementById("dankePageDates").innerHTML = realDate2[0] + "." + realDate2[1] + " - " + realDate1[0] + "." + realDate1[1];
        }
        else{ // month1 == month2, day1 == day2
            document.getElementById("dankeSentence").innerHTML = "Vielen Dank, dass Sie sich für eine Übernachtung am";
            document.getElementById("dankePageDates").innerHTML = realDate1[0] + "." + realDate1[1];
        }
    }
}

//Eventuell notwendig für zukünftige Erweiterungen
var nmbrOfGruppenzimmer = 4;
var nmbrOfLuxuxSuites = 2;
var nmbrOfFamilienzimmer = 25;
var nmbrOfDoppelzimmer = 15;

