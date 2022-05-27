import {useEffect, useRef, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {
    connect,
    isConnected,
    sendName,
    startGame,
    subscribe,
    LeaveWaitingRoom,
    ClearWaitingRoom, currentGameStatus, playerLeaves, sock
} from "../utils/sockClient";
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
    if (pl === null) {
        return [];
    } else {
        console.log(pl);
        return pl;
    }
}

const Waitingroom = () => {

    //************************  Websocket  **************************************************
    const history = useHistory();
    const [players, setPlayers] = useState(retrievePlayerList());
    const [locationKeys, setLocationKeys] = useState([]);


    useEffect(() => {
            if (!isConnected()) {
                    connect(registerWaitingRoomSocket);
            }
            else {
                    registerWaitingRoomSocket();
            }
        }, []);

    useEffect(() => {
        return history.listen(location => {
            if (history.action === 'PUSH') {
                setLocationKeys([ location.key ])
            }

            if (history.action === 'POP') {
                if (locationKeys[1] === location.key) {
                    setLocationKeys(([ _, ...keys ]) => keys)

                } else {
                    setLocationKeys((keys) => [ location.key, ...keys ])
                    leave();
                }
            }
        })
    }, [ locationKeys, ])

    useEffect(() => {
        const handleTabClose = event => {
            event.preventDefault();

            event.returnValue = 'See you the next time :)'

            leave();
            return ;
        };


        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);



    const registerWaitingRoomSocket = () => {
        subscribe('/topic/players',   msg => {
            setPlayers(msg);
            sessionStorage.setItem('playerList', JSON.stringify(msg));
        });

        subscribe('/topic/start', msg => {
            sessionStorage.setItem('gto', JSON.stringify(msg));
            sessionStorage.removeItem('playerList');
            history.push('/game');
            return;
        });

        subscribe('/topic/isRunning', msg => {
            sessionStorage.setItem('gameStatus', JSON.stringify(msg));
        });


        if (players.length>=4 && !players.includes(sessionStorage.getItem('username'))){
            alert("Sorry, The waiting Room is already full")
            history.push('/waitingroomOverview');
            return;
        }
        currentGameStatus();
        if (!players.includes(sessionStorage.getItem('username'))) {
            sendName(sessionStorage.getItem('username'));
        }

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
            ClearWaitingRoom();
        } else {
            alert('Game could not be started, you need between 2 and 4 players!');
        }
    }


    const leave = () => {
        LeaveWaitingRoom(sessionStorage.getItem('username'));
        history.push('/waitingroomOverview')
        return;
    }

    //************************  Websocket  **************************************************



    //************************ UI  *******************************************************************

    const getLink = () => {
         let value = isProduction() ? "https://sopra22-group11-thegame-client.herokuapp.com/waitingroom/1": "http://localhost:3000/waitingroom/1";
         return value;
    }



    let startGameUI = (
        <div>
            <div className="home title">

                Waiting-room</div>
            Wait for other players to join this Game
            <div className="link-copy" >
                <LinkField
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
            <h3> When all your team players are in the waiting-room, <br /> you can start The Game for everybody. </h3>
            <Button className = "button-startPage"
                    cursor="pointer"
                onClick={() => start()}
            >
                Let's start <br /> for everybody <br />
                <img src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/play--v1.png"/>

            </Button>

            <h2> Players in this waiting-room: </h2>
            {players===[] ? null :
                <ul >
                {players.map((player, index) =>
                    <div >
                        <div key={index}>{player}</div>
                    </div>
                )}
            </ul>
            }


        </div>)


    //************************ UI  *******************************************************************


    return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className="home container">
                <div className="home form">
                    <img src="https://img.icons8.com/ios/50/FFFFFF/back--v1.png" className="backbutton-left"
                         onClick={() => leave()}/>
                    {startGameUI}
                </div>
            </BaseContainer>
        </div>


    );

}

export default Waitingroom;