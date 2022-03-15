

const fetch = import('node-fetch');

const { WEATHER_API_KEY }  = process.env;

exports.handler = async (event, context) => {
    const {lat, lon, units} = JSON.parse(event.body);
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    try {
        const w_data = await fetch(url);
        const j_data = await w_data.json();
        return {
            statusCode: 200,
            body: JSON.stringify(j_data)
        };
    } catch(err) {
        return {
            statusCode: 422,
            body: err.stack
        };
    }
}