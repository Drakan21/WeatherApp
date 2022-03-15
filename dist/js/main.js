/* imports helpers */
import { 
    setPlaceHolderText,
    swapSpinner, 
    displayError, 
    displayAPIError,
    updateDisplay,
    updateScreenReaderConfirmation 
} from "./domFunctions.js";

import { 
    setLocationObject, 
    getHomeLocation, 
    setHomeLocation,
    getCoordsFromApi,
    getWeatherFromCoords,
    cleanText    
} from './dataFunctions.js';

/* import classes */
import CurrentLocation from "./CurrentLocation.js";

/* global decl */
const currentLoc = new CurrentLocation();

/* funcs */
const _add_click = (element, callback) => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        callback(event);
    });
}

const initApp = () => {
    // add listeners    
    const geoBtn = document.getElementById('getLocation');
    const homeBtn = document.getElementById('home');
    const saveBtn = document.getElementById('saveLocation');
    const unitBtn = document.getElementById('units');
    const refrBtn = document.getElementById('refresh');

    _add_click(geoBtn, getGeoWeather);
    _add_click(homeBtn, getHomeWeather);
    _add_click(saveBtn, saveHomeLocation);
    _add_click(unitBtn, toggleDisplayUnits);
    _add_click(refrBtn, refreshWeatherData);

    const search = document.getElementById('searchBar__form');
    search.addEventListener('submit', submitNewLocation);

    // set up
    setPlaceHolderText();

    // load weather
    getHomeWeather();
}

const getGeoWeather = (event) => {    
    swapSpinner(event, '.fa-map-marker-alt');
    if(!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

const geoError = (errObj) => {
    const errMsg = errObj ? errObj.message : 'Geolocation not supported';    
    displayError(errMsg, errMsg);
}

const geoSuccess = (position) => {
    const myCoordsObj = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    
    // set location object
    setLocationObject(currentLoc, myCoordsObj);
    // update data and display
    updateDataAndDisplay(currentLoc);
}

const getHomeWeather = (event) => {
    const savedLoc = getHomeLocation('defaultWeatherLoc');
    if(!savedLoc && !event) return getGeoWeather();
    if(!savedLoc && event.type === 'click') {
        displayError(
            'No Home Location Saved',
            'Sorry. Please save your home location first'
        );  
    } else if(savedLoc && !event) {
        displayHomeLocationWeather(savedLoc);
    } else {
        swapSpinner(event, '.fa-home');
        displayHomeLocationWeather(savedLoc);
    }
}

const displayHomeLocationWeather = (homeLocation) => {
    if(homeLocation) {
        const myCoordsObj = {
            name: homeLocation.name,
            lon: homeLocation.lon,
            lat: homeLocation.lat,
            unit: homeLocation.unit
        };
        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
    }
}

const saveHomeLocation = (event) => {
    if(currentLoc.getLatitude() && currentLoc.getLongitude()) {
        swapSpinner(event, '.fa-save');
        setHomeLocation('defaultWeatherLoc',
        {
            name: currentLoc.getName(),
            lat: currentLoc.getLatitude(),
            lon: currentLoc.getLongitude(),
            unit: currentLoc.getUnits()
        });
        updateScreenReaderConfirmation(`Save ${currentLoc.getName()} as home location.`);
    }
}

const toggleDisplayUnits = (event) => {
    swapSpinner(event, '.fa-chart-bar');
    currentLoc.toggleUnits();
    updateDataAndDisplay(currentLoc);
}

const refreshWeatherData = (event) => {
    swapSpinner(event, '.fa-sync-alt');
    updateDataAndDisplay(currentLoc);
}

const submitNewLocation = async (event) => {
    event.preventDefault();
    const text = document.getElementById('searchBar__text').value;
    const entryText = cleanText(text);
    if(!entryText.length)  return;
    swapSpinner(event, '.fa-search');
    // work with API data
    const coords = await getCoordsFromApi(entryText, currentLoc.getUnits());
    if(coords.cod === 200) {
        // success
        const myCoordsObj = {
            lat : coords.coord.lat,
            lon : coords.coord.lon,
            name : coords.sys.country 
                    ? `${coords.name}, ${coords.sys.country}` 
                    : coords.name
        };
        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
    } else {
        // display error
        if(!coords) {
            displayError("Connection Error", "Connection Error");
        } else {
            displayAPIError(coords);
        }
    }
}

/* update data */
const updateDataAndDisplay = async (location) => {
    const weatherJson = await getWeatherFromCoords(location);
    if(weatherJson) updateDisplay(weatherJson, location);
}

document.addEventListener("DOMContentLoaded", initApp);