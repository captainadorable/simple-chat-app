const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

class User {
  constructor(socketId, userName) {
    this.socketId = socketId;
    this.userName = userName;

    var randomColor = "#"
    for (var i = 0; i < 6; i++) {
      if (Math.floor(Math.random() * 2) == 1) { //Random number
        randomColor += Math.floor(Math.random() * 9)
      }
      else { // Random char
        randomColor += alphabet[Math.floor(Math.random() * alphabet.length)]
      }
    }

    this.chatColor = randomColor
  }
}

module.exports = User;