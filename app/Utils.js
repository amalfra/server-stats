let Utils = {
  findSecondsAgo(from) {
    return Math.abs((new Date() - from)/1000).toFixed(1)
  },

  getRandomColour() {
    let colours = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
      'violet', 'purple', 'pink', 'brown', 'grey', 'black']
    return colours[Math.floor(Math.random() * colours.length)]
  },

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

export default Utils
