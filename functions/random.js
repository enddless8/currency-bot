function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomFromArray(arr) {
  return arr[getRandomInt(arr.length)]
}

module.exports.getRandomInt = getRandomInt
module.exports.getRandomFromArray = getRandomFromArray