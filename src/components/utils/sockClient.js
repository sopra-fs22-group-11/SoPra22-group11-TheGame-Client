
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {useHistory} from "react-router-dom";
import Game from "../views/Game";
import Waitingroom from "../views/Waitingroom";
import goToGame from "../views/Waitingroom"

class SockClient {
    callback;
    callback1;


    constructor() {
        this._connected = false;

    }

    isConnected() {
        return this._connected;
    }



    connect() {
        try {
            this.sock.close();
        } catch {
        }
        this.sock = new SockJS('http://localhost:8081/ws');
        this.stompClient = Stomp.over(this.sock);
        this.stompClient.connect({}, () => {
            this._connected = true;
            console.log("before subscribe");
            this.subscribe('/topic/players', (message)=> { // The response is a list of all the players in the waiting room
                    console.log("this is the response:");
                    console.log(message['playerName']);
                    localStorage.setItem('playerList', message);
            });

            this.subscribe('/topic/game',(message) => { // the message is a tgo
                console.log('Received Message from /topic/game'+message.body);
                const obj = message;
                localStorage.setItem('gto', JSON.stringify(obj));
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
                localStorage.setItem('clickedStart', JSON.stringify(true));
                localStorage.setItem('discardCounter', JSON.stringify(0));

                goToGame();
                console.log(JSON.stringify(message));
                //const history = useHistory();
                //history.push('/game');
                }
                const obj = message;
                localStorage.setItem('gto',JSON.stringify(obj));
                console.log("dieses item wurde in den local storage getan:")
                console.log(localStorage.getItem('gto'))

                const saved = JSON.parse(localStorage.getItem('gto'));
                console.log(saved.gameRunning);

                // TODO Add functions which update the gui -Sandra
            });

            this.subscribe('/topic/status', (message)=>{ // the message is a tgo
                console.log("Received Message from topic/status")
                const obj = message;
                localStorage.setItem('gto', JSON.stringify(obj));
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
        alert('Got the greeting');
    }

    sendDiscard() {
        console.log("it will be sent any minute");
        this.stompClient.send("/app/discard", {}, localStorage.getItem('gto'));
        console.log("it was sent");
        //
        alert('Pinggg, it is sent ');
    }

    startGame() {
        console.log("at sockclient startGame");
        this.stompClient.send("/app/start", {});
        console.log("send to start game done");
    }


    _stripResponse(response) {
        return JSON.parse(response.body);
    }

    subscribe(channel, callback) {
        this.stompClient.subscribe(channel, r => callback(this._stripResponse(r)));
    }





}


export default new SockClient();