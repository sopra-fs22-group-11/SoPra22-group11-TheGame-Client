import {useCallback, useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
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
import sockClient from "../utils/sockClient";
import SockClient from "../utils/sockClient";
import {Views} from "./simple-view-switcher";
import {string} from "sockjs-client/lib/utils/random";

const User = ({user}) => (
    <div className="user container">
        <div className="user username">{user.username}</div>
        <div className="user name">{user.name}</div>
        <div className="user id">id: {user.id}</div>
    </div>
);


User.propTypes = {
    user: PropTypes.object
};

const Game =  () => {
    //************************  Websocket  **************************************************

    //for Websocket setup
    //TODO is this stille used?!
    const [gameObj2, setGameObj2] = useState(JSON.parse(localStorage.getItem('gto')));


    //************************  Websocket  **************************************************

    //************************  GameLogic  **************************************************
    //navigate trough Pages
    const history = useHistory();
    let disableCards = false;
    let  disableDrawCards = false;
    const [counter, setCounter] = useState(0);
    const [chosenCard, setChosenCard] = useState(null);
    //const [playerList, setPlayerList] = useState([]);
    const playerList = [];
    const name= localStorage.getItem('username');
    console.log("just before the draw option")

    if (counter<2){
        disableDrawCards =true;
        console.log("we are changing the value" + JSON.stringify(disableCards));}
    console.log(disableDrawCards);
    localStorage.setItem('disableDraw',true);
    let drawLabel = "Draw";


    //TODO add Running Game Logic


    const checkWhoseTurn =  ()=>{
        console.log("It is the turn of " + gameObj2.whoseTurn);
        const gameTemp = JSON.parse(localStorage.getItem('gto'));
        const whoseTurn = gameTemp.whoseTurn;

        if (name == whoseTurn ){
            disableCards = false;

        } else {
            disableCards = true;
        }
        return disableCards;

    }


    const allowedToDrawCard =  ()=>{

        return localStorage.getItem('draw');
    }

    const checkDiscardPossible =  (pile, index)=>{

        if (checkWhoseTurn()=== true){
            alert("Sorry but is not your turn");
        }


        if (chosenCard == null){
            alert("You have not chosen a card, please do so.")
        } else {
            console.log(chosenCard);
            if(validChoice(chosenCard, pile)){
                //take card from hand and put card into piles list
                //we do all the stuff below to update the gto object

                let newSpecificPlayerCards = [];


                for (let i = 0; i < gameObj2.playerCards[name].length; i++) {
                    if (gameObj2.playerCards[name][i].value != chosenCard){
                        newSpecificPlayerCards.push(gameObj2.playerCards[name][i]);
                    }
                }
                gameObj2.playerCards[name] = newSpecificPlayerCards;


                gameObj2.pilesList[index].topCard.value = chosenCard;

                //actually update

                console.log("LocalStorage gto: " + localStorage.getItem('gto'));
                console.log(" hook gto: " + gameObj2);
                gameObj2.playerCards[name] = newSpecificPlayerCards;

                setCounter(counter+1);
                console.log("the Discard counter is: " + counter);


                setChosenCard(null);
                console.log("just before sending to server")

                localStorage.setItem('gto', JSON.stringify(gameObj2));
                sockClient.sendDiscard();



            } else{
                alert("you can't play this card, on that pile, sooorryyyyy :(")
            }
        }

    }


    const draw = () => {
        showGameObject();
        setCounter(0);
        disableCards = true;
        //TODO change local storage turn;
        sockClient.sendDraw();
    }


    const validChoice = (val, pile) => {
        if (pile.direction == "TOPDOWN"){
            if(parseInt(val) < parseInt(pile.topCard.value) || (parseInt(val) - 10)  === parseInt(pile.topCard.value))
            {return true;}
            else {return false;}
        }
        if (pile.direction == "DOWNUP") {
            if (parseInt(val) > parseInt(pile.topCard.value) || parseInt(val) + 10 === parseInt(pile.topCard.value)) {
                return true;
            } else {
                return false;
            }
        }
    }

    const chooseCard = (val) => {
        if (checkWhoseTurn()== true){
            alert("Sorry but is not your turn")
        }
        setChosenCard(JSON.stringify(val));
    }

    const updateUI = () =>{
        getClients();

        console.log("we are in the update function")
        setGameObj2(JSON.parse(localStorage.getItem('gto')));
        showGameObject();

        console.log(gameObj2);
    }



    // Create list of players
    //const getPlayers = () => {
        for (const [player, noOfCards] of Object.entries(gameObj2.playerCards)) {
            console.log(player, noOfCards.length);
            var data = [player, noOfCards.length];
            playerList.push(data);
            console.log(playerList);
        }
        //setPlayerList(playerList);
      //  return playerList;
    //}



    //add in this function all methods which need to be called when leaving the page/gameObj
    //TODO add close gameObj method and tell server to close the gameObj
    const myfun = async ()=>{
        try{
            await client.leave();
            //this.sock.close();


        } catch (e){
            console.log("was not in a meeting");
        }
    }



    //show popup before leaving
    window.onbeforeunload = function(){
        return 'Are you sure you want to leave?';
    };

    //do when leaving page
    window.onunload = function() {
        myfun();
        alert('Bye.');
    }

    //change location
    const goToHome = async () => {
        setGameObj2(null);
        console.log(gameObj2);

        try{
            await client.leave();
        }catch (e) {
            alert("Problems when leave the meeting")
        }
        history.push('/startpage');
    }

    const showGameObject = () => {
        console.log(gameObj2);
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
                sender: { name: senderName  },
                receiver: { name: receiverName  },
                timestamp,
            } = payload;
            console.log(
                `Message: ${message}, from ${senderName} to ${receiverName}`
            );
        });
    }


    const startAudioMuted = async () => {

        try{
            await mediaStream.startAudio();
        } catch (e) {
            console.log("We can not start the audio.")
            console.error(e)
        }

        if (!mediaStream.isAudioMuted()) {
            mediaStream.muteAudio();
        }
    }

    // localStorage.setItem('gameId', ); Hier noch herausfinden wie wir schauen, dass leute nur in ihr spiel können
    // siehe gameIdGuard in RouteProtectors

    //************************  Zoom  *******************************************************

    //************************  HTML  *******************************************************

    const listHiddenValues = [true, true, true, true, true, true, true];

    //by default we enter 0 so that there is no null value at the start
    const cardValues= [0, 0, 0, 0, 0, 0, 0];



    //here we fill the cards with the right value
    for (let i = 0; i < gameObj2.playerCards[name].length; i++) {
        cardValues[i] = gameObj2.playerCards[name][i].value;
        console.log(cardValues[i]);
    }


    for (let i = 0; i < gameObj2.playerCards[name].length; i++) {
        listHiddenValues[i] = false;
    }


    //check wheter it is players turn and cards should be shown
    checkWhoseTurn();
    allowedToDrawCard();



    //idee um zu zeigen das ein button ausgewählt wurde: { cardSelected?"cards-button selected": "cards-button unselected"}


    let cards = (
        <div  className="left bottom">
            <Button id="card1" className ="cards-button unselected"
                    hidden={listHiddenValues[0]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[0])}
            >
                {cardValues[0]}
            </Button>
            <Button id="card2" className ="cards-button unselected"
                    hidden={listHiddenValues[1]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[1])}
            >
                {cardValues[1]}
            </Button>
            <Button id="card3" className ="cards-button unselected"
                    hidden={listHiddenValues[2]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[2])}
            >
                {cardValues[2]}
            </Button>
            <Button id="card4" className ="cards-button unselected"
                    hidden={listHiddenValues[3]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[3])}
            >
                {cardValues[3]}
            </Button>
            <Button id="card5" className ="cards-button unselected"
                    hidden={listHiddenValues[4]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[4])}
            >
                {cardValues[4]}
            </Button>
            <Button id="card6" className ="cards-button unselected"
                    hidden={listHiddenValues[5]}
                    disabled = {false}
                    onClick={() => chooseCard(cardValues[5])}
            >
                {cardValues[5]}
            </Button>
            <Button id="card7" className ="cards-button unselected"
                    hidden={listHiddenValues[6]}
                    disabled = {false}
                    onClick={() => chooseCard( cardValues[6])}
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

    let informationBox =(
        <div>
            <h3> Information for {localStorage.getItem('username')}</h3>
            <div> Whose Turn: {gameObj2.whoseTurn}</div>
            <div> {"Played cards: "+counter }</div>
            <div> {"Chosen card:"+ chosenCard }</div>
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
            <BaseContainer className = "left">
                <h2> </h2>
                <div className="home form">
                <div className="left top">

                    <Button className ="game-button"
                            disabled = {false}
                            onClick ={() => checkDiscardPossible(gameObj2.pilesList[0], 0)}
                    >
                        {gameObj2.pilesList[0].topCard.value + "▼"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {false}
                            onClick={() => checkDiscardPossible(gameObj2.pilesList[1], 1)}
                    >
                        {gameObj2.pilesList[1].topCard.value + "▼"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {false}
                            onClick={() => checkDiscardPossible(gameObj2.pilesList[2], 2)}
                    >
                        {gameObj2.pilesList[2].topCard.value +"▲"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {false}
                            onClick={() => checkDiscardPossible(gameObj2.pilesList[3], 3)}
                    >
                        {gameObj2.pilesList[3].topCard.value +"▲"}
                    </Button>
                </div>
                <div className="left middle">
                    <Button className ="game-button"
                            disabled = {disableDrawCards}
                            onClick={() => draw()}
                    >
                        {drawLabel + "\n (cards on deck: " +  gameObj2.noCardsOnDeck + ")"}
                    </Button>
                </div>

                {cards}
                    <h2> </h2>
                </div>

            </BaseContainer>
            <BaseContainer className = "right">
                <h2> </h2>
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
                <h2> </h2>
                <h3> List of Players: </h3>
                <ul>
                    {playerList.map(item => (
                        <li>
                            <Button className ="primary-button">
                        <div key={item}>{item[0]} {"has"} {item[1]} {"cards"}</div>
                            </Button>
                            </li>
                    ))}
                </ul>


                <h2> </h2>
                <Button className ="user-button"
                        disabled = {false}
                        onClick={() => updateUI()}
                >
                    update
                </Button>
                <h2> </h2>
                <div className="home important" > IMPORTANT:</div>
                <h3> Please leave the game only via Leave Game, otherwise the game can not be restarted again!</h3>
            </BaseContainer>
        </div>

    ) ;

}

export default Game;