let Utils = {
  findSecondsAgo(from) {
    return Math.abs((new Date() - from)/1000).toFixed(1)
  },

  getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  },

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

export default Utils
