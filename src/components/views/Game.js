import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import ZoomVideo from '@zoom/videosdk';
import initClientEventListeners from "../../zoom/js/meeting/session/client-event-listeners";
import initButtonClickHandlers from "../../zoom/js/meeting/session/button-click-handlers";
import state from "../../zoom/js/meeting/session/simple-state";
import sessionConfig from "../../zoom/js/config";
import VideoSDK from "@zoom/videosdk";
import HeaderGame from "./HeaderGame";
import {generateSessionToken} from "../../zoom/js/tool";
import {isConnected, sendDiscard, sendName, stompClient, subscribe} from "../utils/sockClient";
import {connect, sendDraw, startGame} from "../utils/sockClient";
import "../views/Waitingroom";


const retrieveGTO = () => {
    const gto = JSON.parse(sessionStorage.getItem('gto'));
    sessionStorage.removeItem('gto');
    return gto;
}

const Game = () => {
    const history = useHistory();

    const [gameObj, setGameObj] = useState(retrieveGTO());

    const [counter, setCounter] = useState(0);
    const [chosenCard, setChosenCard] = useState(null);

    let disableCards = false;
    let disableDrawCards = false;

    const name = localStorage.getItem('username');



    //************************  Websocket  **************************************************


    console.log("game render!", gameObj);

    const registerGameSocket = () => {
        subscribe('/topic/game', msg => {
            setGameObj(msg)
        });
        subscribe('/topic/terminated', msg => {
            history.push('/startpage')
        });
        subscribe('/topic/status', msg => {
            //TODO do something here
        })
    };

    useEffect(() => {
        if (!isConnected()) {
            connect(registerGameSocket);
        }
        else {
            registerGameSocket();
        }

    }, []);


    //************************  Websocket  **************************************************


    //************************  GameLogic  **************************************************

    const checkForDraw = () => {
        if (counter < 2 && (gameObj.noCardsOnDeck>0 || counter <1)) { //This does look silly, but I double-checked, it is fine
            disableDrawCards = true;
        }
    }

    const checkWhoseTurn = () => {
        disableCards = name !== gameObj.whoseTurn;
        return disableCards;
    }

    const discard = (pile, index) => {
        // Build the new handcards
        let newSpecificPlayerCards = [];

        for (let i = 0; i < gameObj.playerCards[name].length; i++) {
            if (gameObj.playerCards[name][i].value != chosenCard) { // Keep at two ==
                newSpecificPlayerCards.push(gameObj.playerCards[name][i]);
            }
        }
        gameObj.playerCards[name] = newSpecificPlayerCards;
        gameObj.pilesList[index].topCard.value = chosenCard;

        setCounter(counter + 1);
        setChosenCard(null);

        sendDiscard(JSON.stringify(gameObj));
    }


    const checkDiscardPossible = (pile, index) => {

        if (checkWhoseTurn() === true) {
            alert("Sorry but is not your turn");
        }
        else if (chosenCard == null) {
            alert("You have not chosen a card, please do so.")
        } else {
            if (validChoice(chosenCard, pile)) {
                discard(pile, index)
            } else {
                alert("you can't play this card, on that pile, sooorryyyyy :(")
            }
        }

    }

    const draw = () => {
        setCounter(0);
        disableCards = true;
        sendDraw();
    }


    const validChoice = (val, pile) => {
        if (pile.direction == "TOPDOWN") { //Keep this at only ==
            if (parseInt(val) < parseInt(pile.topCard.value) || (parseInt(val) - 10) === parseInt(pile.topCard.value)) {
                return true;
            } else {
                return false;
            }
        }
        if (pile.direction == "DOWNUP") { //Keep this at only ==
            if (parseInt(val) > parseInt(pile.topCard.value) || parseInt(val) + 10 === parseInt(pile.topCard.value)) {
                return true;
            } else {
                return false;
            }
        }
    }

    const chooseCard = (val) => {
        if (checkWhoseTurn() === true) {
            alert("Sorry but is not your turn")
        }
        else{
        setChosenCard(JSON.stringify(val));
        }
    }




    //add in this function all methods which need to be called when leaving the page/gameObj
    //TODO add close gameObj method and tell server to close the gameObj
    const close = async () => {
        try {
            await client.leave();
            //this.sock.close();

        } catch (e) {
            console.log(e);
        }
        history.push('/startpage');
    }


    //show popup before leaving
    window.onbeforeunload = function () {
        return 'We do not recommend reloading the page, additionally leaving the page like this (not using Leave Game) is not recommended';
    };

    //do when leaving page
    window.onunload = function () { //TODO take care of those functions such that they differentiate finely
        close();
        alert('Bye.');
    }

    //************************  GameLogic  **************************************************

    //************************  Zoom  *******************************************************

    //for Zoom setup
    const client = ZoomVideo.createClient();
    //const audioTrack = VideoSDK.createLocalAudioTrack();
    //const videoTrack = VideoSDK.createLocalVideoTrack();
    let mediaStream;
    //const canvas = document.querySelector('.video-canvas');


    const joinMeeting = async () => {
        console.log("Let's see our client:")
        console.log(client)

        await initAndJoinSession();

        initClientEventListeners(client, mediaStream);
        console.log('======= Initializing client event handlers done =======');
        await startAudioMuted();
        console.log('======= Starting audio muted done =======');
        await initButtonClickHandlers(client, mediaStream);
        console.log('======= Initializing button click handlers done =======');

        console.log('======= Session joined =======');
    }

    const initAndJoinSession = async () => {
        await client.init('en-US', 'Global');
        const date = new Date().toDateString();
        const sessionTopic = "theGame" + date;
        console.log(sessionTopic);

        const signature = generateSessionToken(
            sessionConfig.sdkKey,
            sessionConfig.sdkSecret,
            sessionTopic,
            sessionConfig.password,
            sessionConfig.sessionKey,
            localStorage.getItem('username')
        );
        try {
            await client.join(
                sessionTopic,
                signature,
                localStorage.getItem('username'),
                sessionConfig.password
            );
            mediaStream = client.getMediaStream();
            state.selfId = client.getSessionInfo().userId;
            console.log("client has joined successfully")
        } catch (e) {
            console.error(e);
        }
    };

    const getClients = () => {
        let participants = client.getAllUser();
        console.log("Below you see the active Zoom clients:")
        console.log(participants)
    }

    const doChatExample = () => {
        const chat = client.getChatClient();
        chat.sendToAll('hello everyone'); // send message to everyone
        //We don't even plan to support private chats therefore only for completeness: chat.send('hello', userId); // send message to someone
        client.on('chat-on-message', (payload) => {
            const {
                message,
                sender: {name: senderName},
                receiver: {name: receiverName},
                timestamp,
            } = payload;
            console.log(
                `Message: ${message}, from ${senderName} to ${receiverName}`
            );
        });
    }


    const startAudioMuted = async () => {

        try {
            await mediaStream.startAudio();
        } catch (e) {
            console.log("We can not start the audio.")
            console.error(e)
        }

        if (!mediaStream.isAudioMuted()) {
            mediaStream.muteAudio();
        }
    }

    //TODO localStorage.setItem('gameId', ); Hier noch herausfinden wie wir schauen, dass leute nur in ihr spiel können
    // siehe gameIdGuard in RouteProtectors

    //************************  Zoom  *******************************************************

    //************************  HTML  *******************************************************

    const listHiddenValues = [true, true, true, true, true, true, true];

    //by default we enter 0 so that there is no null value at the start
    const cardValues = [0, 0, 0, 0, 0, 0, 0];


    //here we fill the cards with the right value
    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        cardValues[i] = gameObj.playerCards[name][i].value;
    }


    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        listHiddenValues[i] = false;
    }


    //check wheter it is players turn and cards should be shown
    checkWhoseTurn();
    checkForDraw();



    //idee um zu zeigen das ein button ausgewählt wurde: { cardSelected?"cards-button selected": "cards-button unselected"}


    let cards = (
        <div className="left bottom">
            <Button id="card1" className="cards-button unselected"
                    hidden={listHiddenValues[0]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[0])}
            >
                {cardValues[0]}
            </Button>
            <Button id="card2" className="cards-button unselected"
                    hidden={listHiddenValues[1]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[1])}
            >
                {cardValues[1]}
            </Button>
            <Button id="card3" className="cards-button unselected"
                    hidden={listHiddenValues[2]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[2])}
            >
                {cardValues[2]}
            </Button>
            <Button id="card4" className="cards-button unselected"
                    hidden={listHiddenValues[3]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[3])}
            >
                {cardValues[3]}
            </Button>
            <Button id="card5" className="cards-button unselected"
                    hidden={listHiddenValues[4]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[4])}
            >
                {cardValues[4]}
            </Button>
            <Button id="card6" className="cards-button unselected"
                    hidden={listHiddenValues[5]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[5])}
            >
                {cardValues[5]}
            </Button>
            <Button id="card7" className="cards-button unselected"
                    hidden={listHiddenValues[6]}
                    disabled={false}
                    onClick={() => chooseCard(cardValues[6])}
            >
                {cardValues[6]}
            </Button>
        </div>


    );

    //show cards nicely
    /*let cards=(
     <section className="wrapper">
         <figure className="card">Card1</figure>
         <figure className="card">Card2</figure>
         <figure className="card">Card3</figure>
         <figure className="card">Card4</figure>
         <figure className="card">Card5</figure>
     </section>)*/

    let informationBox = (
        <div>
            <h3> Information for {localStorage.getItem('username')}</h3>
            <div> Whose Turn: {gameObj.whoseTurn}</div>
            <div> {"Played cards: " + counter}</div>
            <div> {"Chosen card:" + chosenCard}</div>
        </div>
    );

    //************************  HTML  *******************************************************


    //*************************************************************************
    //TODO
    //Comment the next line, when working on the gameObj

    //joinMeeting(); // The Secrets do not work at the moments


    //*************************************************************************

    return (
        <div>
            <HeaderGame height="100"/>
            <BaseContainer className="left">
                <h2></h2>
                <div className="home form">
                    <div className="left top">

                        <Button className="game-button"
                                disabled={false}
                                onClick={() => checkDiscardPossible(gameObj.pilesList[0], 0)}
                        >
                            {gameObj.pilesList[0].topCard.value + "▼"}
                        </Button>
                        <Button className="game-button"
                                disabled={false}
                                onClick={() => checkDiscardPossible(gameObj.pilesList[1], 1)}
                        >
                            {gameObj.pilesList[1].topCard.value + "▼"}
                        </Button>
                        <Button className="game-button"
                                disabled={false}
                                onClick={() => checkDiscardPossible(gameObj.pilesList[2], 2)}
                        >
                            {gameObj.pilesList[2].topCard.value + "▲"}
                        </Button>
                        <Button className="game-button"
                                disabled={false}
                                onClick={() => checkDiscardPossible(gameObj.pilesList[3], 3)}
                        >
                            {gameObj.pilesList[3].topCard.value + "▲"}
                        </Button>
                    </div>
                    <div className="left middle">
                        <Button className="game-button"
                                disabled={disableDrawCards}
                                onClick={() => draw()}
                        >
                            {parseInt(gameObj.noCardsOnDeck)>0 ? "Draw \n (cards on deck: " + gameObj.noCardsOnDeck + ")"
                            : "End turn"}
                        </Button>
                    </div>

                    {cards}
                    <h2></h2>
                </div>

            </BaseContainer>
            <BaseContainer className="right">
                <h2></h2>
                <div id="js-video-view" className="container video-app">
                    <canvas id="video-canvas" className="video-canvas" width="320" height="160"></canvas>
                    <div className="container meeting-control-layer">
                        <button id="js-mic-button" className="meeting-control-button">
                            <i id="js-mic-icon" className="fas fa-microphone-slash"></i>
                        </button>
                        <button id="js-webcam-button" className="meeting-control-button">
                            <i id="js-webcam-icon" className="fas fa-video webcam__off"></i>
                        </button>
                        <div className="vertical-divider"></div>
                        <button id="js-leave-button"
                                className="meeting-control-button meeting-control-button__leave-session">
                            <i id="js-leave-session-icon" className="fas fa-phone"></i>
                        </button>
                    </div>
                </div>
                {informationBox}
                <h2></h2>

                <div className="home important"> IMPORTANT:</div>
                <h3> Please leave the game only via Leave Game, otherwise the game can not be restarted again!</h3>
            </BaseContainer>
        </div>

    );

}

export default Game;