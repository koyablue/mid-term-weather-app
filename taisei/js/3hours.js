// // api= "710bf472e4db9b3a0bfc6b8984516cc1"



//3hours
async function fetch3HoursForecast(cityName, timestamp) {
  const apiKey = '710bf472e4db9b3a0bfc6b8984516cc1';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&cnt=8&units=metric&start=${timestamp}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching 3 hours forecast:', error);
  }
}

function displayForecastData(forecastData, tableId) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = '';

  forecastData.list.forEach(item => {
    const timestamp = new Date(item.dt * 1000);
    const date = timestamp.toLocaleDateString();
    const time = timestamp.toLocaleTimeString();

    const weatherDescription = item.weather[0].description;
    const pop = item.pop;
    const avgTemp = item.main.temp;
    const maxTemp = item.main.temp_max;
    const minTemp = item.main.temp_min;
    const humidity = item.main.humidity;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${time}</td>
      <td>${weatherDescription}</td>
      <td>${pop}</td>
      <td>${avgTemp}</td>
      <td>${maxTemp}</td>
      <td>${minTemp}</td>
      <td>${humidity}</td>
    `;

    tableBody.appendChild(row);
  });
}


async function main() {
  const cityName = 'Vancouver';

  // const fiveDaysData = await fetch5DaysForecast(cityName);
  // displayAggregatedData(fiveDaysData, 'fiveDaysForecastTable');

  const currentDate = new Date();
  const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  // Generate timestamp for the selected date
  const timestamp = selectedDate.toISOString();

  const threeHoursData = await fetch3HoursForecast(cityName, timestamp);
  displayForecastData(threeHoursData, 'threeHoursForecastTable');
}

main();


