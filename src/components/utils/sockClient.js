import * as SockJS from "sockjs-client";
import {getDomain} from "../../helpers/getDomain";
import {over} from "stompjs";

export var stompClient = null;
export var sock = null;

let connected = false;
export const isConnected = () => connected;

export const connect = (callback) => {

    const url = getDomain();
    sock = new SockJS(url + '/ws');
    stompClient = over(sock);
    stompClient.connect({}, () => {
        connected = true;
        callback();
    });
    sock.onclose = reason => {
        console.log("Socket closed!", reason);
        connected = false;
    }
}


export const getPlayers = () => {
    stompClient.send("/app/getPlayers", {});
}

export const LeaveWaitingRoom = (username) => {
    stompClient.send("/app/leave", {}, JSON.stringify(username));
}

export const ClearWaitingRoom = () => {
    stompClient.send("/app/clearWaitingRoom", {});
}

export const currentGameStatus = () => {
    stompClient.send("/app/isRunning", {});
}

export const sendName = (username) => {
    console.log('sending username '+username)
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
    console.log('vor player leaves')
    stompClient.send("/app/gameLeft", {})
}

export const gameLost = () => {
    stompClient.send("/app/gameLost", {})
}


export const whyFinished = () => {
    console.log('vor send')
    console.log('this is stompclient: '+JSON.stringify(stompClient))
    stompClient.send("/app/gameStatus", {})
}

const stripResponse = (response) => {
    return JSON.parse(response.body);
}

export const subscribe = (channel, callback) => {
    stompClient.subscribe(channel, r => callback(stripResponse(r)));
}


