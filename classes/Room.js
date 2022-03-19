class Room {
  constructor(roomId, name, isPrivate, joinURL) { //user is the creator of room
    this.roomId = roomId
    this.name = name
    this.isPrivate = isPrivate
    this.users = []
    this.joinURL = joinURL
  }

  AddUser(user) {
    this.users.push(user)
  }

  RemoveUser(userId) {
    this.users = this.users.filter(function(ele) {
      return ele.socketId != userId
    });
  }
};

module.exports = Room;