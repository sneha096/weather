var citiesObject = {};
var cityList = [];
var nextFiveHrInfoElement = [];
var sunnyArray = [];
var cloudyArray = [];
var rainyArray = [];
var displayArray = [];
var continArray = [];
var cityArray = [];
var tempContinArray = [];
var selectedCityName, currentTime, timeString = '', dateAppend, displayImage, numberOfCardsToDisplay, positionInObject, nextFiveHR;

var cityNameElement = document.getElementById('city-input'); //selected city name
var cityOptionsElement = document.getElementById("city-options");
var selectedCityImageElement = document.getElementById('city-img');
var hourElement = document.getElementById('hr');
var minuteElement = document.getElementById('min');
var secondsElement = document.getElementById('sec');
var ampmStateElement = document.getElementById('ampm-state');
var dateElement = document.getElementById("date");
var degreeCelsiusElement = document.getElementById('deg-cel');
var humidityElement = document.getElementById('humidity');
var degreeFahrenElement = document.getElementById('deg-fer');
var precipitationElement = document.getElementById('precipitation');

for (let i = 0; i < 5; i++) {
    let newData = {
        timeOfFive: document.getElementById('fivehr' + (i + 1)),
        imageSource: document.getElementById('fivehrimg' + (i + 1)),
        temperature: document.getElementById('fivehrval' + (i + 1))
    }
    nextFiveHrInfoElement.push(newData);
}
var errorElement = document.getElementById('error');
var sunnyButtonElement = document.getElementById("btn1");
var snowFlakeButtonElement = document.getElementById("btn2");
var cloudButtonElement = document.getElementById("btn3");
var cityDisplayCardsElement = document.getElementById('city-all');
var inputNumberOfCardsDisplayElement = document.getElementById('inputnum');
var scrollBarLeftElement = document.getElementById('scroll-bar1');
var scrollBarRightElement = document.getElementById('scroll-bar2');
var continNameSortElement = document.getElementById('contin-name-sort');
var continTempSortElement = document.getElementById("contin-temp-sort");
var continDisplayCardsElement = document.querySelector('.contin-all');

cityNameElement.addEventListener('click', (event) => { event.target.select(); });
cityNameElement.addEventListener('change', cityChangeHandler);
sunnyButtonElement.addEventListener('click', sunnyDisplay); //Calling sunny function on click
snowFlakeButtonElement.addEventListener('click', rainyDisplay); //Calling rainny function on click
cloudButtonElement.addEventListener('click', cloudyDisplay); //Calling cloudy function on click
inputNumberOfCardsDisplayElement.addEventListener('change', cityCardsChangeHandler);   //Calling print function on change of input
scrollBarRightElement.addEventListener('click', moveRight);
scrollBarLeftElement.addEventListener('click', moveLeft);
continNameSortElement.addEventListener('click', toggleButtonName);
continTempSortElement.addEventListener('click', toggleButtonTemp);

async function getData() {
    const res = await fetch('http://localhost:4000/all-timezone-cities');
    var data;
    try {
        data = await res.json();
    }
    catch (error) {
        console.log("ERROR");
    }
    return data;
}

async function getSelectedCityTimeZone(selectedCityName) {
    const res = await fetch(`http://localhost:4000/cityName?city=${selectedCityName}`);
    var selectedCityTimeZone = await res.json();
    var sendData;
    try {
        sendData = selectedCityTimeZone;
    }
    catch (error) {
        console.log("ERROR");
    }
    return sendData;
}

async function getNextFiveHrData(a) {
    const cityNameTimeZone = await getSelectedCityTimeZone(a);
    var dataForCityName = Object.values(cityNameTimeZone);
    var raw_data = {
        "city_Date_Time_Name": dataForCityName[0],
        "hours": 4
    }
    const res = await fetch('http://localhost:4000/hourly-forecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(raw_data)
    });
    var selectedCityNextFiveHrData = await res.json();
    var sendData;
    try {
        sendData = selectedCityNextFiveHrData;
    }
    catch (error) {
        console.log("ERROR");
    }
    return sendData;
}

