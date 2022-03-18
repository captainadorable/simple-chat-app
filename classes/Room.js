class Room {
    constructor (roomId, user, joinURL) { //user is the creator of room
       this.roomId = roomId
       this.users = [user]
       this.joinURL = joinURL
    }  

    AddUser(user) {
        this.users.push(user)
    }

    RemoveUser(userId) {
        this.users = this.users.filter(function(ele){
            return ele.socketId != userId
        });
    }
};

module.exports = Room;