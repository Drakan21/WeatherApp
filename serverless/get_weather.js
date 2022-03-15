

const fetch = import('node-fetch');

const { WEATHER_API_KEY }  = process.env;

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body);
    const { lat, lon, units } = params;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    try {
        const w_data = await fetch(url);
        console.log(w_data);
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