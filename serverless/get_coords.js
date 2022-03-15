const fetch = import("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { entry, units } = params;
  const regex = /^\d+$/g;
  const flag = regex.test(entry) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entry}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encUrl = encodeURI(url);

  try {
    const wdata = await fetch(encUrl);
    const jdata = await wdata.json();
    return {
      statusCode: 200,
      body: jdata ? JSON.stringify(jdata) : "",
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
};