citiesObject = await getData();
let sizeOfCityList = 0;
Object.keys(citiesObject).forEach(key => {
    cityList[sizeOfCityList++] = citiesObject[key].cityName;
    let temp = parseInt(citiesObject[key].temperature);
    let humi = parseInt(citiesObject[key].humidity);
    let prep = parseInt(citiesObject[key].precipitation);
    if (temp >= 29 && humi < 50 && prep >= 50) {
        sunnyArray.push(key);
    }
    else if ((temp <= 28 && temp >= 20) && humi > 50 && prep < 50) {
        rainyArray.push(key);
    }
    else if (temp < 20 && humi > 50) {
        cloudyArray.push(key);
    }
});

cityList.sort();

var cityOptionsHTML = cityList.reduce(function (result, itemInList) {  // variable to store the options
    return result += '<option value="' + itemInList + '" />';
}, '');
cityOptionsElement.innerHTML = cityOptionsHTML;

async function cityChangeHandler() {
    selectedCityName = cityNameElement.value;
    positionInObject = citiesObject.findIndex((e) => e.cityName == selectedCityName);
    var displayConfg = new classOfSelectedCityDetails();
    displayConfg.displayError(selectedCityName.toLowerCase());
    if (displayConfg.errorValue === 0) {
        nextFiveHR = await getNextFiveHrData(selectedCityName);
        changeImageAndAppend(selectedCityImageElement, `img/Icons_for_cities/${selectedCityName.toLowerCase()}.svg`);
        displayConfg.timeOfSelectedCity();
        displayConfg.dateOfSelectedCity();
        displayConfg.tempHumiPreciChange();
        displayConfg.nextFiveHr();
    }
}

class classOfSelectedCityDetails {
    constructor() {
        this.objectOfSelectedCity = citiesObject[positionInObject];
        this.period = 0;
        this.time;
        this.hour;
        this.nextHour;
        this.valueOfNextHr;
        this.imageCheck;
        this.timeVal;
        this.imageName;
        this.errorValue = 0;
    }

    intervalSetForDateAndTime() {
        let intervalForDateAndTime = setInterval(changeTimeAndDate, 500);
        cityNameElement.addEventListener('change', () => {
            clearTimeout(intervalForDateAndTime);
        });
    }

    timeOfSelectedCity() { //displaying time
        getTimeZone(this.objectOfSelectedCity);
        currentTime = currentTime.split(",")[2];

        if (currentTime.includes(" AM")) {  //splitting the time according to am or pm
            this.period = 0;
            currentTime = currentTime.replace("AM", " ");
        }
        else {
            this.period = 1;
            currentTime = currentTime.replace("PM", " ");
        }

        this.time = currentTime.split(":");  //splitting the time into hour, minute, seconds
        hourElement.innerHTML = this.time[0] + ":";
        minuteElement.innerHTML = this.time[1];
        secondsElement.innerHTML = ":" + this.time[2];
        changeImageAndAppend(ampmStateElement, (this.period === 1) ? "img/General_Icons/pmState.svg" : "img/General_Icons/amState.svg"); //setting pm image            this.intervalSetForDateAndTime();
        this.intervalSetForDateAndTime();
    }

    dateOfSelectedCity() { //date display
        getTimeZone(this.objectOfSelectedCity);
        dateProcessing();
        dateElement.innerHTML = dateAppend;
        this.intervalSetForDateAndTime();
    }

    tempHumiPreciChange() {
        let temper = parseInt(this.objectOfSelectedCity.temperature.replace("°C", ""));  //Temperature section
        degreeCelsiusElement.innerHTML = this.objectOfSelectedCity.temperature;
        humidityElement.innerHTML = this.objectOfSelectedCity.humidity;
        degreeFahrenElement.innerHTML = (Math.round((((temper * 1.8) + 32) + Number.EPSILON) * 100) / 100) + "°F";
        precipitationElement.innerHTML = this.objectOfSelectedCity.precipitation;
    }

    nextFiveHr() {  //Next five hours timming
        this.hour = parseInt(this.time[0]);
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                nextFiveHrInfoElement[i].timeOfFive.innerHTML = "NOW";
                this.imageCheck = parseInt(this.objectOfSelectedCity.temperature);
                this.timeVal = this.hour;
                this.checkImageIcon();  //Weather image according to next five hour's temperature
                nextFiveHrInfoElement[i].temperature.innerHTML = this.objectOfSelectedCity.temperature;  //Temperature of next five hour
                changeImageAndAppend(nextFiveHrInfoElement[i].imageSource, `img/Weather_Icons/${this.imageName}.svg`);
                continue;
            }

