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
 * Returns an URL of a weather icon
 *
 * @param {string} iconId
 * @returns {string}
 */
const getIconUrl = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`

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

const getCurrentWeatherDev = async () => dummy

/**
 * Generate UI by the provided data
 *
 * @param {string} cityName
 * @param {string} iconId
 * @param {number} temp
 * @param {string} weather
 * @param {string} description
 * @param {number} feelsLike
 * @param {number} max
 * @param {number} min
 * @param {number} humidity
 * @param {number} pressure
 */
const generateUI = (
  cityName,
  iconId,
  temp,
  weather,
  description,
  feelsLike,
  max,
  min,
  humidity,
  pressure,
) => {
  const idTextMap = {
    'current-weather-city-name': cityName,
    'current-weather-temp': `${Math.round(temp)}°C`,
    'current-weather-main': weather,
    'current-weather-description': description,
    'current-weather-feels-like': `Feels like: ${feelsLike}°C`,
    'current-weather-temp-max': `Max: ${Math.round(max)}°C`,
    'current-weather-temp-min': `Min: ${Math.round(min)}°C`,
    'current-weather-humidity': `Humidity: ${humidity}%`,
    'current-weather-pressure': `Pressure: ${pressure}hPa`,
  }

  const assignInnerTextById = (id, text) => {
    document.getElementById(id).innerText = text
  }

  document.getElementById('current-weather-icon').src = getIconUrl(iconId)

  for (const [id, val] of Object.entries(idTextMap)) {
    assignInnerTextById(id, val)
  }
}

const main = async () => {

  // const res = await getCurrentWeather(OPEN_WEATHER_API_KEY)

  const res = await getCurrentWeatherDev()
  generateUI(
    res.name,
    res.weather[0].icon,
    res.main.temp,
    res.weather[0].main,
    res.weather[0].description,
    res.main.feels_like,
    res.main.temp_max,
    res.main.temp_min,
    res.main.humidity,
    res.main.pressure,
  )
}

// main()
// console.log(dummy)

document.addEventListener('DOMContentLoaded', () => {
  main();
})