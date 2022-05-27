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
import {Spinner} from "../ui/Spinner";


const WaitingroomOverview = () => {

    const history = useHistory();
    const [noOfPlayers, setNoOfPlayers] = useState([]);
    const [counter, setCounter] = useState(0);
    const [gameStatus, setGameStatus] = useState(false)
    const [button, setButton] = useState(<div> <Spinner/> </div>)

    const WaitingRoomPlayersSocket = () => {

        subscribe('/topic/players', msg => {
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setNoOfPlayers(msg);
        });

        subscribe('/topic/getPlayers', msg => {
            setNoOfPlayers(msg);
            sessionStorage.setItem('playerList', JSON.stringify(msg))
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

        setButton(<div>
            <Button
                width="100%"
                height="50%"
                disabled={checkIfGameRunning()}
                onClick={() => joinWaitingRoom()}
            >
                {buttonDescription()}
            </Button>
        </div>)

    }


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
        if (!isConnected()) {
            connect(WaitingRoomPlayersSocket);
        }
        else {
            WaitingRoomPlayersSocket();
        }
    }, [gameStatus]);





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
    const goToHome = () => {
        history.push('/startpage');
    }


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "home container">
            <div className="home form">
                <div className="home title">
                    <img src="https://img.icons8.com/ios/50/FFFFFF/back--v1.png" className="rules backbutton-left"
                         onClick={() => goToHome()}/>
                    Game Room Overview
                </div>
                <div className="home label">
                    Join the waiting-room and wait for other players to join, before you start The Game.
                </div>
                {button}

            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;