import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, startGame, subscribe} from "../utils/sockClient";
import {getDomain} from "../../helpers/getDomain";
import {isProduction} from "../../helpers/isProduction";


const LinkField = props => {
    return (
        <div className="home field">
            <label className="home label">
                {props.label}
            </label>
            <input
                className="home input"
                placeholder={props.placeholder}
                type = {props.type}
                value={props.value}
                disabled = {props.disabled}
                visible={props.visible}
            />
        </div>
    );
};


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
            await sendName(sessionStorage.getItem('username'));
            alert("You have successfully enrolled in this game.");

        } else {
            alert("You are already enrolled")
        }
    }

    //************************  Websocket  **************************************************



    //************************ UI  *******************************************************************

    const getLink = () => {
         let value = isProduction() ? "https://sopra22-group11-thegame-client.herokuapp.com/waitingroom/1": "http://localhost:3000/waitingroom/1";
         return value;
    }



    let startGameUI = (
        <div>
            <div className="home title"> Waiting-room</div>
            Wait for other players to join this Game
            <div display = "flow" vertical-align= "middle" >
            <LinkField
                width = "300px"
                placeholder={getDomain() + "/waitingroom/1"}
                value={getLink()}
                disabled = {true}
                visible={true}
            />
            <Button className="primary-small-button"
                width="10%"
                onClick={() => navigator.clipboard.writeText(getLink())}
            >
                <img src="https://img.icons8.com/material-rounded/24/FFFFFF/copy.png"/>
            </Button>
                </div>

            <h2> </h2>
            <Button

                width="100%"
                onClick={() => sendNameToWS()}
            >
                Join this Game (will be deleted)
            </Button>
            <Button className = "button-startPage"
                onClick={() => startGame()}
            >
                Let's play
                <img src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/play--v1.png"/>

            </Button>

            <h2> Players in this waiting-room: </h2>
            <ul >
                                 {players.map(item => (
                     <div >
                        <div key={item}>{item}</div>
                     </div>
                 ))}
             </ul>

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

//

export default Waitingroom;