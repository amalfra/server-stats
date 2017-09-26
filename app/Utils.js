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
  },

  humanMemorySize(size) {
    let units = ['B', 'kB', 'MB', 'GB', 'TB']
    if (size === 0) {
      return '0 ' + units[0]
    }

    let i = Math.floor(Math.log(size)/Math.log(1024))
    return (size/Math.pow(1024, i)).toFixed(2) * 1 + ' ' + units[i]
  }
}

export default Utils
