
const express = require('express');

const ActivePlayer = require('./Model/ActivePlayer');
const Game = require('./Model/Game.js');

const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});


const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(`__ New connection __ :: ${socket.id}`);
    updateGame()

    onJOIN(socket)           // Player joined 
    onCreateGame(socket)     // Player Created new  game
    onAskingQuestion(socket) // Player asked Q
    onAnswerQuestion(socket) // Player Answer Q
    onGuessAnswer(socket)    // Player Guess Answer
    onRetry(socket)

    onDisconnect(socket)
});

// Join
onJOIN = (socket) => {
    socket.on('JOIN', (data) =>{

        ActivePlayer.registerSocket(socket, socket.id,data.name,false);
        enterGame(socket.id,data.gameName)

    });
}
// Create Game
onCreateGame = (socket) => {
    socket.on('CREATE_GAME', (data) =>{

        ActivePlayer.registerSocket(socket, socket.id,data.name,true);
        enterGame(socket.id,data.gameName,data.correctAnswer)

    });
}

// ASK_QUESTION
onAskingQuestion= (socket) => {
    socket.on('ASK_QUESTION', (data) =>{

        Game.addQuestion(data.gameId, data.question);
        UpdateGameForPlayers(data.gameId)

    });
    
}

// ANSWER_QUESTION
onAnswerQuestion= (socket) => {
    socket.on('ANSWER_QUESTION', (data) =>{

        Game.answerQuestion(data.gameId, data.question);
        UpdateGameForPlayers(data.gameId)

    });
    
}
// GUESS_ANSWER
onGuessAnswer=(socket)=>{
    socket.on('GUESS_ANSWER', (data) =>{
        let check =Game.testMatching(data.gameId,data.answer)
        if(check){
            // Correct 
            winner(data.gameId,false)
        }else{
            //  ANSWER_FALSE
          socket.emit('ANSWER_FALSE', false);
        }

    })
}
// RETRY
onRetry= (socket) => {
    socket.on('RETRY', (data)=>{
        const userId=socket.id
        if (userId !== undefined) {
            const gameId = Game.getGameId(userId);
            killGame(gameId)
            Game.deleteGame(gameId); 
        }
        
        updateGame()
    });
}
// disconnect
onDisconnect= (socket) => {
    socket.on('disconnect', ()=>{
        const userId=socket.id
        if (userId !== undefined) {
            const user =ActivePlayer.socketToUser.get(userId)
            const gameId = Game.getGameId(userId);
            if(user && user.owner===true){
                killGame(gameId)
                Game.deleteGame(gameId);                
    
            }else{
                // Remove disconnected player 
                console.log(`Player :: ${userId} :: disconnected From Game :: ${gameId}`)
                Game.removePlayer(userId, gameId);
                ActivePlayer.removeSocket(socket.id);
            }
        }
        console.log(`User ${userId} is disconnected.`);

        updateGame()
    });
}


/* ----- @Helpers ----- */
/* ----- ******** ----- */

updateGame=()=>{
    io.emit('ACTIVE_USERS', ActivePlayer.userToSocket.size)
    const allGames=Game.getAllAvailableGame().length
    io.emit('AVAILABLE_GAMES', allGames)
}

UpdateGameForPlayers=(gameId)=>{
    let gameObject = Game.getGameInfo(gameId);
    let players = Game.getPlayers(gameId);
    for (let player of players) {
        let socket = ActivePlayer.getSocket(player);
        socket.emit('updateGame', gameObject);
    }
}

enterGame=(socketId,gameName,correctAnswer)=>{
    let gameObject = Game.add(socketId,gameName,correctAnswer);
    const userId=socketId
    const user =ActivePlayer.socketToUser.get(userId)
    
    let socketI = ActivePlayer.getSocket(userId);
    socketI.emit('updatePlayer', user);
    socketI.emit('updateGame', gameObject);
    updateGame()
}

winner =(gameId,bool)=>{
    let gameObject =Game.getGameInfo(gameId)
    let players = Game.getPlayers(gameId);
    gameObject.endGame=true
    for (let player of players) {
        let socket = ActivePlayer.getSocket(player)
        const user =ActivePlayer.socketToUser.get(player)

        if(user.owner===bool){user.winner=true}else{user.winner=false}

        socket.emit('updatePlayer', user)
        socket.emit('updateGame', gameObject);
    }
}

killGame= (gameId) => {
    let players = Game.getPlayers(gameId);
    for (let player of players) {
        let socket = ActivePlayer.getSocket(player);
        if(socket){
            socket.emit('CLOSE', player);
            ActivePlayer.removeSocket(player);
        }

    }   
}

/* ----- ******** ----- */
/* ----- ******** ----- */