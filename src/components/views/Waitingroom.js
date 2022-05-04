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
import SockClient from "../utils/sockClient";

const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
    </div>
);




const Waitingroom =   () => {
    //************************  Websocket  **************************************************
    //hello sandra:)
    SockClient.connect();

    const history = useHistory();


    const [registered, setRegistered]=useState(false);

    const [playerList, setPlayerList] = useState([]);

    //to show users

    const sendName = () => {
        //TODO delete if not necesary
        //const userId = localStorage.getItem('loggedInUser');
        //const response1 = await api.get('/users/' + userId);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        //
        //setUser(response1.data);

        if(!registered){
            setRegistered(true);
            console.log("vor sockClient send name");
            SockClient.sendName(localStorage.getItem('username'));
            alert("You have successfully enrolled in this game.")
        }
        else{
            alert("You are already enrolled")
        }
        setPlayerList(JSON.parse(localStorage.getItem('playerList')));
    }
    //************************  Websocket  **************************************************

    //************************  Waiting Room Logic  **************************************************

    useEffect(() => {
        SockClient.connect();
    }, []);


    const goToGame = async () => {

        SockClient.startGame();
        localStorage.setItem('clickedStart', JSON.stringify(true));
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
                onClick={() => sendName()}
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

            <h2> Players registered in this waiting-room: </h2>
            <ul>
                {playerList.map(item => (
                    <li>
                       <div key={item}>{item}</div>
                    </li>
                ))}
            </ul>

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