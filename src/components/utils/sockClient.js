/*import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {useHistory} from "react-router-dom";
import Game from "../views/Game";
import Waitingroom from "../views/Waitingroom";
import goToGame from "../views/Waitingroom"

import updateUI from "../views/Game";
import forceUpdate from "../views/Game";
*/

import * as SockJS from "sockjs-client";
import {getDomain} from "../../helpers/getDomain";
import {over} from "stompjs";

export var stompClient = null;
export var sessionId = "";
export var gameL = null;
export var PlayerList = [];
//var currentUser ="";
let connected = false;
const callbacks = [];

export const isConnected = () => connected;

export const connect = (callback) => {
    /*if (gameLink === true){
        return;
    };
    gameL = gameLink;*/

    //currentUser = JSON.parse(localStorage.getItem('username'));
    const url = getDomain();
    var sock = new SockJS(url + '/ws');
    stompClient = over(sock);
    stompClient.connect({}, () => {
        connected = true;
        callback();
        //console.log("before subscribe");
        /*subscribe('/topic/players', (message) => { // The response is a list of all the players in the waiting room
            console.log("this is the response:");
            console.log(message['playerName']);
            PlayerList = message;
            console.log(PlayerList);
            //localStorage.setItem('playerList', message);
        });

        subscribe('/topic/game', (message) => { // the message is a tgo
            console.log('Received Message from /topic/game' + message.body);
            const obj = message;
            setGameObj(obj);
            //localStorage.setItem('gto', JSON.stringify(obj));
            //console.log('Received Message from /topic/game'+ localStorage.getItem('gto'));


            //updateUI();
            //forceUpdate(JSON.stringify(obj));
            console.log(obj.noCardsOnDeck);
            console.log(obj.pilesList);
            console.log(obj.playerCards);
            console.log(obj.gameRunning);


        });*/

        /*subscribe('/topic/start', (message) => { // the message is a tgo
            console.log("Received Message from topic/start")
            console.log("clicked start value: " + localStorage.getItem('clickedStart'))
            console.log(JSON.stringify(message));
            if (JSON.parse(localStorage.getItem('clickedStart')) === false) {
                //localStorage.setItem('clickedStart', JSON.stringify(true));
                localStorage.setItem('discardCounter', JSON.stringify(0));

                //goToGame();
                console.log(JSON.stringify(message));
                //const history = useHistory();
                //history.push('/game');
                localStorage.setItem('clickedStart', JSON.stringify(true));
                //    //const history = useHistory();
                //    //history.push('/game');
                //      //  changePage();
                //       //  goToLogin();
            }
            const obj = message;
            setGameObj(obj);
            //localStorage.setItem('gto',JSON.stringify(obj));
            console.log("dieses item wurde in den local storage getan:")

            //const saved = JSON.parse(localStorage.getItem('gto'));
            //console.log('Is game running: '+saved.gameRunning);

            // TODO Add functions which update the gui -Sandra
        });*/

        /*subscribe('/topic/status', (message) => { // the message is a tgo
            console.log("Received Message from topic/status")
            const obj = message;
            setGameObj(obj);
            //localStorage.setItem('gto', JSON.stringify(obj));
            // TODO Add functions which update the gui -Sandra

        });

        subscribe('/topic/terminated', (message) => { // the message is a tgo
            connected = false;
            //localStorage.setItem('gto', JSON.stringify(obj));
            //const saved = JSON.parse(localStorage.getItem('gto'));
            //console.log('obj after game terminated ' +saved);
            // TODO Add functions which update the gui -Sandra

        });*/


    });
    stompClient.onclose = reason => {
        console.log("Socket closed!", reason);
        connected = false;
    }

}

export const sendName = (username) => {
    console.log("before send name")
    stompClient.send("/app/game", {}, JSON.stringify(username));
    console.log("after send name")
}
/*
var pre = document.createElement("p");
pre.innerHTML = stompClient.send("/app/hello", {}, JSON.stringify("Tijana")).data;
 */
//}

export const sendDiscard = (gameObj) => {
    console.log("it will be sent any minute");
    //this.stompClient.send("/app/discard", {}, localStorage.getItem('gto'));
    stompClient.send("/app/discard", {}, gameObj);
    console.log("it was sent");
    //
    //alert('Pinggg, it is sent ');
}

export const startGame = () => {
    console.log("at sockclient startGame");
    stompClient.send("/app/start", {});
    console.log("send to start game done");
}

export const sendDraw = () => {
    stompClient.send("/app/draw", {});
    console.log("it was sent");
    //alert('Pinggg, it is sent ');
}

export const terminate = () => {
    stompClient.send("/app/gameTerminated", {})
    alert("We sent this")
}


export const stripResponse = (response) => {
    return JSON.parse(response.body);
}

export const subscribe = (channel, callback) => {
    stompClient.subscribe(channel, r => callback(stripResponse(r)));
}