            this.nextHour = this.hour + i;
            this.valueOfNextHr = nextFiveHR["temperature"][i-1];
            if (this.nextHour === 12) {
                this.period = (this.period === 1) ? 0 : 1;
            }
            else if (this.nextHour > 12) {
                this.nextHour = this.nextHour - 12;
            }
            this.imageCheck = parseInt(this.valueOfNextHr);
            this.timeVal = this.nextHour;
            nextFiveHrInfoElement[i].timeOfFive.innerHTML = this.nextHour + ((this.period === 1) ? "PM" : "AM");
            nextFiveHrInfoElement[i].temperature.innerHTML = this.valueOfNextHr;
            this.checkImageIcon();
            changeImageAndAppend(nextFiveHrInfoElement[i].imageSource, `img/Weather_Icons/${this.imageName}.svg`);
        }
    }

    checkImageIcon() {
        if (this.imageCheck <= 0) {
            this.imageName = "snowflakeIcon";
        }
        else if (this.imageCheck > 0 && this.imageCheck <= 18) {
            this.imageName = "rainyIcon";
        }
        else if (this.imageCheck > 18 && this.imageCheck <= 22) {
            this.imageName = "windyIcon";
        }
        else if (this.imageCheck >= 23 && this.imageCheck <= 29) {
            this.imageName = "cloudyIcon";
        }
        else {
            if ((this.period === 0 && this.timeVal >= 6 && this.timeVal != 12) || (this.period === 1 && (this.timeVal === 12 || this.timeVal <= 6))) {
                this.imageName = "sunnyIcon";
            }
            else {
                this.imageName = "moonIcon";
            }
        }
    }

    displayError(citiName) {
        var lowerCasedCityList = cityList.map(element => {
            return element.toLowerCase();
        });
        if (!lowerCasedCityList.includes(citiName)) {
            errorElement.innerHTML = "Warning! Enter a Valid Input";
            changeImageAndAppend(selectedCityImageElement, "img/General_Icons/warning.svg");
            hourElement.innerHTML = "--:";
            minuteElement.innerHTML = "--";
            secondsElement.innerHTML = ":--";
            ampmStateElement.innerHTML = "";
            dateElement.innerHTML = "--/--/----";
            degreeCelsiusElement.innerHTML = "N/A";
            humidityElement.innerHTML = "N/A";
            degreeFahrenElement.innerHTML = "N/A";
            precipitationElement.innerHTML = "N/A";
            for (let i = 0; i < 5; i++) {  //Time for next five hour's temperature
                nextFiveHrInfoElement[i].timeOfFive.innerHTML = "N/A";
                changeImageAndAppend(nextFiveHrInfoElement[i].imageSource, "img/General_Icons/warning.svg"); //Weather image
                nextFiveHrInfoElement[i].temperature.innerHTML = "N/A";  //Temperature Value
            }
            this.errorValue = 1;
        }
        else {
            errorElement.innerHTML = "";
            this.errorValue = 0;
        }
    }
}

function changeImageAndAppend(elementName, imageSource) {    //selected city's image
    elementName.innerHTML = "";
    var img = document.createElement('img');
    img.src = imageSource;
    elementName.appendChild(img);
}

function getTimeZone(citiName) {
    currentTime = new Date().toLocaleString("en-US", { timeZone: citiName.timeZone, dateStyle: 'medium', timeStyle: 'medium', hour12: true });//Processing for date and time     
}

function dateProcessing() {
    currentTime = currentTime.split(",");
    var dateMonth = currentTime[0].split(" ");
    var year = currentTime[1].split(" ")[1];
    dateAppend = (String(dateMonth[1].padStart(2, '0') + "-" + dateMonth[0] + "-" + year));
}

function timeProcessing() {
    currentTime = currentTime[2].split(" ");
    var time = currentTime[1].split(":");
    var ampm = currentTime[2];
    timeString = time[0] + ":" + time[1] + " " + ampm;
}

function changeTimeAndDate() {
    var timeConf = new classOfSelectedCityDetails();
    timeConf.timeOfSelectedCity();
    timeConf.dateOfSelectedCity();
}


//sorting the sunny, rainy, cloudy arrays
sunnyArray.sort((a, b) => { return parseInt(citiesObject[a].temperature) - parseInt(citiesObject[b].temperature) });
cloudyArray.sort((a, b) => { return parseInt(citiesObject[a].humidity) - parseInt(citiesObject[b].humidity) });
rainyArray.sort((a, b) => { return parseInt(citiesObject[a].precipitation) - parseInt(citiesObject[b].precipitation) });

