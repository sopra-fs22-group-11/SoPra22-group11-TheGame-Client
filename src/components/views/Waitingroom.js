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
import HeaderHome from "./HeaderHome";
import {connect, sendName, startGame, PlayerList} from "../utils/sockClient";



const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Member = ({member}) => {
    return(
        <div className="lobby member-container">
            <div className="lobby circle">
            </div>
            <label className="lobby member"> {member.username} </label>
        </div>
    );
};

Member.propTypes = {
    member: PropTypes.object
};

export var dummy =null;

const Waitingroom =   () => {
    //************************  Websocket  **************************************************
    const [users, setUsers] = useState(null);
    const [players, setPlayers] = useState(null);
    const [gameObjDummy, setGameObjDummy] = useState(null);


    useEffect(() => {
        //fetches all members in the lobby
        async function fetchDataWaitingroom() {
            try {
                console.log("we are trying to connect");
                await connect(gameObjDummy, setGameObjDummy);
                console.log("connection is done");
                //TODO mir bruched en endpoint wo eus e liste git
                //await sendName(localStorage.getItem('username'));
                //console.log("name is sent");
                //await setPlayers(PlayerList);
                //alert("Your are registered");
                //
            } catch (error) {
                console.error("Details:", error);
            }
        }
        /*function startUpdateListener(event)
        {
            let gametoken = event.detail.gameToken;
            if(gametoken)
            {
                localStorage.setItem("gametoken", gametoken);
                history.push("/game");
            }
        }
        //only add the listener on initial render, otherwise we have multiple
        //check if the game gets started
        document.addEventListener("startUpdate", startUpdateListener);

        function lobbyUpdateListener(e)
        {
            fetchDataLobby();
        }

        document.addEventListener("lobbyUpdate", lobbyUpdateListener);

        fetchDataLobby();
        fetchDataSearch();

        return () => { // This code runs when component is unmounted
            document.removeEventListener("lobbyUpdate", lobbyUpdateListener);
            document.removeEventListener("startUpdate", startUpdateListener); // (4) set it to false when we leave the page

        }*/
        fetchDataWaitingroom();
    }, []);


    /*const suscribePlayer= () =>{
        setPlayers([localStorage.getItem('username')]);
    }*/




    const history = useHistory();


    const [registered, setRegistered]=useState(false);


    //to show users

    const sendNameToWS = async () => {
        //TODO delete if not necesary
        //const userId = localStorage.getItem('loggedInUser');
        //const response1 = await api.get('/users/' + userId);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        //
        //setUser(response1.data);

        if(!registered){
            setRegistered(true);
            console.log("vor sockClient send name");
            await sendName(localStorage.getItem('username'));
            alert("You have successfully enrolled in this game.");
            console.log("gameObjDummy: " +gameObjDummy);
            dummy = gameObjDummy;
            console.log("Dummy: " +dummy);

        }
        else{
            alert("You are already enrolled")
        }

    }

    //************************  Websocket  **************************************************

    //************************  Waiting Room Logic  **************************************************

    const goToGame = async () => {

        startGame(gameObjDummy, setGameObjDummy);
        await new Promise(resolve => setTimeout(resolve, 1000));

        //if (localStorage.getItem('clickedStart') === true) {
        history.push('/game');
        //}

    }
    const redirectToGame = async () => {
        history.push('/game');
    }

    const goToHome = () => {
        history.push('/startpage');
    }

    //************************  Waiting Room Logic  **************************************************


    //************************ UI  *******************************************************************


    let startGameUI = (
        <div>
            <div className="home title"> How to start THE GAME</div>
            <p> 1. You need to enroll for this Game clicking on the 1. button (maybe give it a second) <br/>
                2. You decide within your Team, who is the Team Leader.<br/>
                3. The Team Leader clicks on 2.1 and the Team Member click on 2.2.<br/>
                4. Enjoy THE GAME :D </p>

            <div className="home important" > IMPORTANT: Please leave the game only via Leave Game, otherwise the game can not be restarted again!</div>
            <Button
                width="100%"
                onClick={() => sendNameToWS()}
            >
                1. Join this Game
            </Button>

            <Button
                width="100%"
                onClick={() => goToGame()}
            >
                2.1 Start The Game as a Team Leader
            </Button>

            <Button
                width="100%"
                onClick={() => redirectToGame()}
            >
                2.2 Start The Game as a Team Member
            </Button>
            <h2>How to play this Game</h2>
            <p> You will see at the top of the page, which player needs to play. <br/>
                You can play a card, with clicking on your hand card and than clicking on the pile. If you want to change your selected card, you can just click on a other card. <br/>
                With clicking on the draw pile you can get your new cards.<br/>
                2 REMARKS: <br/>
                1. Until we have solved the Hook issue, you need to click update to render your page and see what the other player has played.<br/>
                2. Zoom ins unfortunately not yet working, due to deployment difficulties</p>


        </div>)

    //************************ UI  *******************************************************************


    return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className="home container">
                <div className="home form">
                    {startGameUI}
                </div>


            </BaseContainer>
        </div>


    );

}

export default Waitingroom;