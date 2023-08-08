// TODO: Remove the value whenever you push the code
const OPEN_WEATHER_API_KEY = ''

const dummy = {
  "coord": {
      "lon": -123.1207,
      "lat": 49.2827
  },
  "weather": [
      {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
      }
  ],
  "base": "stations",
  "main": {
      "temp": 22.89,
      "feels_like": 22.96,
      "temp_min": 20.39,
      "temp_max": 25.45,
      "pressure": 1014,
      "humidity": 66
  },
  "visibility": 10000,
  "wind": {
      "speed": 2.57,
      "deg": 180
  },
  "clouds": {
      "all": 75
  },
  "dt": 1691537669,
  "sys": {
      "type": 2,
      "id": 2011597,
      "country": "CA",
      "sunrise": 1691499239,
      "sunset": 1691552542
  },
  "timezone": -25200,
  "id": 6173331,
  "name": "Vancouver",
  "cod": 200
}

/**
 *
 * The default coordinate is Vancouver
 *
 * @param {string} apiKey
 * @param {number} lat
 * @param {number} lon
 * @param {string} units
 * @returns {string}
 */
const getCurrentWeatherEndpoint = (apiKey, lat = 49.2827, lon = -123.1207, units = 'metric') => {
  if (!apiKey) {
    throw new Error('Invalid API key')
  }

  if (!['', 'standard', 'metric', 'imperial'].includes(units)) {
    throw new Error('Invalid unit')
  }

  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
}

/**
 * Call current weather API
 *
 * @param {string} apiKey
 * @param {number} lat
 * @param {number} lon
 * @param {string} units
 * @return {Promise}
 */
const getCurrentWeather = async (apiKey, lat, lon, units) => {
  try {
    const res = (await fetch(getCurrentWeatherEndpoint(apiKey, lat, lon, units))).json()
    return res
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

// TODO: create ui by the data
const generateUI = async () => {
  // TODO: call api
  // TODO: create elements and return

  const res = await getCurrentWeather(OPEN_WEATHER_API_KEY)
  console.log(res)
}

const main = async () => {
  console.log('main func in CurrentWeather.js')
  // TODO: get current weather
  // TODO: generateUI()
}

// main()
console.log(dummy)