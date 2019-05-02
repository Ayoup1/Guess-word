
const crypto = require("crypto");
const ActivePlayer = require('./ActivePlayer');

let Game = new Map();

const add = (userId,gameName,correctAnswer) => {
    let gameId;
    if (gameId = getAvailableGame()) {
        //Game availble
        addPlayer(gameId, userId);
        if(Game.get(gameId))return Game.get(gameId) // Found Game

    } else {
        // we need to create a new game
        let gameId = randomId();
        addPlayer(gameId, userId,gameName,correctAnswer)
        return Game.get(gameId)
    }

};

const removePlayer = (userId, gameId) =>{
    if(!userId || !gameId) return console.log(':: RemovePlayer Function :: undefined :: gameId && userId');
    let players = Game.get(gameId).players.filter((i) => i.userId !== userId);

    if(players.length === 0){
        // DELETE Game !!!!!
        deleteGame(gameId);
        let socket = ActivePlayer.getSocket(userId);
        socket.emit('CLOSE', userId);
        ActivePlayer.removeSocket(userId);


    }else{
        // Remove player From Game  and Init Game 
        setPlayers(gameId, players);
        Game.get(gameId).hasStarted=false
        Game.get(gameId).questions=[]
        Game.get(gameId).question=null
        Game.get(gameId).round=1
        Game.get(gameId).answer=null
        if(gameId){
            const gameObject= Game.get(gameId)
            let players = getPlayers(gameId);
            for (let player of players) {
                let socket = ActivePlayer.getSocket(player);
                socket.emit('updateGame', gameObject);
            }
        }
    }
    

};
const getGameId = (userId) =>{
    for (let x of Game){
        for(let player of x[1].players){
            if (player.userId === userId) return x[0]
        }
    }
};
const getGameInfo = (gameId) =>{
    return Game.get(gameId);
};
const setPlayers = (gameId, players) =>{
    Game.get(gameId).players = players;
};
const testMatching = (gameId, answer) =>{
    if(Game.get(gameId)){
        return new RegExp("^"+Game.get(gameId).correctAnswer.toLowerCase()+"$","gi").test(answer.toLowerCase())
    }
    
};

const deleteGame = (gameId) => {
    Game.delete(gameId);
};
const getPlayers = (gameId) => {
    if(Game.get(gameId).players === undefined) return;
    let arr = Game.get(gameId).players.map((p) => p.userId);
    return arr;
};

const getAvailableGame = () =>{
    for (let g of Game) {
        if (!g[1].hasStarted) return g[0];
    }
};
const getAllAvailableGame = () =>{
    let gm=[]
    for (let g of Game) {
        if (g[1].hasStarted===false)gm.push(g) 
    }
    return gm;
};


const addPlayer = (gameId, userId,gameName,correctAnswer) => {
    if(Game.get(gameId)) {
        Game.get(gameId).players.push({userId:userId});
        Game.get(gameId).hasStarted=true
    }
    else {
        Game.set(gameId, {
            gameId,
            players: [{userId: userId}],
            hasStarted: false,
            waitingAnswer:false,
            endGame:false,
            owner: userId,
            name:gameName,
            correctAnswer,
            questions:[],
            round: 1,
            rounds: 20,
            // timer: 10
        });
    }
};
const addQuestion = (gameId, question) => {

    let questionId = randomId();
    if(question && Game.get(gameId)){
        
        Game.get(gameId).question={id:questionId,question:question}
        Game.get(gameId).questions.push({id:questionId,question,answer:null});
        Game.get(gameId).waitingAnswer=true
        Game.get(gameId).round=Game.get(gameId).questions.length
    }
    // After 20 questions
    if(Game.get(gameId).round>Game.get(gameId).rounds) {
        winner(gameId,true)

    }
};
const answerQuestion = (gameId, question) => {
    if(question && Game.get(gameId)){
        let questions=Game.get(gameId).questions.filter((i) => i.id !== question.id);
        questions.push(question)
        Game.get(gameId).questions=questions
        Game.get(gameId).waitingAnswer=false
        Game.get(gameId).question={id:null,question:null}
    }
   
};

// 
const randomId = () => {
    return crypto.randomBytes(10).toString('hex');
};
// 
winner =(gameId,bool)=>{
    let gameObject =Game.get(gameId)
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

module.exports = {
    add,
    removePlayer,
    deleteGame,
    getPlayers,
    getGameId,
    setPlayers,
    getGameInfo,
    getAllAvailableGame,
    addQuestion,
    answerQuestion,
    testMatching
};