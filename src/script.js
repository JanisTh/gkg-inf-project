///////////////////
// CONFIGURATION //
///////////////////


//Path of the page directory
const pagesDirectory = "page/";

//Default html page (home page)
const defaultPage = "home";


//////////////////
// INCLUDE HTML //
//////////////////


/**
 *Function that injects a HTML file into a tag having the property include-html="path.html".
 *Source: https://www.w3schools.com/howto/howto_html_include.asp
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    //Loop through a collection of all HTML elements:
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        //Search for elements with a certain atrribute:
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
            //Make an HTTP request using the attribute value as the file name
            xhttp = new XMLHttpRequest();
            xhttp.addEventListener("loadend", displayBookingDates(file)) //Ruft die Funktion auf, sobald eine Seite geladen wird
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /*Removes the attribute and call this function once more: */
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
 *Function which is called when the page has finished loading.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    includeHTML();
});


///////////////////
// OTHER SCRIPTS //
///////////////////

var focusDay; //Speichert die ID des ausgew??hlten days als String
var currentlyHovered; //speichert die ID des ??berhoverten days als String

const months = ["Januar", "Februar", "M??rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monthsNmbrOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth = 3; //Speichert den Monat als Array Beh??lter, beginnt mit April (4-1)

var focusDaysDate; //Bleibt gleich, auch wenn der Monat ge??ndert wurde
var currentlyHoveredDate;

//Preise in CHF pro Nacht
const doppelzimmerPreis = 187;
const gruppenzimmerPreis = 69;
const familienzimmerPreis = 207;
const luxussuitePreis = 420;


function changeRoomValue(value) {//Speichert die Raum-Art, die gebucht werden soll.
    sessionStorage.setItem('room', value);
}



function addUpNmbrOfDaysArray(x) {//Addiert alle Werte im "monthsNmbrOfDays" Array bis zur Spalte X(x wird nicht addiert)
    var i = 0;
    var container = 0;
    while (i < x) {
        container += monthsNmbrOfDays[i];
        i += 1;
    }
    return container;
}

function addDateTag() { //Weist allen Kn??pfen ein Datum und eine Verf??gbarkeit zu
    var i = 1;
    while (i <= monthsNmbrOfDays[currentMonth]) {
        document.getElementById("btn" + i).date = i + addUpNmbrOfDaysArray(currentMonth);
        document.getElementById("btn" + i).available = true; //W??rde vielleicht eines Tages durch serverside & DB ge??ndert werden
        document.getElementById("btn" + i).style.visibility = "visible";
        i += 1;
    }
    i = 31;
    while (i > monthsNmbrOfDays[currentMonth]) { //versteckt die Kn??pfe der Tage, die es im Monat nicht gibt
        document.getElementById("btn" + i).style.visibility = "hidden";
        i -= 1;
    }
}
function convertDateToRealDate(date) { //Konvertiert den Tag im Jahr zu einem Datums-Array aus [Tag, Monat]
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
function calculatePrice() {
    var date1 = sessionStorage.getItem('startDate');
    var date2 = sessionStorage.getItem('endDate');
    var realDate1 = convertDateToRealDate(date1);
    var realDate2 = convertDateToRealDate(date2);
    var aufenthaltsdauer;
    var price;
    console.log(realDate1);
    if (realDate1[1] == realDate2[1]) { //month1 == month2
        aufenthaltsdauer = Math.abs(realDate1[0] - realDate2[0]) + 1;
        console.log(aufenthaltsdauer);
    }
    else{
        if (realDate1[1] < realDate2[1]) {
            aufenthaltsdauer = monthsNmbrOfDays[realDate1[1] - 1] - realDate1[0] + realDate2[0] + 1;
            console.log(aufenthaltsdauer);
        }
        else{ //month1 > month2
            aufenthaltsdauer = monthsNmbrOfDays[realDate2[1] - 1] - realDate2[0] + realDate1[0] + 1;
            console.log(aufenthaltsdauer);
        }
    }
    switch (sessionStorage.getItem('room')) {
        case "ein Doppelzimmer":
            document.getElementById("dankePreis").innerHTML = "Der Preis betr??gt " + aufenthaltsdauer * doppelzimmerPreis + ".-";
            break;
        case "ein Familienzimmer":
            document.getElementById("dankePreis").innerHTML = "Der Preis betr??gt " + aufenthaltsdauer * familienzimmerPreis + ".-";
            break;
        case "ein Gruppenzimmer":
            document.getElementById("dankePreis").innerHTML = "Der Preis betr??gt " + aufenthaltsdauer * gruppenzimmerPreis + ".-";
            break;
        case "eine LuxusSuite":
            document.getElementById("dankePreis").innerHTML = "Der Preis betr??gt " + aufenthaltsdauer * luxussuitePreis + ".-";
            break;
    }
}
function getElementByDate(searchedDate) {//Findet den Knopf mit einem bestimmten Datum 
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
function resetAllButtons() {//Setzt die Farbe aller nicht ausgebuchten Tage zur??ck mit Ausnahme des ausgew??hlten und des ??berhoverten Tages
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
    document.getElementById("monthsName").innerHTML = months[currentMonth];
    resetAllButtons();
    addDateTag();
}
function changeFocusDay(btnNmbr) {//Speichert den gerade fokussierten Tag
    if (focusDay != undefined) {//Beendet den Buchungsprozess, falls schon zum zweiten Mal ein Tag angeklickt wird.
        var date1 = focusDaysDate;
        var date2 = document.getElementById("btn" + btnNmbr).date;
        sessionStorage.setItem('startDate', date1);
        sessionStorage.setItem('endDate', date2);
        window.location.href = '?page=danke';
    }
    focusDay = "btn" + btnNmbr;
    addDateTag();//F??gt beim ersten Klick "dateTags" hinzu
    focusDaysDate = document.getElementById(focusDay).date;
}
function setHoveredElement(btnNmbr){//Speichert den gerade ??berhoverten Tag, z??hlt ihn immer noch als gehovert, falls man ihn verl??sst, ohne einen neuen zu hovern
    currentlyHovered = "btn" + btnNmbr;

    if (focusDay != undefined && currentlyHovered != focusDay) {//F??rbt den gehoverten Tag, falls man schon ein Startdatum ausgew??hlt hat.
        coloriseDaysBetween();
        document.getElementById(currentlyHovered).style.backgroundColor = "#1abc9c";
        document.getElementById(currentlyHovered).style.borderColor = "#005a5c";
    }
}
function makeElementUnhoveredAgain(btnNmbr) { //Setzt den Tag zur??ck, falls man ihn nicht mehr ??berhoveret.
    const btn = "btn" + btnNmbr;
    if (btn != focusDay) {
        document.getElementById(btn).style.backgroundColor = "#e1e1e1";
        document.getElementById(btn).style.borderColor = "#777";
    }
}
function coloriseDaysBetween() { //F??rbt alle Tage zwischen dem ausgew??hlten und dem ??berhoverten Tag
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



var pageIsDanke = false; //Wird von "displayBookingDates()" ben??tigt
function displayBookingDates(file) {//Wird dreimal aufgerufen: f??r "menu", "page" & "footer"
    if (file == pagesDirectory + "danke.html") {//??ndert "pageIsDanke", falls beim zweiten Aufruf "danke.html" aufgerufen wird.
        pageIsDanke = true;
    }
    else if (pageIsDanke){//Zeigt die Buchungsdaten, falls beim dritten Aufruf "pageIsDanke" schon ge??ndert wurde (erst beim dritten Aufruf, weil "page" erst NACH dem zweiten Aufrurf fertig geladen wurde)
        var date1 = sessionStorage.getItem('startDate');
        var date2 = sessionStorage.getItem('endDate');
        var realDate1 = convertDateToRealDate(date1);
        var realDate2 = convertDateToRealDate(date2);
        document.getElementById("dankeSentence").innerHTML = "Vielen Dank, dass Sie sich f??r " + sessionStorage.getItem('room') + " vom";
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
            document.getElementById("dankeSentence").innerHTML = "Vielen Dank, dass Sie sich f??r einen Aufenthalt am";
            document.getElementById("dankePageDates").innerHTML = realDate1[0] + "." + realDate1[1];
        }
        calculatePrice();
    }
}

//Eventuell notwendig f??r zuk??nftige Erweiterungen//

//var nmbrOfGruppenzimmer = 4;
//var nmbrOfLuxuxSuites = 2;
//var nmbrOfFamilienzimmer = 25;
//var nmbrOfDoppelzimmer = 15;