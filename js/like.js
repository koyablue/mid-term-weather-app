const LOCAL_STORAGE_KEY = 'ciccc-wmad-weather-app'

/**
 *
 *
 * @param {*} localStorageKey
 * @returns {string | null}
 */
const getLikedItems = (localStorageKey) => localStorage.getItem(localStorageKey)

/**
 *
 *
 * @param {string} localStorageKey
 * @param {*} value
 */
const saveLikedItems = (localStorageKey, value) => {
  const itemToSave = Array.isArray(value) ? value : [value]

  localStorage.setItem(localStorageKey, JSON.stringify(itemToSave));
}

/**
 *
 *
 * @param {string} cityName
 */
const like = (cityName) => {
  const likedItems = getLikedItems(LOCAL_STORAGE_KEY)

  if (!likedItems) {
    saveLikedItems(LOCAL_STORAGE_KEY, [cityName])
    return
  }

  const currentLikedItems = JSON.parse(likedItems)

  const itemsToSave = Array.isArray(currentLikedItems)
    ? currentLikedItems.push(cityName)
    : [cityName]

    saveLikedItems(itemsToSave)
}

// TODO: added, removed

// TODO: isLiked
const toggleLikedIcon = () => {
  // onLoad, getLikedItems->contain?color:no-color
  const likedItems = getLikedItems(LOCAL_STORAGE_KEY)

}
