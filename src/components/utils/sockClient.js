
import Stomp from "stompjs";
import SockJS from "sockjs-client";

class SockClient {

    constructor() {
        this._connected = false;

    }

    isConnected() {
        return this._connected;
    }



    connect(callback) {
        try {
            this.sock.close();
        } catch {
        }
        this.sock = new SockJS('http://localhost:8081/ws');
        this.stompClient = Stomp.over(this.sock);
        this.stompClient.connect({}, () => {
            this._connected = true;
            console.log("before subscribe");
            this.subscribe('/topic/players', callback)
        });
        this.sock.onclose = r => {
            console.log("Socket closed!", r);
            // TODO: disconnect
        };
        callback = function(responseMessage){
            console.log("this is the response:")
            console.log(responseMessage)
        }
    }

     sendName(username) {
        this.stompClient.send("/app/game", {}, JSON.stringify(username));
        /*
        var pre = document.createElement("p");
        pre.innerHTML = stompClient.send("/app/hello", {}, JSON.stringify("Tijana")).data;
         */
        alert('Got the greeting');
    }



    _stripResponse(response) {
        return JSON.parse(response.body);
    }

    subscribe(channel, callback) {
        this.stompClient.subscribe(channel, r => callback(this._stripResponse(r)));
    }





}


export default new SockClient();