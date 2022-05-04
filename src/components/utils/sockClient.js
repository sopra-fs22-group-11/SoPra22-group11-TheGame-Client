
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {useHistory} from "react-router-dom";
import Game from "../views/Game";
import Waitingroom from "../views/Waitingroom";
import goToGame from "../views/Waitingroom"
import {getDomain} from "../../helpers/getDomain";
import updateUI from "../views/Game";
import forceUpdate from "../views/Game";

class SockClient {

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

    connect(state, setState) {
        //das isch zimlich hässlich :/
        try {
            this.sock.close();
        } catch {}
        const url=getDomain();
        //this.sock = new SockJS('https://sopra-fs22-11-thegame-server.herokuapp.com/ws'); // http://localhost:8081/ws
        this.sock = new SockJS(url+ '/ws');
        this.stompClient = Stomp.over(this.sock);
        this.stompClient.connect({}, () => {
            this._connected = true;
            //console.log("before subscribe");
            this.subscribe('/topic/players', (message)=> { // The response is a list of all the players in the waiting room
                    //const data = JSON.parse(message.body);
                    console.log("this is the response:");
                    console.log(message['playerName']);
                    localStorage.setItem('playerList', message);
            });

            this.subscribe('/topic/game',(message) => { // the message is a tgo
                try {
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
                } catch (error) {
                    console.log(error)
                }


            });

            this.subscribe('/topic/start', (message)=>{ // the message is a tgo
                console.log("Received Message from topic/start")
                console.log("clicked start value: " +localStorage.getItem('clickedStart'))
                console.log(JSON.stringify(message));
                if (JSON.parse(localStorage.getItem('clickedStart')) === false){
                localStorage.setItem('discardCounter', JSON.stringify(0));
                console.log(JSON.stringify(message));
                    localStorage.setItem('clickedStart', JSON.stringify(true));
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

     sendName(username) {
        this.stompClient.send("/app/game", {}, JSON.stringify(username));
    }

    sendDiscard() {
        console.log("it will be sent any minute");
        this.stompClient.send("/app/discard", {}, localStorage.getItem('gto'));
        console.log("it was sent");
    }

    startGame() {
        console.log("at sockclient startGame");
        this.stompClient.send("/app/start", {});
        console.log("send to start game done");
    }

    sendDraw(){
        this.stompClient.send("/app/draw", {} );
        console.log("it was sent");
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


export default new SockClient();