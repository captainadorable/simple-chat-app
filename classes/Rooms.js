class Rooms {
  constructor() {
    this.rooms = []
  }

  CreateRoom(room) {
    this.rooms.push(room);
  }

  RemoveRoom(room) {
    this.rooms = this.rooms.filter(function(ele) {
      return ele != room
    });
  }

  RemoveEmptyRooms() {
    this.rooms = this.rooms.filter(function(ele) {
      return ele.users.length != 0
    });
  }

  GetRoomFromId(roomId) {
    let foundRoom = this.rooms.find(r => r.roomId == roomId);
    return foundRoom ? foundRoom : false;
  }

  GetRoomFromUserId(userId) {
    let foundRoom = this.rooms.find(r => r.users.find(u => u.socketId == userId));
    return foundRoom ? foundRoom : false
  }

  GetPublicRooms() {
    let foundRooms = this.rooms.filter(function(ele) {
      return ele.isPrivate == 'false'
    })

    return foundRooms
  }
};

module.exports = Rooms;