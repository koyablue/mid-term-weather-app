// /**
//  * Create dropdown menu
//  *
//  */
// const generateFavoriteCityOptions = () => {
//   const likedCitiesRaw = getLikedItems()
//   if (!likedCitiesRaw) return

//   const likedCities = JSON.parse(likedCitiesRaw)
//   if (!Array.isArray(likedCities)) return

//   likedCities.forEach(city => {
//     const option = document.createElement('option')
//     option.value = city
//     option.innerText = city
//     favCitySelectBox.appendChild(option)
//   })
// }

// const favoriteDropdownMain = () => {
//   generateFavoriteCityOptions()
// }

// window.addEventListener('load', favoriteDropdownMain)
