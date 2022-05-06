import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, startGame, subscribe} from "../utils/sockClient";


const Player = ({player}) => (
    <div className="player container">
        <div className="player username">{player}</div>
    </div>
);

Player.propTypes = {
    player: PropTypes.object
};

const Member = ({member}) => {
    return (
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


const Waitingroom = () => {
    //************************  Websocket  **************************************************
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [players, setPlayers] = useState([]);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
            if (!isConnected()) {
                connect(registerWaitingRoomSocket());
            }
            else {
                registerWaitingRoomSocket();
            }

        }, []);



    const registerWaitingRoomSocket = () => {
        subscribe('/topic/players', msg => {
            console.log(msg.map(p => p.playerName))
            setPlayers(msg) //TODO figure out how to store the string array in a hook
            console.log(players)
        });
        subscribe('/topic/start', msg => {
            sessionStorage.setItem('gto', JSON.stringify(msg));
            console.log(msg);
            history.push('/game');
        });
    };


    const sendNameToWS = async () => {
        if (!registered) {
            setRegistered(true);
            await sendName(localStorage.getItem('username'));
            alert("You have successfully enrolled in this game.");

        } else {
            alert("You are already enrolled")
        }
    }

    //************************  Websocket  **************************************************

    //************************  Waiting Room Logic  **************************************************

    const goToGame = async () => {

        startGame();

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

            <div className="home important"> IMPORTANT: Please leave the game only via Leave Game, otherwise the game
                can not be restarted again!
            </div>
            <Button
                width="100%"
                onClick={() => sendNameToWS()}
            >
                1. Join this Game
            </Button>
            <li>{players}</li>
            <Button
                width="100%"
                onClick={() => goToGame()}
            >
                Start The Game as a Team Leader

            </Button>
            <h2>How to play this Game</h2>
            <p> You will see at the top of the page, which player needs to play. <br/>
                You can play a card, with clicking on your hand card and than clicking on the pile. If you want to
                change your selected card, you can just click on a other card. <br/>
                With clicking on the draw pile you can get your new cards.<br/>
                2 REMARKS: <br/>
                1. Until we have solved the Hook issue, you need to click update to render your page and see what the
                other player has played.<br/>
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