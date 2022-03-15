import { toProperCase as _PC, parseValue as _PV } from "./dataFunctions.js";

const createElem = (type, className, text) => {
  const elem = document.createElement(type);
  if (className) {
    elem.className = className;
  }
  if (text) {
    elem.textContent = text;
  }
  return elem;
};

export const setPlaceHolderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeHolder = "City, State, Country")
    : (input.placeHolder = "City, State, Country or Zip Code");
};

export const swapSpinner = (event, class_select) => {
  if (event && (event.type === "click" || event.type === "submit")) {
    // add spinner to btn
    const ico = document.querySelector(class_select);
    addSpinner(ico);
  }
};
const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

const toggleFade = (id) => {
  const cc = document.getElementById(id);
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
};

const fadeDisplay = () => {
  toggleFade("currentForecast");
  toggleFade("dailyForecast");
};

const setFocusOnSearch = () => {
  const srch = document.getElementById("searchBar__text");
  srch.focus();
};

/* */

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};
export const displayAPIError = (status) => {
  const properMsg = _PC(status.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
  status;
};

export const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const msgArr = message.split(" ");
    const mapArr = msgArr.map((ms) => ms.replace(": "));
    const lat = mapArr[0].indexOf("-") === -1 ? mapArr[0].slice(0, 4) : mapArr[0].slice(0, 5);
    const long = mapArr[1].indexOf("-") === -1 ? mapArr[1].slice(0, 5) : mapArr[1].slice(0, 6);
    h1.textContent = `${lat} • ${long}`;
  }
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  const sp = document.getElementById("confirmation");
  sp.textContent = message;
};

/* display update functions */
export const updateDisplay = (weatherData, location) => {
  /* fade-out */
  fadeDisplay();
  // clear out display:
  clearDisplay();
  const weatherClass = getWeatherClass(weatherData.current.weather[0].icon);
  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(weatherData, location);
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(location.getName());
  // current condition
  const ccArray = createCurrentConditionsDisplay(weatherData, location.getUnits());

  // six day forecast
  displayCurrentConditions(ccArray);
  displaySixDayForecast(weatherData);
  setFocusOnSearch();
  /* fade-in after data has been populated */
  fadeDisplay();
};

const clearDisplay = () => {
  const currentConditions = document.getElementById("currentForecast__conditions");
  deleteContents(currentConditions);
  const dailyForecast = document.getElementById("dailyForecast__content");
  deleteContents(dailyForecast);
};

const deleteContents = (element) => {
  let child = element.lastElementChild;
  while (child) {
    element.removeChild(child);
    child = element.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    "03": "clouds",
    "04": "clouds",
    10: "clouds",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "sunny";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) {
      document.documentElement.classList.remove(img);
    }
  });
};

const buildScreenReaderWeather = (weather, location) => {
  const loc = location.getName();
  const unit = location.getUnits();
  const tmpUnit = unit === "imperial" ? "Fahrenheit" : "Celcius";

  return `${weather.current.weather[0].description} and 
  ${_PV(weather.current.temp)}°${tmpUnit} in ${loc}`;
};

const createCurrentConditionsDisplay = (weather, units) => {
  weather, units;
  const tempUnit = units === "imperial" ? "F" : "C";
  const windUnit = units === "imperial" ? " mph" : " m/s";

  const icon = createMainImgDiv(
    weather.current.weather[0].icon,
    weather.current.weather[0].description
  );
  const temp = createElem("div", "temp", `${_PV(weather.current.temp, "°")}`, tempUnit);
  const symb = createElem("div", "unit", tempUnit);
  temp.appendChild(symb);
  const properDesc = _PC(weather.current.weather[0].description);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem("div", "feels", `Feels Like ${_PV(weather.current.feels_like, "°")}`);
  const maxTmp = createElem("div", "maxtemp", `High ${_PV(weather.daily[0].temp.max, "°")}`);
  const minTmp = createElem("div", "mintemp", `Low ${_PV(weather.daily[0].temp.min, "°")}`);
  const humidity = createElem("div", "humidity", `Humidity ${_PV(weather.current.humidity, "%")}`);
  const wind = createElem("div", "wind", `Wind ${_PV(weather.current.wind_speed, windUnit)}`);

  return [icon, temp, desc, feels, maxTmp, minTmp, humidity, wind];
};

const displayCurrentConditions = (currentConditionsArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionsArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const translateIconToFontAwesome = (icon) => {
  const i = createElem("i");
  const firstChars = icon.slice(0, 2);
  const lastChars = icon.slice(2);

  const _ac = (classes) => i.classList.add(...classes);

  switch (firstChars) {
    case "01":
      _ac(lastChars === "d" ? ["far", "fa-sun"] : ["far", "fa-moon"]);
      break;
    case "02":
      _ac(lastChars === "d" ? ["fas", "fas-cloud-sun"] : ["fas", "fa-cloud-moon"]);
      break;
    case "03":
      _ac(["fas", "fa-cloud"]);
      break;
    case "04":
      _ac(["fas", "fa-cloud-meatball"]);
      break;
    case "09":
      _ac(["fas", "fa-cloud-rain"]);
      break;
    case "10":
      _ac(lastChars === "d" ? ["fas", "fas-cloud-sun-rain"] : ["fas", "fa-cloud-moon-rain"]);
      break;
    case "11":
      _ac(["fas", "fa-poo-storm"]);
      break;
    case "13":
      _ac(["far", "fa-snowflake"]);
      break;
    case "50":
      _ac(["fas", "fa-smog"]);
      break;
    default:
      _ac(["fas", "fa-question-circle"]);
      break;
  }
  return i;
};

/* six day forecast */
const createDailyForecastDivs = (dayWeather) => {
  const dayAbbrText = getDayAbbreviation(dayWeather.dt);
  const dayAbbr = createElem("p", "dayAbbreviation", dayAbbrText);
  const dayIcon = createDailyForecastIcon(
    dayWeather.weather[0].icon,
    dayWeather.weather[0].description
  );
  const dayHigh = createElem("p", "dayHigh", `${_PV(dayWeather.temp.max, "°")}`);
  const dayLow = createElem("p", "dayLow", `${_PV(dayWeather.temp.min, "°")}`);

  return [dayAbbr, dayIcon, dayHigh, dayLow];
};

const displaySixDayForecast = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const dfArray = createDailyForecastDivs(weatherJson.daily[i]);
    displayDailyForecast(dfArray);
  }
};

const displayDailyForecast = (dfArray) => {
  const dayDiv = createElem("div", "forecastDay");
  dfArray.forEach((el) => {
    dayDiv.appendChild(el);
  });
  const dailyForecastContainer = document.getElementById("dailyForecast__content");
  dailyForecastContainer.appendChild(dayDiv);
};

const getDayAbbreviation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = createElem("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025) {
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
    img.altText = altText;
  } else {
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    img.altText = altText;
  }
  return img;
};
/******/
