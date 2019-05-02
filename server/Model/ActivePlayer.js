

const userToSocket = new Map()
const socketToUser = new Map()

function registerSocket(socket, userId,userName,owner){
    socketToUser.set(socket.id,{userName,owner});
    userToSocket.set(userId,socket);

}

function removeSocket(socketId){

    const userId = socketId 
    this.socketToUser.delete(socketId);
    userToSocket.delete(userId);
}
function  getSocket(userId){
    return userToSocket.get(userId);
}



module.exports = {registerSocket, removeSocket, getSocket ,userToSocket ,socketToUser};