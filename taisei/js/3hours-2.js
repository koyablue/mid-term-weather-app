
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
  
  // 前日の日付を取得
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayDate = prevDay.toISOString().split('T')[0];

    // 前日の情報を抽出
    const prevDayData = data.list.filter(item => {
    const timestamp = new Date(item.dt * 1000);
    const date = timestamp.toISOString().split('T')[0];
    return date === prevDayDate && timestamp.getUTCHours() >= 21; // 0時以降の情報を取得
    });

    // 選択した日付の情報に24時までの情報を追加
    const nextDayData = data.list.filter(item => {
    const timestamp = new Date(item.dt * 1000);
    const date = timestamp.toISOString().split('T')[0];
    return date === selectedDate && timestamp.getUTCHours() <= 24; // 24時までの情報を取得
    });

    // prevDayData と selectedDateData と nextDayData を結合
    const combinedData = prevDayData.concat(selectedDateData, nextDayData);




  // HTMLに表示するための処理
  const forecastContainer = document.querySelector('.forecasts-3hours');
  forecastContainer.innerHTML = '';

  combinedData.forEach(item => {
    const timestamp = new Date(item.dt * 1000);
    const localTime = formatLocalTime(timestamp); // ローカル時間に変換してフォーマット
    const weatherDescription = item.weather[0].description;
    const pop = item.pop;
    const temp = item.main.temp;
    const maxTemp = item.main.temp_max;
    const minTemp = item.main.temp_min;
    const humidity = item.main.humidity;

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <p>${localTime}</p>
      <p>${weatherDescription}</p>
      <p>Pop: ${pop}%</p>
      <p>Avg Temp: ${temp.toFixed(2)}°C</p>
      <p>Max Temp: ${maxTemp.toFixed(2)}°C</p>
      <p>Min Temp: ${minTemp.toFixed(2)}°C</p>
      <p>Humidity: ${humidity}%</p>
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
