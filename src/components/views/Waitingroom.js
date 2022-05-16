import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, startGame, subscribe, LeaveWaitingRoom} from "../utils/sockClient";
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


const retrievePlayerList = () => {
    const pl = JSON.parse(sessionStorage.getItem('playerList'));
    sessionStorage.removeItem('playerList');
    return pl;
}

const Waitingroom = () => {

    //************************  Websocket  **************************************************
    const history = useHistory();
    const [players, setPlayers] = useState(retrievePlayerList());
    //const [registered, setRegistered] = useState(false);


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
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setPlayers(JSON.parse(sessionStorage.getItem('playerList')));
            sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook
            //setPlayers(msg);
            console.log(players)
            /*
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setPlayers(msg);
            console.log(players);
            sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook

             */
        });


        subscribe('/topic/start', msg => {
            sessionStorage.setItem('gto', JSON.stringify(msg));
            console.log(msg);
            history.push('/game');
        });
    };

    const checkStartPossible = () => {
        if (players.length > 1 && players.length <= 4) {
            return true;
        } else {
            return false;
        }
    }

    const start = () => {
        if (checkStartPossible()) {
            startGame();
        } else {
            alert('Game could not be started, you need between 2 and 4 players!');
        }
    }


    const leave = () => {
        LeaveWaitingRoom(localStorage.getItem('username'));
        history.push('/waitingroomOverview')
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
                onClick={() => leave()}
            >
                Leave Waiting Room

            </Button>
            <Button className = "button-startPage"
                onClick={() => start()}
            >
                Let's play
                <img src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/play--v1.png"/>

            </Button>

            <h2> Players in this waiting-room: </h2>

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