
import Stomp from "stompjs";
import SockJS from "sockjs-client";

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
            this.subscribe('/topic/players', this.callback);

            this.subscribe('/topic/game',(message) => { // the message is a tgo
                //console.log('message  of /topic/game'+message.body);
                const obj = message;
                localStorage.setItem('gto', JSON.stringify(obj));
                console.log(localStorage.getItem('gto'));
                console.log(obj.playerCards);
                console.log(obj.gameRunning);

            });

            this.subscribe('/topic/start', (message)=>{ // the message is a tgo
                //console.log('message  of /topic/start'+message.body);
                const obj = message;
                localStorage.setItem('gto',JSON.stringify(obj));
                /*const obj2 = JSON.parse(localStorage.getItem('gto'));
                console.log(obj2.gameRunning);
                console.log(obj.playerCards);
                console.log(obj.gameRunning);*/
                console.log("Received Message from topic/start")
                // TODO Add functions which update the gui -Sandra
            });

            this.subscribe('/topic/status', (message)=>{ // the message is a tgo
                console.log("Received Message from topic/status")
                const obj = message;
                localStorage.setItem('gto',obj);
                // TODO Add functions which update the gui -Sandra

            });



            });
        this.sock.onclose = r => {
            console.log("Socket closed!", r);
            // TODO: disconnect
        };




    }

    callback = function(responseMessage){ // The response is a list of all the players in the waiting room
        console.log("this is the response:");
        console.log(responseMessage[0]['playerName'])
    }

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
    startGame(){
        this.stompClient.send("/app/start", {});

    }



    _stripResponse(response) {
        return JSON.parse(response.body);
    }

    subscribe(channel, callback) {
        this.stompClient.subscribe(channel, r => callback(this._stripResponse(r)));
    }





}


export default new SockClient();