/*class SockClient {
callback;
callback1;


constructor() {
    this._connected = false;

}

isConnected() {
    return this._connected;
}

//random idee vode Marinja: (damit mer LocalStorage weg bechömed)
// chönd mer nöd meh klasse mit klasse variable mache und denn etweder direkt uf die klassevariable (wie bim user) zue griffe
// ODER mir dünd alli variable dete definiere womers bruched --> sprich im game und sie de funktione mitgeh und bechömed
//als return die neu variable zrug

connect() {
    //das isch zimlich hässlich :/
    try {
        this.sock.close();
    } catch {
    }
    const url=getDomain();
    //this.sock = new SockJS('https://sopra-fs22-11-thegame-server.herokuapp.com/ws'); // http://localhost:8081/ws
    this.sock = new SockJS(url+ '/ws');
    this.stompClient = Stomp.over(this.sock);
    this.stompClient.connect({}, () => {
        this._connected = true;
        //console.log("before subscribe");
        this.subscribe('/topic/players', (message)=> { // The response is a list of all the players in the waiting room
                console.log("this is the response:");
                console.log(message['playerName']);
                localStorage.setItem('playerList', message);
        });

        this.subscribe('/topic/game',(message) => { // the message is a tgo
            console.log('Received Message from /topic/game'+message.body);
            const obj = message;
            localStorage.setItem('gto', JSON.stringify(obj));
            console.log('Received Message from /topic/game'+ localStorage.getItem('gto'));

            //updateUI();
            //forceUpdate(JSON.stringify(obj));
            console.log(obj.noCardsOnDeck);
            console.log(obj.pilesList);
            console.log(obj.playerCards);
            console.log(obj.gameRunning);

        });

        this.subscribe('/topic/start', (message)=>{ // the message is a tgo
            console.log("Received Message from topic/start")
            console.log("clicked start value: " +localStorage.getItem('clickedStart'))
            console.log(JSON.stringify(message));
            if (JSON.parse(localStorage.getItem('clickedStart')) === false){
            //localStorage.setItem('clickedStart', JSON.stringify(true));
            localStorage.setItem('discardCounter', JSON.stringify(0));

            //goToGame();
            console.log(JSON.stringify(message));
            //const history = useHistory();
            //history.push('/game');
                localStorage.setItem('clickedStart', JSON.stringify(true));
            //    //const history = useHistory();
            //    //history.push('/game');
            //      //  changePage();
           //       //  goToLogin();
            }
            const obj = message;
            localStorage.setItem('gto',JSON.stringify(obj));
            console.log("dieses item wurde in den local storage getan:")
            console.log(localStorage.getItem('gto'))

            const saved = JSON.parse(localStorage.getItem('gto'));
            console.log('Is game running: '+saved.gameRunning);

            // TODO Add functions which update the gui -Sandra
        });

        this.subscribe('/topic/status', (message)=>{ // the message is a tgo
            console.log("Received Message from topic/status")
            const obj = message;
            localStorage.setItem('gto', JSON.stringify(obj));
            // TODO Add functions which update the gui -Sandra

        });

        this.subscribe('/topic/terminated', (message)=>{ // the message is a tgo
            let obj = message;
            localStorage.setItem('gto', JSON.stringify(obj));
            const saved = JSON.parse(localStorage.getItem('gto'));
            console.log('obj after game terminated ' +saved);
            // TODO Add functions which update the gui -Sandra

        });



        });
    this.sock.onclose = r => {
        console.log("Socket closed!", r);
        // TODO: disconnect
    };




}

// callback = function(responseMessage){ // The response is a list of all the players in the waiting room
//                   console.log("this is the response:");
//    //     console.log(responseMessage[0]['playerName'])
//    //     localStorage.setItem('playerlist', responseMessage)
// }

//callback1 = function (responseMessage){
//    console.log("In gamObject subscription response")
//    console.log(responseMessage)
//
//
//}
 sendName(username) {
    this.stompClient.send("/app/game", {}, JSON.stringify(username));
    /*
    var pre = document.createElement("p");
    pre.innerHTML = stompClient.send("/app/hello", {}, JSON.stringify("Tijana")).data;
     */
//}

/*sendDiscard() {
    console.log("it will be sent any minute");
    this.stompClient.send("/app/discard", {}, localStorage.getItem('gto'));
    console.log("it was sent");
    //
    //alert('Pinggg, it is sent ');
}

startGame() {
    console.log("at sockclient startGame");
    this.stompClient.send("/app/start", {});
    console.log("send to start game done");
}

sendDraw(){
    this.stompClient.send("/app/draw", {} );
    console.log("it was sent");
    //alert('Pinggg, it is sent ');
}

terminate(){
    this.stompClient.send("/app/gameTerminated", {})
    alert("We sent this")
}


_stripResponse(response) {
    return JSON.parse(response.body);
}

subscribe(channel, callback) {
    this.stompClient.subscribe(channel, r => callback(this._stripResponse(r)));
}


}


export default new SockClient();*/