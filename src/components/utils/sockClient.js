import * as SockJS from "sockjs-client";
import {getDomain} from "../../helpers/getDomain";
import {over} from "stompjs";

export var stompClient = null;

let connected = false;
export const isConnected = () => connected;

export const connect = (callback) => {
    //Todo Make sure there is not too many websocket connections open, use the connected boolean
    const url = getDomain();
    var sock = new SockJS(url + '/ws');
    stompClient = over(sock);
    stompClient.connect({}, () => {
        connected = true;
        callback();
    });
    stompClient.onclose = reason => {
        console.log("Socket closed!", reason);
        connected = false;
    }
}

export const sendName = (username) => {
    stompClient.send("/app/game", {}, JSON.stringify(username));
}

export const startGame = () => {
    stompClient.send("/app/start", {});
}

export const sendDraw = () => {
    stompClient.send("/app/draw", {});
}

export const sendDiscard = (gameObj) => {
    stompClient.send("/app/discard", {}, gameObj);
}

export const playerLeaves = () => {
    stompClient.send("/app/gameLeft", {})
}

export const gameLost = () => {
    stompClient.send("/app/gameLost", {})
}


export const whyFinished = () => {
    stompClient.send("/app/gameStatus", {})
}

const stripResponse = (response) => {
    return JSON.parse(response.body);
}

export const subscribe = (channel, callback) => {
    stompClient.subscribe(channel, r => callback(stripResponse(r)));
}

