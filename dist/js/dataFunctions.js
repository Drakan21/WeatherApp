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

export const parseValue = (value, sym="") => {
    return `${Math.round(Number(value))}${sym}`;
}

export const getWeatherFromCoords = async (location)=> {
    const urlDataObj = {
        lat: location.getLatitude(),
        lon: location.getLongitude(),
        units: location.getUnits()
    };
    console.log(urlDataObj);
    try {
        console.log(JSON.stringify(urlDataObj))
        const w_data = await fetch("./.netlify/functions/get_weather", {
            method: 'POST',
            body: JSON.stringify(urlDataObj)
        });
        console.log(w_data);
        const j_data = await w_data.json();
        return j_data;
    } catch(err) {
        console.error(err);
    }
}


/* request functions */
export const getCoordsFromApi = async (entry, units) => {
    const urlDataObj = {
        entry,
        units    
    };
    console.log(urlDataObj);
    try {
        
        const w_data = await fetch("./.netlify/functions/get_coords", {
            method: 'POST',
            body: JSON.stringify(urlDataObj)
        });
        const j_data = await w_data.json();
        return j_data;
    } catch(err) {
        console.error(err);
    }
}
