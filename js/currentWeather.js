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

/*****************************************************
 *
 * Utils
 *
 *****************************************************/

/**
 * Returns an URL of a weather icon
 *
 * @param {string} iconId
 * @returns {string}
 */
const getIconUrl = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`

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


/*****************************************************
 *
 * API call
 *
 *****************************************************/

const getCurrentWeatherDev = async () => dummy

/**
 * Geocoding API
 *
 * @param {string} apiKey
 * @param {string} cityName
 * @return {Promise}
 */
const getLocation = async (apiKey, cityName) => {
  try {
    const res = (await fetch(getGeocodingApiEndpoint(apiKey, cityName))).json()
    return res
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

/*****************************************************
 *
 * UI
 *
 *****************************************************/




/*****************************************************
 *
 * Like
 *
 *****************************************************/




/**
 * Save value to local storage
 *
 * @param {*} value
 */
const saveLikedItems = (value) => {
  const itemToSave = Array.isArray(value) ? value : [value]
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(itemToSave));
}

/**
 * Save cityName to local storage
 *
 * @param {string} cityName
 */
const like = (cityName) => {
  const cityNameLowerCase = cityName.toLocaleLowerCase()

  const likedItemsRaw = getLikedItems()
  if (!likedItemsRaw) {
    saveLikedItems([cityNameLowerCase])
    return
  }

  const currentLikedItems = JSON.parse(likedItemsRaw)
  if (!Array.isArray(currentLikedItems)) {
    saveLikedItems([cityNameLowerCase])
    return
  }

  currentLikedItems.includes(cityNameLowerCase)
    ? saveLikedItems(currentLikedItems.filter(v => v !== cityNameLowerCase))
    : saveLikedItems(cityNameLowerCase)
}

const handleLikeIconOnClick = () => {
  const cityName = document.getElementById('current-weather-city-name').textContent
  like(cityName)
  toggleLikeIcon()
}


/*****************************************************
 *
 * Select favorite city
 *
 *****************************************************/
const handleDropdownOnChange = async (e) => {
  const value = e.target.value
  if (!value) return

  const geocodingRes = await getLocation(OPEN_WEATHER_API_KEY, value)
  const lat = geocodingRes[0].lat
  const lon = geocodingRes[0].lon

  const currentWeatherRes = await getCurrentWeather(OPEN_WEATHER_API_KEY, lat, lon)

  generateCurrentWeatherUI(
    geocodingRes[0].name,
    currentWeatherRes.weather[0].icon,
    currentWeatherRes.main.temp,
    currentWeatherRes.weather[0].main,
    currentWeatherRes.weather[0].description,
    currentWeatherRes.main.feels_like,
    currentWeatherRes.main.temp_max,
    currentWeatherRes.main.temp_min,
    currentWeatherRes.main.humidity,
    currentWeatherRes.main.pressure,
  )

  isLiked(currentWeatherRes.name) && toggleLikeIcon()
}

/*****************************************************
 *
 * main
 *
 *****************************************************/
const currentWeatherMain = async () => {

  const res = isDev
    ? await getCurrentWeatherDev()
    : await getCurrentWeather(OPEN_WEATHER_API_KEY)

  generateCurrentWeatherUI(
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

  isLiked(res.name) && toggleLikeIcon()
}


/*****************************************************
 *
 * Event listener
 *
 *****************************************************/

window.addEventListener('load',  async () => {
   await currentWeatherMain()
})

likeIcon.addEventListener('click', handleLikeIconOnClick)

favCitySelectBox.addEventListener('change', async (e) => {
  await handleDropdownOnChange(e)
})
