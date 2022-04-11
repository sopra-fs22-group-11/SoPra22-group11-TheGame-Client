
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
        this.sock = new SockJS('http://localhost:8082/ws');
        this.stomp = Stomp.over(this.sock);
        this.stomp.connect({}, () => {
            this._connected = true;
            this.subscribe('/topic/greetings', function(greeting){
                console.log("Here")
            });
            if (callback) {
                callback();
            }
        });
        this.sock.onclose = r => {
            console.log("Socket closed!", r);
            // TODO: disconnect
        };
    }

    _stripResponse(response) {
        return JSON.parse(response.body);
    }

    subscribe(channel, callback) {
        this.stomp.subscribe(channel, r => callback(this._stripResponse(r)));
    }


}

export default new SockClient();