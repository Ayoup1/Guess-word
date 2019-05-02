### Getting started

* Build the instances
``` bash
docker-compose build
```
* Start up
``` bash
docker-compose up
```

### Gif Demo 

<img src="https://media.giphy.com/media/MAdNbpqyoVdhlsLP1B/giphy.gif"  />

[![Demo video](https://media.giphy.com/media/MAdNbpqyoVdhlsLP1B/giphy.gif)](https://drive.google.com/file/d/1_o9zaqdqAOe8ErHY_jetBwByVVpRc5hj/view?usp=sharing)


### Technologies used

##### Backend
* The backend is build with node.js and express

* Currently all data is stored in memory as a map, but should be fairly easy to replace with a real database.
* All game logic is handled by using [socket.io](https://www.npmjs.com/package/socket.io) to communicate
between the server and clients


##### Frontend
* The frontend is created using [Vue.js](https://vuejs.org/).
* [Vuex](https://github.com/vuejs/vuex) a central location from which state data is stored, modified and accessed.
* [socket.io-client](https://github.com/socketio/socket.io-client).
* [Vue-Socket.io-Extended](https://github.com/probil/vue-socket.io-extended).

* [Element Ui](https://element.eleme.io/#/en-US).



