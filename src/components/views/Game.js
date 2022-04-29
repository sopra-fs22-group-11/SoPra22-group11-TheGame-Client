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
    /*const [users, setUsers] = useState(null);
    const [user, setUser] = useState(null);
    const [running, setRunning] = useState(gameObj.gameRunning);*/
    const [gameObj2, setGameObj2] = useState(JSON.parse(localStorage.getItem('gto')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //const forceUpdate = useCallback((a) => setGameObj2(a));
    // let gameObj =  JSON.parse(localStorage.getItem('gto'))

    /* useEffect(() => {
         // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
         async function fetchData() {
             try {
                 const response = JSON.parse(localStorage.getItem('gto'));
                 // delays continuous execution of an async operation for 1 second.
                 // This is just a fake async call, so that the spinner can be displayed
                 // feel free to remove it :)
                 // Get the returned users and update the state.
                 setGameObj2(response);
                 // This is just some data for you to see what is available.
                 // Feel free to remove it
                 // See here to get more data.
                 console.log(response);
             } catch (error) {
                 console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                 console.error("Details:", error);
                 alert("Something went wrong while fetching the users! See the console for details.");
             }
         }
         fetchData();
     }, []);*/

    console.log("here wer are at the Game");

    /* useEffect(() =>{
         console.log("Is the Game running: "+ gameObj.gameRunning);
         console.log("Show Players cards: "+ JSON.stringify(gameObj.playerCards));
         console.log("No of Cards on Deck: " +gameObj.noCardsOnDeck);
     })*/

    //TODO is this stille used?!
    //for websocket SendName
    /*const sendName =async () => {
        //const userId = localStorage.getItem('loggedInUser');
        //const response1 = await api.get('/users/' + userId);
        //await new Promise(resolve => setTimeout(resolve, 1000));
//
        //setUser(response1.data);
        console.log("vor sockClient send name");
        sockClient.sendName(localStorage.getItem('username'));
    }*/


    //************************  Websocket  **************************************************

    //************************  GameLogic  **************************************************
    //navigate trough Pages
    const history = useHistory();
    let disableCards = false;
    //const [disableCards, setDisableCards] = useState({disableCardsnull);
    let  disableDrawCards = false;
    const [counter, setCounter] = useState(0);
    const [chosenCard, setChosenCard] = useState(null);
    //const [cardSelected, setCardSelected] =useState(false);
    const name= localStorage.getItem('username');
    console.log("just before the draw option")
    /*if (name == playersTurn ){
        alert("IT IS YOUR TURN :)");
        //setDisableCards(false);
    } else {
        alert("IT IS YOUR NOT YOUR TURN :(");
        //setDisableCards(true);
    }*/

    /*useEffect( () =>{
        if (name == playersTurn ){
            setDisableCards(false);
        } else {
            setDisableCards(false);
        }
    })*/

    /*if (name == playersTurn ){
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [disableCards, setDisableCards] = useState(false);
    } else {
        //disableCards = true;
        //setDisableCards(true);
        const [disableCards, setDisableCards] = useState(true);
    }*/

    if (counter<2){
        disableDrawCards =true;
        console.log("we are changing the value" + JSON.stringify(disableCards));}
    console.log(disableDrawCards);
    localStorage.setItem('disableDraw',true);
    let drawLabel = "Draw";
    //let playersTurn = gameObj2.whoseTurn;
    //const name= localStorage.getItem('username');

    //const [disableCards, setDisableCards] = useState(false)

    //TODO add Running Game Logic


    const checkWhoseTurn =  ()=>{
        //check whose turn it is
        //playersTurn = gameObj2.whoseTurn;
        console.log("It is the turn of " + gameObj2.whoseTurn);
        const gameTemp = JSON.parse(localStorage.getItem('gto'));
        const whoseTurn = gameTemp.whoseTurn;

        if (name == whoseTurn ){
            disableCards = false;
            //setDisableCards(false);

        } else {
            disableCards = true;
            //setDisableCards(true);
        }
        return disableCards;

    }


    const allowedToDrawCard =  ()=>{

        return localStorage.getItem('draw');
    }

    const checkDiscardPossible =  (pile, index)=>{


        //setGameObj2(localStorage.getItem('gto'));

        /*if (localStorage.getItem('chosenCard') == null){
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
                //localStorage.setItem('discardCounter',JSON.stringify(parseInt(localStorage.getItem('discardCounter'))+1))
                //console.log("the Discard counter is: " + localStorage.getItem('discardCounter'));
                setCounter(counter+1);
                console.log("the Discard counter is: " + counter);
                localStorage.setItem('chosenCard', null);
                console.log("just before sending to server")
                //checkForDraw(); //TODO Please change this to below sendDiscard, when sending is working
                //sockClient.sendDiscard();
            } else{
                alert("you can't play this card, on that pile, sooorryyyyy :(")
            }
            }*/
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

                //setGameObj(gameObj2);
                console.log("LocalStorage gto: " + localStorage.getItem('gto'));
                console.log(" hook gto: " + gameObj2);
                gameObj2.playerCards[name] = newSpecificPlayerCards;

                //localStorage.setItem('discardCounter',JSON.stringify(parseInt(localStorage.getItem('discardCounter'))+1))
                //console.log("the Discard counter is: " + localStorage.getItem('discardCounter'));
                setCounter(counter+1);
                console.log("the Discard counter is: " + counter);


                setChosenCard(null);
                console.log("just before sending to server")

                localStorage.setItem('gto', JSON.stringify(gameObj2));
                sockClient.sendDiscard();
                //setCardSelected(false);



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
        //localStorage.setItem('discardCounter', 0)

        //setCardSelected(false);
        showGameObject();
        setCounter(0);
        disableCards = true;
        //etDisableCards(true);
        //TODO change local storage turn;
        sockClient.sendDraw();
        updateUI() // This somehow does not work
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
        if (checkWhoseTurn()== true){
            alert("Sorry but is not your turn")
        }
        //localStorage.setItem('chosenCard', JSON.stringify(val));
        setChosenCard(JSON.stringify(val));
        //setCardSelected(true);
        document.getElementById("card3").className.replace( "cards-button unselected" , "cards-button selected" );
    }

    const updateUI = () =>{
        console.log("we are in the update function")
        //console.log("show game Obj in update: " + JSON.stringify(gameObj2));
        setGameObj2(JSON.parse(localStorage.getItem('gto')));
        // if (gameObj2 == null) {alert("someone left!");}
        //if (gameObj2.gameRunning == false)  {
        //    alert('Sorry, someone left and the game has been terminated!:( ' +
        //        'Please leave.')
        //}
        showGameObject();

        console.log(gameObj2);
    }














    //add in this function all methods which need to be called when leaving the page/gameObj
    //TODO add close gameObj method and tell server to close the gameObj
    const myfun = async ()=>{
        try{
            //await client.leave();
            //this.sock.close();

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
        setGameObj2(null);
        //sockClient.terminate()
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


    //const name= localStorage.getItem('username');
    //console.log(name);

    //Todo this must be called differently
    //let specificPlayerCards = gameObj2.playerCards[name];

    //list how many cards need to be shown
    //const nrCards = Object.keys(gameObj2.playerCards[name]).length;
    //const nrCards = gameObj2.playerCards[name].length
    console.log(gameObj2.playerCards[name].length);
    //boolian, hidden or not
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

    //checkwheter it is players turn and cards should be shown
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
            <BaseContainer className = "left">
            <h2 align="center">  Hei {localStorage.getItem('username')} ʕ•́ᴥ•̀ʔっ♡</h2>
                <div> {gameObj2.whoseTurn} needs to play</div>
            <div> {"You have played "+counter + " cards"}</div>
                <div> {"You have chosen the card "+chosenCard }</div>
                <div className="left top">
                    <Button className ="game-button"
                            disabled = {false}
                            onClick={() => updateUI()}
                    >
                        update
                    </Button>
                    <Button className ="game-button"
                            disabled = {false}
                            //onClick={() => showGameObject()}
                            onClick ={() => checkDiscardPossible(gameObj2.pilesList[1], 0)}
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
                        {drawLabel + gameObj2.noCardsOnDeck}
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