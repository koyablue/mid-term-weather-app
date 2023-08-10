// api= "710bf472e4db9b3a0bfc6b8984516cc1"
//1. 5days
async function fetch5DaysForecast(cityName) {
  const apiKey = '710bf472e4db9b3a0bfc6b8984516cc1';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&cnt=40&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Process and aggregate 5 days forecast data
    const aggregatedData = aggregate5DaysData(data);

   return aggregatedData;


  } catch (error) {
    console.error('Error fetching 5 days forecast:', error);
  }
}



//2. function for editing raw data
function aggregate5DaysData(data) {
  const aggregatedData = {};

  // Loop through the forecast data and aggregate by date
  data.list.forEach(item => {
    const timestamp = new Date(item.dt * 1000);
    const date = timestamp.toLocaleDateString();
    
    if (!aggregatedData[date]) {
      aggregatedData[date] = {
        weatherDescriptions: [],
        temps: [],
        pops: [],
        humidities: [],
      };
    }

    const dailyInfo = aggregatedData[date];

    dailyInfo.weatherDescriptions.push(item.weather[0].description);
    dailyInfo.temps.push(item.main.temp);
    dailyInfo.pops.push(item.pop);
    dailyInfo.humidities.push(item.main.humidity);
  });

  // Calculate averages and other details
  for (const date in aggregatedData) {
    if (aggregatedData.hasOwnProperty(date)) {
      const dailyInfo = aggregatedData[date];

      const avgTemp = calculateAverage(dailyInfo.temps);
      const maxTemp = Math.max(...dailyInfo.temps);
      const minTemp = Math.min(...dailyInfo.temps);
      const avgPop = calculateAverage(dailyInfo.pops);
      const avgHumidity = calculateAverage(dailyInfo.humidities); 

      dailyInfo.avgTemp = avgTemp;
      dailyInfo.maxTemp = maxTemp;
      dailyInfo.minTemp = minTemp;
      dailyInfo.avgPop = avgPop;
      dailyInfo.avgHumidity = avgHumidity; 
    }
  }

  return aggregatedData;
}

//3. calculate average func
function calculateAverage(arr) {
  const sum = arr.reduce((total, value) => total + value, 0);
  return sum / arr.length;
}



//4. get common weather 
function getMostCommonWeather(weatherDescriptions) {
    const weatherCounts = {};
    
    // Count the occurrences of each weather description
    weatherDescriptions.forEach(description => {
        if (!weatherCounts[description]) {
            weatherCounts[description] = 0;
        }
        weatherCounts[description]++;
    });
    
    // Find the most common weather description
    let mostCommonWeather = '';
    let maxCount = 0;
    
    for (const description in weatherCounts) {
        if (weatherCounts.hasOwnProperty(description)) {
            if (weatherCounts[description] > maxCount) {
                maxCount = weatherCounts[description];
                mostCommonWeather = description;
            }
        }
    }
    
    return mostCommonWeather;
}


//5. get weather ico code
function getWeatherIconCode(weatherDescription) {
  const weatherIconMapping = {
    'clear sky': '01d',
    'few clouds': '02d',
    'scattered clouds': '03d',
    'broken clouds': '04d',
    'light rain': '10d',
    'rain': '10d',
    'moderate rain': '10d',
    'shower rain':'09d',
    'heavy intensity rain':'10d',
    'thunderstorm': '11d',
    'snow':'13d',
    'mist':'50d',
  };
  return weatherIconMapping[weatherDescription] || '';
}
//6. get weather icon url
function getWeatherIconUrl(iconCode) {
  return `http://openweathermap.org/img/w/${iconCode}.png`;
}



//7. edit HTML func
function displayForecastDataInCards(data) {
  const cardsContainer = document.querySelector('.forecast-cards');
  cardsContainer.innerHTML = '';

  for (const date in data) {
    if (data.hasOwnProperty(date)) {
      const dailyInfo = data[date];
      const mostCommonWeather = getMostCommonWeather(dailyInfo.weatherDescriptions);

      // get weather icon 
      const weatherIconCode = getWeatherIconCode(mostCommonWeather);
      const weatherIconUrl = getWeatherIconUrl(weatherIconCode);

      const card = document.createElement('div');
      card.classList.add('forecast-card');
      const formattedDate = new Date(date).toISOString().split('T')[0];

      card.innerHTML = `
        <div class="card" data-date="${formattedDate}" id="card-button">
          <h2><strong>${date}</strong></h2>
          <img src="${weatherIconUrl}" alt="${mostCommonWeather}">
        
          <p>${dailyInfo.avgTemp.toFixed(2)} °C</p>
        </div>
      `;

      cardsContainer.appendChild(card);
    }
  }
}


  //8. finally call func
  async function main(cityName) {
    
      try {
        const fiveDaysData = await fetch5DaysForecast(cityName);
        displayForecastDataInCards(fiveDaysData);
      } catch (error) {
        console.error('Error in main:', error);
      }
  }

  

// 9. get city parmeter from url link func
function getQueryParam(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

// get cityName
const cityName = getQueryParam('city');
//call main()
main(cityName);
  

