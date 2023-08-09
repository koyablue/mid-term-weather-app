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
// function displayForecastDataInTable(data) {
//     const tableBody = document.querySelector('#fiveDaysForecastTable tbody');
//     tableBody.innerHTML = '';
  
//     for (const date in data) {

//       if (data.hasOwnProperty(date)) {
//         const dailyInfo = data[date];
//         const mostCommonWeather = getMostCommonWeather(dailyInfo.weatherDescriptions);
  
  
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${date}</td>
//           <td>${mostCommonWeather}</td>
//           <td>${dailyInfo.avgTemp.toFixed(2)}</td>
//         `;
  
//         tableBody.appendChild(row);
//       }
//     }
//   }
function displayForecastDataInCards(data) {
  const cardsContainer = document.querySelector('.forecast-cards');
  cardsContainer.innerHTML = '';

  for (const date in data) {
    if (data.hasOwnProperty(date)) {
      const dailyInfo = data[date];
      const mostCommonWeather = getMostCommonWeather(dailyInfo.weatherDescriptions);

      // 天気コードに対応する画像を取得
      const weatherIconCode = getWeatherIconCode(mostCommonWeather);
      const weatherIconUrl = getWeatherIconUrl(weatherIconCode);

      const card = document.createElement('div');
      card.classList.add('forecast-card');
      const formattedDate = new Date(date).toISOString().split('T')[0];

      card.innerHTML = `
        <div class="card" data-date="${formattedDate}" id="card-button">
          <h2><strong>${date}</strong></h2>
          <p>${mostCommonWeather}</p>
          <img src="${weatherIconUrl}" alt="${mostCommonWeather}">
        
          <p>Temp: ${dailyInfo.avgTemp.toFixed(2)} °C</p>
        </div>
      `;

      cardsContainer.appendChild(card);
    }
  }
}
  



function getWeatherIconCode(weatherDescription) {
  // 天気説明を基に天気コードを取得
  // 例: 'light rain' -> '09d'
  // 注意: 実際のデータと一致させる必要があります
  // マッピングにない場合は適切な対応を行ってください
  // （空文字列やデフォルトのコードなど）
  // この例では手動でマッピングを作成しています
  // 実際にはAPIの仕様やデータに合わせて適切に取得する必要があります
  const weatherIconMapping = {
    'clear sky': '01d',
    'few clouds': '02d',
    'scattered clouds': '03d',
    'broken clouds': '04d',
    'light rain': '09d',
    'rain': '10d',
    'thunderstorm': '11d',
    'snow':'13d',
    'mist':'50d',
  };
  return weatherIconMapping[weatherDescription] || '';
}

function getWeatherIconUrl(iconCode) {
  // 天気コードに基づいてアイコンのURLを構築
  // 例: '09d' -> 'http://openweathermap.org/img/w/09d.png'
  return `http://openweathermap.org/img/w/${iconCode}.png`;
}


  //finally call 
  async function main() {
    // ↓ここを自由に変える
      const cityName = 'Vancouver';
    
      try {
        const fiveDaysData = await fetch5DaysForecast(cityName);
        displayForecastDataInCards(fiveDaysData);
      } catch (error) {
        console.error('Error in main:', error);
      }
  }
  
  main();
  

  // const allCards = document.querySelectorAll('.forecast-card');
  // allCards.forEach(card => {
  //   card.addEventListener('click', (event) => {
  //     const clickedCard = event.currentTarget;
      
  //     // クリックされたカードにクラスを追加
  //     clickedCard.classList.toggle('clicked');
      
  //     // すでにクリックされたカード以外のクラスをリセット
  //     allCards.forEach(otherCard => {
  //       if (otherCard !== clickedCard) {
  //         otherCard.classList.remove('clicked');
  //       }
  //     });
    
  //     // ここで他の部分の表示を切り替える処理を実装することができます
  //   });
  // });
  
