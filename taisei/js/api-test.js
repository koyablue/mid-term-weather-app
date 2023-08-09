



// 3時間ごとの情報を取得し表示する関数
async function fetchAndDisplay3HoursForecast(cityName) {
  // OpenWeatherMap API キーを指定
  const apiKey = '710bf472e4db9b3a0bfc6b8984516cc1';
  // OpenWeatherMap API からデータを取得
  const timeZone = 'America/Vancouver'; 

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&tz=${timeZone}`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
}

fetchAndDisplay3HoursForecast("Vancouver");