function sunnyDisplay() {
    sunnyButtonElement.style.borderBottom = "2px solid blue";
    snowFlakeButtonElement.style.borderBottom = cloudButtonElement.style.borderBottom = "2px solid black";
    displayArray = sunnyArray;
    displayImage = "sunny";
    cityCardsChangeHandler();
}

function rainyDisplay() {
    snowFlakeButtonElement.style.borderBottom = "2px solid blue";
    sunnyButtonElement.style.borderBottom = cloudButtonElement.style.borderBottom = "2px solid black";
    displayArray = rainyArray;
    displayImage = "snowflake";
    cityCardsChangeHandler();
}

function cloudyDisplay() {
    cloudButtonElement.style.borderBottom = "2px solid blue";
    sunnyButtonElement.style.borderBottom = snowFlakeButtonElement.style.borderBottom = "2px solid black";
    displayArray = cloudyArray;
    displayImage = "cloudy";
    cityCardsChangeHandler();
}

function cityCardsChangeHandler() { //print function
    cityDisplayCardsElement.innerHTML = "";
    let numberOfCardsToDisplay = inputNumberOfCardsDisplayElement.value;

    if(numberOfCardsToDisplay === 0 || displayArray.length === 0){
        cityDisplayCardsElement.innerHTML = "No Data to display!";
    }

    for (let i = displayArray.length - 1, j = 0; i >= 0 && j < numberOfCardsToDisplay; i--, j++) {
        var fetched = cityDisplayCardsElement.innerHTML;
        let cityObjFromDisplayArray = citiesObject[displayArray[i]];
        getTimeZone(cityObjFromDisplayArray);
        dateProcessing();
        timeProcessing();

        cityDisplayCardsElement.innerHTML = fetched + `<div class="city-box">
                                    <span class="city-name">
                                        <div style="font-size: 20px;">
                                            <div>${cityObjFromDisplayArray.cityName}</div>
                                            <div style="font-size: 14px; padding-top:10px;">${dateAppend}</div>
                                            <div style="font-size: 14px; padding-top:5px;">${timeString}</div>
                                        </div>
                                        <div style="font-size: 25px;">
                                            <img src="img/Weather_Icons/${displayImage}Icon.svg" width="25px">
                                            ${cityObjFromDisplayArray.temperature} 
                                        </div>
                                       
                                    </span>
                                                                        
                                    <div style="position: relative;">                                      
                                        <img src="img/Icons_for_cities/${cityObjFromDisplayArray.cityName}.svg" class="city-img">                          
                                        <div class="city-details">                                        
                                            <img src="img/Weather_Icons/humidityIcon.svg">
                                            ${cityObjFromDisplayArray.humidity} 
                                            <br>
                                            <img src="img/Weather_Icons/precipitationIcon.svg">
                                            ${cityObjFromDisplayArray.precipitation} <br> 
                                        </div>      
                                    </div>  
                                </div>`;
    }
    var minimumValueToDisplay = (displayArray.length > numberOfCardsToDisplay) ? numberOfCardsToDisplay : displayArray.length;   //scroll media query
    let windowViewSize = window.matchMedia('(max-width: 1300px)');
    let tabletViewSize = window.matchMedia("(max-width:1130px");
    let tabViewSize = window.matchMedia("(max-width:880px");
    let mobileViewSize = window.matchMedia("(max-width:670px");

    if (minimumValueToDisplay > 5 || (windowViewSize.matches && minimumValueToDisplay >= 5) || (tabletViewSize.matches && minimumValueToDisplay >= 4) || (tabViewSize.matches && minimumValueToDisplay >= 3) || (mobileViewSize.matches && minimumValueToDisplay >= 2)) {
        scrollBarLeftElement.setAttribute("style", "visibility: visible");
        scrollBarRightElement.setAttribute("style", "visibility: visible");
    }
    else {
        scrollBarLeftElement.setAttribute("style", "visibility: hidden");
        scrollBarRightElement.setAttribute("style", "visibility: hidden");
    }
}

let valueToMove = 0;  //scroll functions
const queryElementSelected = cityDisplayCardsElement;

function moveRight() {
    if (valueToMove < queryElementSelected.childElementCount * 215) {
        valueToMove = valueToMove + 250;
    }
    queryElementSelected.scroll({
        left: valueToMove,
        behavior: "smooth",
    });
}

