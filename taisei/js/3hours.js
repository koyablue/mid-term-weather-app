// // api= "710bf472e4db9b3a0bfc6b8984516cc1"

// when card clicked, this process will happen↓
const cardsContainer = document.querySelector('.forecast-cards');
cardsContainer.addEventListener('click', async (event) => {
  const clickedCard = event.target.closest('.card');

  // get cityName
  const cityName = getQueryParam('city')
  // const lon = getLonFromQueryParam('lon');
  // const lat = getLatFromQueryParam('lat');

  if (clickedCard) {
    const selectedDate = clickedCard.getAttribute('data-date');
    await fetchAndDisplay3HoursForecast(selectedDate,cityName);
  }
});


//1. 3hours func
async function fetchAndDisplay3HoursForecast(selectedDate,cityName) {
  const apiKey = '710bf472e4db9b3a0bfc6b8984516cc1';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&cnt=40&units=metric`;
  const response = await fetch(url);
  const data = await response.json();

  // extract info related to selectedDate
  const selectedDateData = data.list.filter(item => {
    const timestamp = new Date(item.dt * 1000);
    const localTime = formatLocalTime(timestamp);
    const date = timestamp.toISOString().split('T')[0];
    return date === selectedDate;
  });

  // edit HTML here
  const forecastContainer = document.querySelector('.forecasts-3hours');
  forecastContainer.innerHTML = '';

  selectedDateData.forEach(item => {
    const timestamp = new Date(item.dt * 1000);
    const localTime = formatLocalTime(timestamp); 
    const weatherDescription = item.weather[0].description;
    const pop = Math.floor(item.pop*100);
    const temp = item.main.temp;
    const humidity = item.main.humidity;

    // get weather icon
    const weatherIconCode = getWeatherIconCode(weatherDescription);
    const weatherIconUrl = getWeatherIconUrl(weatherIconCode);

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h2 class="time">${localTime}</h2>
      <img src="${weatherIconUrl}" alt="${weatherDescription}">
      <p class="pop">Pop: ${pop}%</p>
      <p class="temp">Temp: ${temp.toFixed(2)}°C</p>
      <p class="humidity">Humidity: ${humidity}%</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}





//2. change localTime format func
function formatLocalTime(timestamp) {
  const localOffset = 0; 
  const localDate = new Date(timestamp.getTime() + localOffset * 60 * 60 * 1000);
  const startHour = Math.floor(localDate.getHours() / 3) * 3;
  const formattedStartHour = startHour === 0 ? '0:00' : `${startHour}:00`;
  // const formattedEndHour = `${startHour + 3}:00`;
  const formattedTime = `${formattedStartHour} ~ `;
  return formattedTime;
}


//3. get weather ico code
function getWeatherIconCode(weatherDescription) {
  const weatherIconMapping = {
    'clear sky': '01d',
    'clouds': '02d',
    'few clouds': '02d',
    'scattered clouds': '03d',
    'broken clouds': '04d',
    'overcast clouds':'04d',
    'light rain': '09d',
    'rain': '10d',
    'moderate rain': '09d',
    'thunderstorm': '11d',
    'snow':'13d',
    'mist':'50d',
  };
  return weatherIconMapping[weatherDescription] || '';
}

//4. get weather icon url
function getWeatherIconUrl(iconCode) {
  return `http://openweathermap.org/img/w/${iconCode}.png`;
}



// 5. get city parmeter from url link func
//ここは、lat,lonを指定してapiリクエストするように変更する
function getQueryParam(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
};
