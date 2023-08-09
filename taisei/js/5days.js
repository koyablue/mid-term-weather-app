// api= "710bf472e4db9b3a0bfc6b8984516cc1"
//5days
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



//function for editing raw data
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

function calculateAverage(arr) {
  const sum = arr.reduce((total, value) => total + value, 0);
  return sum / arr.length;
}



//get common weather 
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


//edit dom
function displayForecastDataInTable(data) {
    const tableBody = document.querySelector('#fiveDaysForecastTable tbody');
    tableBody.innerHTML = '';
  
    for (const date in data) {

      if (data.hasOwnProperty(date)) {
        const dailyInfo = data[date];
        const mostCommonWeather = getMostCommonWeather(dailyInfo.weatherDescriptions);
  
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${date}</td>
          <td>${mostCommonWeather}</td>
          <td>${dailyInfo.avgPop.toFixed(2)}</td>
          <td>${dailyInfo.avgTemp.toFixed(2)}</td>
          <td>${dailyInfo.maxTemp.toFixed(2)}</td>
          <td>${dailyInfo.minTemp.toFixed(2)}</td>
          <td>${dailyInfo.avgHumidity.toFixed(2)}</td>
        `;
  
        tableBody.appendChild(row);
      }
    }
  }
  


  //finally call 
  async function main() {
      const cityName = 'Vancouver';
    
      try {
        const fiveDaysData = await fetch5DaysForecast(cityName);
        displayForecastDataInTable(fiveDaysData); // 結果をDOMに表示
      } catch (error) {
        console.error('Error in main:', error);
      }
  }
  
  main();
  