
const fetch = require('node-fetch');

const { WEATHER_API_KEY }  = process.env;

exports.handler = async (event, context) => {
    const { entry, units } = JSON.parse(event.body);
    const regex = /^d+$/g;
    const flag = regex.test(entry) ? 'zip' : 'q';
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entry}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encUrl = encodeURI(url);

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
            body: err.Stack
        }
    }
}