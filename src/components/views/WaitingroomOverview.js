import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {
    connect,
    isConnected,
    subscribe,
    getPlayers, currentGameStatus
} from "../utils/sockClient";
import {useEffect, useState} from "react";


const WaitingroomOverview = () => {

    const history = useHistory();
    const [noOfPlayers, setNoOfPlayers] = useState([]);
    const [counter, setCounter] = useState(0);
    const [gameStatus, setGameStatus] = useState(false)


    useEffect(() => {
        if (!isConnected()) {
            connect(WaitingRoomPlayersSocket);
        }
        else {
            WaitingRoomPlayersSocket();
        }
    }, []);


    useEffect(() => {
    }, [noOfPlayers]);

    useEffect(() => {
        WaitingRoomPlayersSocket();
    }, [gameStatus]);


    const WaitingRoomPlayersSocket = () => {

        subscribe('/topic/players', msg => {
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setNoOfPlayers(msg);
        });

        subscribe('/topic/getPlayers', msg => {
            setNoOfPlayers(msg);
            sessionStorage.setItem('playerList', JSON.stringify(msg))
        });

        subscribe('/topic/start', msg => {
            setGameStatus(msg.gameRunning);
        });

        subscribe('/topic/game', msg => {
            setGameStatus(msg.gameRunning);
        });

        subscribe('/topic/isRunning', msg => {
            setGameStatus(msg);
        });

        currentGameStatus();
        getPlayers();

        if (counter === 0) {
            getPlayers();
            setCounter(1);
        }
    }


    const joinWaitingRoom = () => {
        if (checkIfWaitingRoomHasSpace()) {
            getPlayers();
            history.push('/waitingroom/1');
            return;
        } else {
            alert('Sorry you cannot join, the waiting room is full! :(');
        }
    }

    const checkIfWaitingRoomHasSpace = () => {
            if (noOfPlayers.length < 4) {
                return true;
            }
            return false;
    }


    const checkIfGameRunning = () => {
        if (gameStatus) {
            return true;
        } else {
            return false;
        }
    }

    const buttonDescription = () => {
        if (checkIfGameRunning()) {
            return "A game is currently running"
        }
        return "Waiting Room 1 - ("+noOfPlayers.length+"/4 players are in this Waiting Room)"
    }



    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "home container">
            <div className="home form">
                <div className="home title">
                    Game Room Overview
                </div>
                <div className="home label">
                    Join the waiting-room and wait for other players to join, before you will start The Game.
                </div>
                <Button
                    width="100%"
                    height="50%"
                    disabled={checkIfGameRunning()}
                    onClick={() => joinWaitingRoom()}
                >
                    {buttonDescription()}
                </Button>
            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;