function moveLeft() {
    if (valueToMove > 0) {
        valueToMove = valueToMove - 250;
    }
    queryElementSelected.scroll({
        left: valueToMove,
        behavior: "smooth",
    });
}
//task 3

var numClickOfName = 0, numClickOfTemp = 0;

function toggleButtonName() {   //function for toggling image and corresponding sorting order for name
    let imageSourcAfterClick;
    numClickOfName++;
    if (numClickOfName % 2 != 0) {
        imageSourcAfterClick = `img/General_Icons/arrowDown.svg`;
        ascendingOrderContinName();
        afterSortArray(continArray);
    }
    else {
        imageSourcAfterClick = `img/General_Icons/arrowUp.svg`;
        decendingOrderContinName();
        afterSortArray(continArray);
    }
    changeImageAndAppend(continNameSortElement, imageSourcAfterClick);
}

function toggleButtonTemp() {  //function for toggling image and corresponding sorting order for temperature
    let imageSourcAfterClick;
    if (numClickOfTemp === 0) {
        imageSourcAfterClick = `img/General_Icons/arrowUp.svg`;
        numClickOfTemp = 1;
        tempDescendingOrder();
    }
    else {
        imageSourcAfterClick = `img/General_Icons/arrowDown.svg`;
        numClickOfTemp = 0;
        tempAscendingOrder();
    }
    changeImageAndAppend(continTempSortElement, imageSourcAfterClick);
}

Object.keys(citiesObject).forEach(key => {
    continArray.push({ 'continName': citiesObject[key].timeZone, 'citiesName': key });
});

function ascendingOrderContinName() {  //function for sorting continent names in ascending order
    continArray.sort(function (a, b) {
        return ((a.continName < b.continName) ? -1 : ((a.continName == b.continName) ? 0 : 1));
    });
}

function decendingOrderContinName() {  //function for sorting continent names in descending order
    continArray.sort(function (a, b) {
        return ((a.continName > b.continName) ? -1 : ((a.continName == b.continName) ? 0 : 1));
    });
}

function tempAscendingOrder() {  //function for sorting temperature in ascending order
    if (numClickOfName == 0 && numClickOfTemp === 1) {
        ascendingOrderContinName();
    }
    else if (numClickOfName == 0 && numClickOfTemp === 0) {
        decendingOrderContinName();
    }
    tempContinArray = continArray;
    tempContinArray.sort((a, b) => {
        if (a.continName.split("/")[0] === b.continName.split("/")[0]) {
            if (parseInt(citiesObject[a.citiesName].temperature) < parseInt(citiesObject[b.citiesName].temperature)) {
                return -1;
            }
            else {
                return 0;
            }
        }
    });
    afterSortArray(tempContinArray);
}

function tempDescendingOrder() {  //function for sorting temperature in descending order
    if (numClickOfName === 0 && numClickOfTemp === 1) {
        ascendingOrderContinName();
    }
    else if (numClickOfName === 0 && numClickOfTemp === 0) {
        decendingOrderContinName();
    }
    tempContinArray = continArray;
    tempContinArray.sort((a, b) => {
        if (a.continName.split("/")[0] === b.continName.split("/")[0]) {
            if (parseInt(citiesObject[a.citiesName].temperature) > parseInt(citiesObject[b.citiesName].temperature)) {
                return -1;
            }
            else {
                return 0;
            }
        }
    });
    afterSortArray(tempContinArray);
}

function afterSortArray(a) {
    continDisplayCardsElement.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        runContinDisplay(citiesObject[a[i].citiesName]);
    }
}

function runContinDisplay(countryObj) {   //Printing the cards in desired order
    var fetched = continDisplayCardsElement.innerHTML;
    getTimeZone(countryObj);
    dateProcessing();
    timeProcessing();

    continDisplayCardsElement.innerHTML = fetched + `<div class="contin-name">
                                                    <div class="contin-deg">
                                                        <span class="country-name">${countryObj.timeZone.split("/")[0]}</span>
                                                        <span class="country-temp">${countryObj.temperature}</span>
                                                    </div>
                                                    
                                                    <div class="contin-humidity">
                                                        <div>${countryObj.cityName}, ${timeString}</div>
                                                        <div>
                                                            <img src="img/Weather_Icons/humidityIcon.svg">
                                                            <span>${countryObj.humidity}</span>
                                                        </div>
                                                    </div>
                                                </div>`;
}