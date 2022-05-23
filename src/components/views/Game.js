import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import ZoomVideo from '@zoom/videosdk';
import initClientEventListeners from "../../zoom/js/meeting/session/client-event-listeners";
import initButtonClickHandlers from "../../zoom/js/meeting/session/button-click-handlers";
import state from "../../zoom/js/meeting/session/simple-state";
import sessionConfig from "../../zoom/js/config";
import VideoSDK from "@zoom/videosdk";
import HeaderGame from "./HeaderGame";
import {generateSessionToken} from "../../zoom/js/tool";
import {
    gameLost,
    isConnected,
    ClearWaitingRoom,
    sendDiscard,
    subscribe
} from "../utils/sockClient";
import {getSignature} from "../../zoom/js/tool";
import {connect, sendDraw, whyFinished} from "../utils/sockClient";
import "../views/Waitingroom";
import TheGameLogo from '../../TheGameLogo.png';
import Modal from "../ui/Modal";
import Backdrop from "../ui/Backdrop";
import {api, handleError} from "../../helpers/api";


const retrieveGTO = () => {
    const gto = JSON.parse(sessionStorage.getItem('gto'));
    return gto;
}

const Game = () => {
    const history = useHistory();

    const [gameObj, setGameObj] = useState(retrieveGTO());

    const [counter, setCounter] = useState(0);
    const [chosenCard, setChosenCard] = useState(null);
    const [indexChosenCard, setIndexChosenCard] = useState(null);

    let disableCards = false;
    let disableDrawCards = false;
    let listOfPlayers = [];

    const name = sessionStorage.getItem('username');

    const playerListAndCards = [];

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [textToDisplay, setTextToDisplay] = useState("");


    let playerRight;
    let playerTop;
    let playerLeft;


    //************************  Websocket  **************************************************


    console.log("game render!", gameObj);

    const registerGameSocket = () => {
        subscribe('/topic/game', msg => {
            setGameObj(msg)
            sessionStorage.setItem('gto', JSON.stringify(msg))
        });
        subscribe('/topic/status', msg => {
            setModalIsOpen(true);
            if (msg === "won") {
                onWon();
            } else if (msg === "lost") {
                onLost();
            } else if (msg === "left") {
                onLeft();
            } else {
                alert("There seems to be an error")
            }
        })
    };

    useEffect(() => {
        if (!isConnected()) {
            connect(registerGameSocket);
        } else {
            registerGameSocket();
        }

    }, []);


    //************************  Websocket  **************************************************


    //************************  GameLogic  **************************************************

    const checkForDraw = () => {
        if (counter < 2 && (gameObj.noCardsOnDeck > 0 || counter < 1)) { //This does look silly, but I double-checked, it is fine
            disableDrawCards = true;
        }
    }

    const checkWhoseTurn = () => {
        disableCards = name !== gameObj.whoseTurn;
        return disableCards;
    }

    const checkForFinishedGame = () => {
        sessionStorage.setItem('go', JSON.stringify(gameObj))
        if (!gameObj.gameRunning) {
            whyFinished()
        }
    }

    const discard = (pile, index) => {
        // Build the new handcards
        let newSpecificPlayerCards = [];

        for (let i = 0; i < gameObj.playerCards[name].length; i++) {
            if (gameObj.playerCards[name][i].value != chosenCard) { // Keep at two ==
                newSpecificPlayerCards.push(gameObj.playerCards[name][i]);
            }

            let id_unselected = "owncard " + (i+1).toString();
            document.getElementById(id_unselected).className = "card";
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
        } else if (chosenCard == null) {
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
        for (let i = 0; i < gameObj.playerCards[name].length; i++) {
            let id_unselected = "owncard " + (i+1).toString();
            document.getElementById(id_unselected).className = "card";
        }
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

    const chooseCard = (index, val) => {
        if (checkWhoseTurn() === true) {
            alert("Sorry but is not your turn")
        } else {
            setChosenCard(JSON.stringify(val));
            const id_selected = "owncard " + (index+1).toString();
            for (let i = 0; i < gameObj.playerCards[name].length; i++) {
                let id_unselected = "owncard " + (i+1).toString();
                document.getElementById(id_unselected).className = "card";
            }
            document.getElementById(id_selected).className = "card nth-child("+index+1+") selected";
        }
    }

    // Create list of players and their ownCards
    for (const [player, noOfCards] of Object.entries(gameObj.playerCards)) {
        console.log(player, noOfCards.length);
        let data = [player, noOfCards.length];
        playerListAndCards.push(data);
        console.log(playerListAndCards);
        if (name != player) {
            listOfPlayers.push(player);
        }
    }


    //add in this function all methods which need to be called when leaving the page/gameObj
    //TODO add close gameObj method and tell server to close the gameObj
    const close = async (destination) => {
        let un = sessionStorage.getItem('username')
        let id = sessionStorage.getItem('loggedInUser')
        let token = sessionStorage.getItem('token')
        try {
            client.leave()
            this.sock.close();
        } catch (e) {
            console.log(e);
        }finally {
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('loggedInUser', id)
            sessionStorage.setItem('username', un)
            sessionStorage.removeItem('playerList')
            sessionStorage.removeItem('gameStatus')
            sessionStorage.removeItem('gto');
            history.push(destination)
            return;

        }
    }

    const closeAndRedirect = async () => {
        await close('/startpage')
    }

    /*//show popup before leaving
    window.onbeforeunload = function () {
        return 'We do not recommend reloading the page, additionally leaving the page like this (not using Leave Game) is not recommended';
    };

    //do when leaving page
    window.onunload = function () { //TODO take care of those functions such that they differentiate finely
        closeAndRedirect()
        alert('Bye.');
    }*/

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
        const sessionKey = "session" + date;
        console.log(sessionTopic);
        console.log(sessionKey);

        const signature = await getSignature(sessionTopic, sessionKey, name);
       // const signature = JSON.stringify(signatureResponse);

        console.log("seg: " + signature);

        const newSignature = signature.slice(1,signature.length -1);
        console.log("new seg: " + newSignature);

        try {
            await client.join(
                sessionTopic,
                newSignature,
                name,
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

    let listHiddenValues = [true, true, true, true, true, true, true];
    //const[showOwnCards, setShowOwenCards]=useState(listHiddenValues);
    let listSelectedValues =[false, false, false, false, false, false];


    //by default, we enter 0 so that there is no null value at the start
    let cardValues = [0, 0, 0, 0, 0, 0, 0];

    const listHiddenValues2 = [true, true, true, true, true, true, true];

    //by default, we enter 0 so that there is no null value at the start
    const cardValues2 = [0, 0, 0, 0, 0, 0, 0];


    //here we fill our ownCards with the right value
    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        cardValues[i] = gameObj.playerCards[name][i].value;
    }


    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        listHiddenValues[i] = false;
    }
    //setShowOwenCards(listHiddenValues);


    //here we fill the ownCards of the other player
    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        cardValues2[i] = gameObj.playerCards[name][i].value;
    }


    for (let i = 0; i < gameObj.playerCards[name].length; i++) {
        listHiddenValues2[i] = false;
    }

    function closeModal() {
        setModalIsOpen(false);
    }



    //check wheter it is players turn and ownCards should be shown
    checkWhoseTurn();
    checkForDraw();
    checkForFinishedGame();


    //idee um zu zeigen das ein button ausgewählt wurde: { cardSelected?"ownCards-button selected": "ownCards-button unselected"}


    let ownCards = (
        <section className="wrapper">
            <button id="owncard 1"className={gameObj.playerCards[name].length > 0 ? "card" : "card hidden"}
                    display="none"
                    disabled={false}
                    onClick={() => chooseCard(0, cardValues[0])}
            >
                {cardValues[0]}
            </button>
            <button id="owncard 2" className={gameObj.playerCards[name].length > 1 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(1,cardValues[1])}
            >
                {cardValues[1]}</button>
            <button id="owncard 3" className={gameObj.playerCards[name].length > 2 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(2,cardValues[2])}
            >
                {cardValues[2]}
            </button>
            <button id="owncard 4" className={gameObj.playerCards[name].length > 3 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(3,cardValues[3])}
            >
                {cardValues[3]}
            </button>
            <button id="owncard 5" className={gameObj.playerCards[name].length > 4 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(4,cardValues[4])}
            >
                {cardValues[4]}
            </button>
            <button id="owncard 6" className={gameObj.playerCards[name].length > 5 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(5,cardValues[5])}
            >
                {cardValues[5]}
            </button>
            <button id="owncard 7" className={gameObj.playerCards[name].length > 6 ? "card" : "card hidden"}
                    disabled={false}
                    onClick={() => chooseCard(6,cardValues[6])}
            >
                {cardValues[6]}
            </button>
        </section>);

    console.log("list of Players" + listOfPlayers.length);

    if (listOfPlayers.length + 1 === 2) {
        playerTop = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)
    } else if (listOfPlayers.length + 1 === 3) {
        playerRight = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)

        playerTop = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)

    } else {
        playerRight = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[0]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)

        playerTop = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[1]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)

        playerLeft = (
            <section className="wrapper">
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 0 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 1 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 2 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 3 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 4 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 5 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
                <div className={gameObj.playerCards[listOfPlayers[2]].length > 6 ? "cardPlayer" : "cardPlayer hidden"}
                >
                    <img src={TheGameLogo} alt="game Logo" height="60%"/>
                </div>
            </section>)

    }


    let drawPile = (
        <section className="wrapper">
            <button className="drawPile"
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                Finished Move
            </button>
            <button className={gameObj.noCardsOnDeck > 1 ? "drawPile" : "drawPile hidden"}
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                <img src={TheGameLogo} alt="game Logo" height="60%"/>
                {gameObj.noCardsOnDeck}
            </button>
            <button className={gameObj.noCardsOnDeck > 2 ? "drawPile" : "drawPile hidden"}
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                <img src={TheGameLogo} alt="game Logo" height="60%"/>
                {gameObj.noCardsOnDeck}
            </button>
            <button className={gameObj.noCardsOnDeck > 3 ? "drawPile" : "drawPile hidden"}
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                <img src={TheGameLogo} alt="game Logo" height="60%"/>
                {gameObj.noCardsOnDeck}
            </button>
            <button className={gameObj.noCardsOnDeck > 4 ? "drawPile" : "drawPile hidden"}
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                <img src={TheGameLogo} alt="game Logo" height="60%"/>
                {gameObj.noCardsOnDeck}
            </button>
            <button className={gameObj.noCardsOnDeck > 5 ? "drawPile" : "drawPile hidden"}
                    disabled={disableDrawCards}
                    onClick={() => draw()}
            >
                <img src={TheGameLogo} alt="game Logo" height="60%"/>
                {gameObj.noCardsOnDeck}
            </button>

        </section>)


    /*let informationBox = (
        <div>
            <h3> Information for {localStorage.getItem('username')}</h3>
            <div> Whose Turn: {gameObj.whoseTurn}</div>
            <div> {"Played ownCards: " + counter}</div>
            <div> {"Chosen card:" + chosenCard}</div>
        </div>
    );*/

    const getCssForPlayer = (player) => {
        if (player === gameObj.whoseTurn & player === name) {
            return "user-game player selected"
        } else if (player == gameObj.whoseTurn & player !== name) {
            return "user-game others selected"
        } else if (player != gameObj.whoseTurn & player === name) {
            return "user-game player unselected"
        } else if (player != gameObj.whoseTurn & player !== name) {
            return "user-game others unselected"
        }
    }




    const getScoreOfCurrentPlayers =async (title, text) => {
        let getRequestResult

        try {
            const response = await api.get('/users');
            console.log("get request happened")

            await new Promise(resolve => setTimeout(resolve, 700));

            // Get the returned users and update the state.
            getRequestResult = response.data;

            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
        } catch (error) {
            console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the users! See the console for details.");
        }


        //setTimeout( function () {
        let go = JSON.parse(sessionStorage.getItem('go'))
        let names = Object.keys(go.playerCards);
        console.log(names);
        const usersAndScores = [];
        console.log("print users hook:")
        console.log(getRequestResult)
        for (const user of getRequestResult) {
            console.log(user.username)
            if (names.includes(user.username)) {
                usersAndScores.push(user)
            }
        }

        console.log("users and scores:" + JSON.stringify(usersAndScores[0]))

        const scorelist = (
            <table className="score user-table">
                <thead>
                <tr>
                    <th className="score labelAccent">Username</th>
                    <th className="score labelAccent">Score</th>
                </tr>
                </thead>
                <tbody>
                {usersAndScores.map(sortedUser => (
                    <tr key={sortedUser.id}>
                        <td>{sortedUser.username}</td>
                        <td>{sortedUser.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )

        onLostOrWon(title, text, scorelist)
        return scorelist
        //}, 2000)

    }


    function onLost() {
        getScoreOfCurrentPlayers("Better luck next time :(","You have lost the Game.");
        // onLostOrWon("Better luck next time :(", "You have lost the Game.", scoretable)
    }

    function onWon() {
        getScoreOfCurrentPlayers("Congratulations :)","You have won the Game.");
        // onLostOrWon("Congratulations :)", "You have won the Game.", scoretable)
    }

    const leaveButton = (
        <Button className ="player-button"
            disabled = {false}
            width = "33%"
        /* eslint-disable-next-line no-restricted-globals */
            onClick={() => {close('/startpage')}}
    >
        Leave
    </Button>
    )
    const playAgainButton = (
        <Button className ="player-button"
                disabled = {false}
                width = "33%"
            /* eslint-disable-next-line no-restricted-globals */
                onClick={() => {close('/waitingroom/1')
                }}
        >
            Play Again
        </Button>
    )

    function onLostOrWon(headerText, descriptionText, score){
        setTextToDisplay(<div>
            <h2> {headerText}</h2>
            <p>{descriptionText}</p>
              {score}


            <Button className ="player-button"
                    disabled = {false}
                    width = "33%"
                /* eslint-disable-next-line no-restricted-globals */
                    onClick={() => {close('/scoreboard')
                    }}
            >
                Score
            </Button>
            {leaveButton}
            {playAgainButton}
        </div>);
    }

    function test(){
        client.leave();
    }


    function onLeft () {
        setTextToDisplay(<div>
            <h2> Your game is over </h2>
            <p>Someone's leaving the Game. </p>
            {leaveButton}
            {playAgainButton}
        </div>);
    }


    //************************  HTML  *******************************************************





    //*************************************************************************
    //TODO
    //Comment the next line, when working on the gameObj


    joinMeeting();


    //*************************************************************************

    return (
        <div>
            <HeaderGame height="100"/>
            <BaseContainer className = "gameBoard">
                <h2> </h2>
                <BaseContainer className = "overlay">
                    {modalIsOpen && <Modal text ={textToDisplay}/>}
                    {modalIsOpen &&<Backdrop />}
                </BaseContainer>
                    <div className="game formGame">
                    <div className="gameBoard top">
                        <div className="gameBoard rotation180">

                            {playerTop}
                        </div>
                    </div>
                    <div className="gameBoard middle">
                        <div className="gameBoard middle players_left">
                            <div className="gameBoard rotation90">
                                {playerLeft}
                            </div>
                        </div>
                        <div className="gameBoard middle DrawAndPileArea">
                            <div className="gameBoard middle DrawAndPileArea pileArea">
                                <Button className ="game-button"
                                        disabled = {false}
                                        onClick ={() => checkDiscardPossible(gameObj.pilesList[0], 0)}
                                >
                                    {gameObj.pilesList[0].topCard.value + "▼"}
                                </Button>
                                <Button className ="game-button"
                                        disabled = {false}
                                        onClick={() => checkDiscardPossible(gameObj.pilesList[1], 1)}
                                >
                                    {gameObj.pilesList[1].topCard.value + "▼"}
                                </Button>
                                <Button className ="game-button"
                                        disabled = {false}
                                        onClick={() => checkDiscardPossible(gameObj.pilesList[2], 2)}
                                >
                                    {gameObj.pilesList[2].topCard.value +"▲"}
                                </Button>
                                <Button className ="game-button"
                                        disabled = {false}
                                        onClick={() => checkDiscardPossible(gameObj.pilesList[3], 3)}
                                >
                                    {gameObj.pilesList[3].topCard.value +"▲"}
                                </Button>
                            </div>
                            <div className="gameBoard middle DrawAndPileArea drawArea">
                                    {drawPile}
                            </div>
                        </div>
                        <div className="gameBoard middle players_right">
                            <div className="gameBoard rotationMinus90">
                                {playerRight}
                            </div>
                        </div>

                    </div>
                    <div className="gameBoard bottom" >
                        {ownCards}
                    </div>


                    <h2> </h2>

                </div>

            </BaseContainer>
            <BaseContainer className="right">
                <div className="right-top" >
                <h2> </h2>

                {playerListAndCards.map(item => (
                        <button className={getCssForPlayer(item[0])} >
                            <div key={item}>

                                {item[0] == gameObj.whoseTurn? "Playing: " +item[0]: item[0]}
                            </div>

                        </button>

                ))}


                </div>
                <div className="right-middle">
                    <div className="new-Label">
                        Communication:
                    </div>

                    <button id="js-mic-button" className="meeting-control-button">
                        <i id="js-mic-icon" className="fas fa-microphone-slash"></i>
                    </button>


                </div>


                <div className="right-button">


                <Button className ="cannotplay-button"
                        disabled = {false}
                        onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            let result = confirm("Are you sure you have no moves left, this will end the game for you and your teammates.")
                            if(result){
                                gameLost();
                        }
                        }
                }
                >
                    No Moves Possible
                </Button>
                </div>
            </BaseContainer>
        </div>

    );

}


export default Game;