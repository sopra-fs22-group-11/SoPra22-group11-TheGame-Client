import {useEffect, useState} from 'react';
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
    const [users, setUsers] = useState(null);
    const [user, setUser] = useState(null);
    console.log("here wer are at the Game");
    const gameObj = JSON.parse(localStorage.getItem('gto'));
    console.log("Is the Game running: "+ gameObj.gameRunning);
    console.log("Show Players cards: "+ JSON.stringify(gameObj.playerCards));
    console.log("No of Cards on Deck: " +gameObj.noCardsOnDeck);
    const [running, setRunning] = useState(gameObj.gameRunning);

    //for websocket SendName
    const sendName =async () => {


        //const userId = localStorage.getItem('loggedInUser');
        //const response1 = await api.get('/users/' + userId);
        //await new Promise(resolve => setTimeout(resolve, 1000));
//
        //setUser(response1.data);
        console.log("vor sockClient send name");
        sockClient.sendName(localStorage.getItem('username'));

    }


    //************************  Websocket  **************************************************

    //************************  GameLogic  **************************************************
    //navigate trough Pages
    const history = useHistory();
    let disableCards = false;
    let  disableDrawCards = false;
    console.log("just before the draw option")
    if (parseInt(localStorage.getItem('discardCounter'))<2){
        disableDrawCards =true;
        console.log("we are changing the value" + JSON.stringify(disableCards));}
    console.log(disableDrawCards);
    localStorage.setItem('disableDraw',true);
    let drawLabel = "Draw";

    //TODO add Running Game Logic


    const checkWhoseTurn =  ()=>{
        //check whose turn it is
        const playersTurn = gameObj.whoseTurn;
        const name= localStorage.getItem('username');
        if (name == playersTurn ){
            disableCards = false;

        } else {
            disableCards = true;
        }
        return disableCards;

    }

    //TODO check if the player is allowed to draw card
    const allowedToDrawCard =  ()=>{

        return localStorage.getItem('draw');
    }

    const checkDiscardPossible =  (pile)=>{
        if (localStorage.getItem('chosenCard') == null){
            alert("You have not chosen a card, please do so.")
        } else {
            console.log(localStorage.getItem('chosenCard'));
            if(validChoice(localStorage.getItem('chosenCard'), pile)){
                //take card from hand and put card into piles list
                //we do all the stuff below to update the gto object
                let newSpecificPlayerCards = [];


                for (let i = 0; i < nrCards; i++) {
                    if (specificPlayerCards[i].value != localStorage.getItem('chosenCard')){
                        newSpecificPlayerCards.push(specificPlayerCards[i]);
                    }
                }
                gameObj.playerCards[name] = newSpecificPlayerCards;


                for (let i = 0; i < 4; i++) {
                    if (gameObj.pilesList[i].topCard.value == pile.topCard.value){
                        gameObj.pilesList[i].topCard.value = localStorage.getItem('chosenCard')
                    }
                }
                //actually update
                localStorage.setItem('gto', JSON.stringify(gameObj));
                console.log(localStorage.getItem('gto'));
                specificPlayerCards = newSpecificPlayerCards;

                localStorage.setItem('discardCounter',JSON.stringify(parseInt(localStorage.getItem('discardCounter'))+1))
                console.log("the Discard counter is: " + localStorage.getItem('discardCounter'));


                localStorage.setItem('chosenCard', null);
                console.log("just before sending to server")
                //checkForDraw(); //TODO Please change this to below sendDiscard, when sending is working
                //sockClient.sendDiscard();



            } else{
                alert("you can't play this card, on that pile, sooorryyyyy :(")
            }
            }

        }



   /* const checkForDraw = () =>{
        if (parseInt(gameObj.noCardsOnDeck)==0) {
            drawLabel = "End Term";
            if (parseInt(localStorage.getItem('discardCounter'))>=1) {
                localStorage.setItem('disableDraw',false);
            }
        } else {
            if (parseInt(localStorage.getItem('discardCounter'))>=2) {
                localStorage.setItem('disableDraw',false);
            }


        }




    }*/

    const draw = () => {
        localStorage.setItem('discardCounter', 0)
        //sockClient.sendDraw();
    }


    const validChoice = (val, pile) => {
        if (pile.direction == "TOPDOWN"){
            if(parseInt(val) < parseInt(pile.topCard.value) || parseInt(val) - 10  == parseInt(pile.topCard.val))
            {return true;}
            else {return false;}
        }
        if (pile.direction == "DOWNUP") {
            if (parseInt(val) > parseInt(pile.topCard.value) || parseInt(val) + 10 == parseInt(pile.topCard.val)) {
                return true;
            } else {
                return false;
            }

        }

    }

    const chooseCard = (val) => {
        localStorage.setItem('chosenCard', JSON.stringify(val));
    }










    //add in this function all methods which need to be called when leaving the page/gameObj
    //TODO add close gameObj method and tell server to close the gameObj
    const myfun = async ()=>{
        try{
            await client.leave();

        } catch (e){
            console.log("was not in a meeting");
        }
        //localStorage.removeItem('gto');
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
        try{
            await client.leave();
        }catch (e) {
            alert("can not leave te meeting")
        }
        history.push('/startpage');
    }

    const showGameObject = () => {
        console.log(gameObj);
    }

    //************************  GameLogic  **************************************************

    //************************  Zoom  *******************************************************

    //for Zoom setup
    const client = ZoomVideo.createClient();
    //const audioTrack = VideoSDK.createLocalAudioTrack();
    //const videoTrack = VideoSDK.createLocalVideoTrack();
    let mediaStream;
    //const canvas = document.querySelector('.video-canvas');

    //const videoSDKLibDir = '/node_modules/@zoom/videosdk/dist/lib';

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
        //await client.init('en-US',`${window.location.origin}${videoSDKLibDir}`)
        await client.init('en-US', 'Global');
        //const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWUxNCIsInJvbGVfdHlwZSI6MSwidXNlcl9pZGVudGl0eSI6InVzZXIxMiIsInNlc3Npb25fa2V5IjoiMTIiLCJpYXQiOjE2NTAxNzU3NjIsImV4cCI6MTY1MDE4Mjk2Mn0.9LDb64dU9n7NXKSdKUsi8ZYD9fDy5YGWAbTnjpTtZgM";
        const signature = generateSessionToken(
            sessionConfig.sdkKey,
            sessionConfig.sdkSecret,
            sessionConfig.topic,
            sessionConfig.password,
            sessionConfig.sessionKey,
            localStorage.getItem('username')
        );
        try {
            await client.join(
                sessionConfig.topic,
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


    const name= localStorage.getItem('username');
    console.log(name);

    //Todo this must be called differently
    let specificPlayerCards = gameObj.playerCards[name];

    //list how many cards need to be shown
    const nrCards = Object.keys(specificPlayerCards).length;
    console.log(nrCards);
    //boolian, hidden or not
    const listHiddenValues = [true, true, true, true, true, true, true];
    //by default we enter 0 so that there is no null value at the start
    const cardValues= [0, 0, 0, 0, 0, 0, 0];

    //here we fill the cards with the right value
    for (let i = 0; i < nrCards; i++) {
        cardValues[i] = specificPlayerCards[i].value;
        console.log(cardValues[i]);
    }


    for (let i = 0; i < nrCards; i++) {
        listHiddenValues[i] = false;
    }

    //checkwheter it is players turn and cards should be shown
    checkWhoseTurn();
    allowedToDrawCard();






    let cards = (
        <div  className="left bottom">
            <Button id="card1" className ="cards-button"
                    hidden={listHiddenValues[0]}
                    disabled = {disableCards}
                    onClick={() => chooseCard(cardValues[0])}
            >
                {cardValues[0]}
            </Button>
            <Button id="card2" className ="cards-button"
                    hidden={listHiddenValues[1]}
                    disabled = {disableCards}
                    onClick={() => showGameObject()}
            >
                {cardValues[1]}
            </Button>
            <Button id="card3" className ="cards-button"
                    hidden={listHiddenValues[2]}
                    disabled = {disableCards}
                    onClick={() => chooseCard(cardValues[2])}
            >
                {cardValues[2]}
            </Button>
            <Button id="card4" className ="cards-button"
                    hidden={listHiddenValues[3]}
                    disabled = {disableCards}
                    onClick={() => chooseCard(cardValues[3])}
            >
                {cardValues[3]}
            </Button>
            <Button id="card5" className ="cards-button"
                    hidden={listHiddenValues[4]}
                    disabled = {disableCards}
                    onClick={() => chooseCard(cardValues[4])}
            >
                {cardValues[4]}
            </Button>
            <Button id="card6" className ="cards-button"
                    hidden={listHiddenValues[5]}
                    disabled = {disableCards}
                    onClick={() => chooseCard(cardValues[5])}
            >
                {cardValues[5]}
            </Button>
            <Button id="card7" className ="cards-button"
                    hidden={listHiddenValues[6]}
                    disabled = {disableCards}
                    onClick={() => chooseCard( cardValues[6])}
            >
                {cardValues[6]}
            </Button>
        </div>


    );

    //************************  HTML  *******************************************************





    //*************************************************************************
    //TODO
    //Comment the next line, when working on the gameObj

    //joinMeeting();
    //SockClient.connect();
    //sockClient.startGame()

    //*************************************************************************

    return (
        <div>
            <HeaderGame height="100"/>
            <div> {localStorage.getItem('username')}</div>
            <BaseContainer className = "left">
                <div className="left top">
                    <Button className ="game-button"
                            disabled = {disableCards}
                            onClick={() => checkDiscardPossible(gameObj.pilesList[0])}
                    >
                        {gameObj.pilesList[0].topCard.value + "▼"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {disableCards}
                            onClick={() => checkDiscardPossible(gameObj.pilesList[1])}
                    >
                        {gameObj.pilesList[1].topCard.value + "▼"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {disableCards}
                            onClick={() => checkDiscardPossible(gameObj.pilesList[2])}
                    >
                        {gameObj.pilesList[2].topCard.value +"▲"}
                    </Button>
                    <Button className ="game-button"
                            disabled = {disableCards}
                            onClick={() => checkDiscardPossible(gameObj.pilesList[3])}
                    >
                        {gameObj.pilesList[3].topCard.value +"▲"}
                    </Button>
                </div>
                <div className="left middle">
                    <Button className ="game-button"
                            disabled = {disableDrawCards}
                            onClick={() => draw()}
                    >
                        {drawLabel}
                    </Button>
                </div>

                {cards}

            </BaseContainer>
            <BaseContainer className = "right">
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
            </BaseContainer>
        </div>

    ) ;

}

export default Game;