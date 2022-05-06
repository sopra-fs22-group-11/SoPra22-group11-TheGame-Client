import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, startGame, subscribe} from "../utils/sockClient";


const Waitingroom = () => {

    //************************  Websocket  **************************************************
    const history = useHistory();
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
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setPlayers(JSON.parse(sessionStorage.getItem('playerList')));
            sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook
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



    //************************ UI  *******************************************************************


    let startGameUI = (
        <div>
            <div className="home title"> How to start THE GAME</div>
            <p> 1. You need to enroll for this Game clicking on the 1. button  <br/>
                2. Once everyone is ready one player can click on Start Game<br/>
                3. Enjoy THE GAME :D </p>

            <div className="home important"> IMPORTANT: Please leave the game only via Leave Game, otherwise the game
                can not be restarted again!
            </div>
            <Button
                width="100%"
                onClick={() => sendNameToWS()}
            >
                Join this Game
            </Button>
            <Button
                width="100%"
                onClick={() => startGame()}
            >
                Start The Game for everyone :)

            </Button>

            <h2> Players registered in this waiting-room: </h2>
            <ul>
                {players.map(item => (
                    <li>
                       <div key={item}>{item}</div>
                    </li>
                ))}
            </ul>

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