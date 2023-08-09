// // api= "710bf472e4db9b3a0bfc6b8984516cc1"


// カードをクリックした際の処理
const cardsContainer = document.querySelector('.forecast-cards');
cardsContainer.addEventListener('click', async (event) => {
  const clickedCard = event.target.closest('.card');
  //ここをここを自由に変える
  const cityName="Vancouver";
  if (clickedCard) {
    const selectedDate = clickedCard.getAttribute('data-date');
    await fetchAndDisplay3HoursForecast(selectedDate,cityName);
  }
});

// 3時間ごとの情報を取得し表示する関数
async function fetchAndDisplay3HoursForecast(selectedDate,cityName) {
  // OpenWeatherMap API キーを指定
  const apiKey = '710bf472e4db9b3a0bfc6b8984516cc1';
  // OpenWeatherMap API からデータを取得
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();

  // 選択された日付に該当する情報を抽出
  const selectedDateData = data.list.filter(item => {
    const timestamp = new Date(item.dt * 1000);
    const localTime = formatLocalTime(timestamp); // ローカル時間に変換してフォーマット
    const date = timestamp.toISOString().split('T')[0];
    return date === selectedDate;
  });

  // HTMLに表示するための処理
  const forecastContainer = document.querySelector('.forecasts-3hours');
  forecastContainer.innerHTML = '';

  selectedDateData.forEach(item => {
    const timestamp = new Date(item.dt * 1000);
    const localTime = formatLocalTime(timestamp); // ローカル時間に変換してフォーマット
    const weatherDescription = item.weather[0].description;
    const pop = Math.floor(item.pop*100);
    const temp = item.main.temp;
    const humidity = item.main.humidity;

    // 天気コードに対応する画像を取得
    const weatherIconCode = getWeatherIconCode(weatherDescription);
    const weatherIconUrl = getWeatherIconUrl(weatherIconCode);

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h2 class="time">${localTime}</h2>
      <p class="weather">${weatherDescription}</p>
      <img src="${weatherIconUrl}" alt="${weatherDescription}">
      <p class="pop">Pop: ${pop}%</p>
      <p class="temp">Temp: ${temp.toFixed(2)}°C</p>
      <p class="humidity">Humidity: ${humidity}%</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}

// ローカル時間を0:00 ~ 3:00 のフォーマットに変換する関数
function formatLocalTime(timestamp) {
  const localOffset = 0; 
  const localDate = new Date(timestamp.getTime() + localOffset * 60 * 60 * 1000);

  const startHour = Math.floor(localDate.getHours() / 3) * 3;
  const formattedStartHour = startHour === 0 ? '0:00' : `${startHour}:00`;
  const formattedEndHour = `${startHour + 3}:00`;

  const formattedTime = `${formattedStartHour} ~ ${formattedEndHour}`;

  return formattedTime;
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
    'clouds': '02d',
    'few clouds': '02d',
    'scattered clouds': '03d',
    'broken clouds': '04d',
    'overcast clouds':'04d',
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
