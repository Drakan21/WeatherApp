export const setLocationObject = (location, coordinates) => {
    const { lat, lon, name, unit } = coordinates;
    location.setLatitude(lat);
    location.setLongitude(lon);
    location.setName(name);
    if(unit) location.setUnits(unit);
}

export const getHomeLocation = (key) => {
    return JSON.parse(localStorage.getItem(key));
}
export const setHomeLocation = (key, location) => {
    localStorage.setItem(key, JSON.stringify(location));
}

export const cleanText = (value) => {
    const t = document.createElement('span');
    t.innerText = value;
    value = t.innerHTML;
    const entryText = value.replaceAll(/ {2,}/g, ' ').trim();
    return entryText;
}
export const toProperCase = (text) => {
    if(!text) return "";
    const words = text.split(" ");
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
}

export const parseValue = (value, sym="") => `${Math.round(Number(value))}${sym}`;

export const getWeatherFromCoords = async (location)=> {
    // const lat = locationObj.getLatitude();
    // const lon = locationObj.getLongitude();
    // const units = locationObj.getUnits();
    // const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    // try {
    //     const wData = await fetch(url);
    //     const jsonWeather = await wData.json();
    //     return jsonWeather;
    // } catch(err) {
    //     // console.error(err?.stack)
    //     // report error to remote endpoint??
    // }
    const urlDataObj = {
        lat: location.getLatitude(),
        lon: location.getLongitude(),
        units: location.getUnits()
    };
    try {
        const w_data = await fetch("./.netlify/functions/get_weather", {
            method: 'POST',
            body: JSON.stringify(urlDataObj)
        });
        const j_data = await w_data.json();
        return j_data;
    } catch(err) {
        console.err(err);
    }
}


/* request functions */
export const getCoordsFromApi = async (entry, units) => {
    // const regex = /^\d+$/g;
    // const flag = regex.test(entry) ? 'zip' : 'q';
    // const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entry}&units=${units}&appid=${WEATHER_API_KEY}`;
    // const encodedUrl = encodeURI(url);
    // try {
    //     const wData = await fetch(encodedUrl);
    //     const jsonWeather = await wData.json();
    //     return jsonWeather;
    // } catch(err){
    //     // console.error(err?.stack);
    //     // report error to remove endpoint??
    // }

    const urlDataObj = {
        entry,
        units    
    };
    try {
        const w_data = await fetch("./.netlify/function/get_coords", {
            method: 'POST',
            body: JSON.stringify(urlDataObj)
        });
        const j_data = await w_data.json();
        return j_data;
    } catch(err) {
        console.error(err);
    }
}
