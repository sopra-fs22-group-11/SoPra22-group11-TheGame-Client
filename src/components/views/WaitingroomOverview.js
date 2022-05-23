import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {
    connect,
    isConnected,
    sendName,
    subscribe,
    checkNoOfPlayersWaitingRoom,
    getPlayers, currentGameStatus
} from "../utils/sockClient";
import User from "../../models/User";
import {useEffect, useState} from "react";
import {string} from "sockjs-client/lib/utils/random";
import {api, handleError} from "../../helpers/api";
import game from "./Game";


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
    }, [gameStatus]);


    const WaitingRoomPlayersSocket = () => {

        subscribe('/topic/players', msg => {
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setNoOfPlayers(msg);
            console.log(noOfPlayers);

        });

        subscribe('/topic/getPlayers', msg => {
            console.log(msg)
            setNoOfPlayers(msg);
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            console.log(noOfPlayers);
        });

        subscribe('/topic/start', msg => {
            //sessionStorage.setItem('gameStatus', JSON.stringify(msg.gameRunning));
            setGameStatus(msg.gameRunning);
        });

        subscribe('/topic/game', msg => {
            //sessionStorage.setItem('gameStatus', JSON.stringify(msg.gameRunning));
            setGameStatus(msg.gameRunning);
        });

        subscribe('/topic/isRunning', msg => {
            console.log('isrunning: '+msg)
            //sessionStorage.setItem('gameStatus', JSON.stringify(msg));
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
        console.log(noOfPlayers)
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
        //let gameStatus = JSON.parse(sessionStorage.getItem('gameStatus'));
        console.log('game started: ' + gameStatus)
        if (gameStatus) {
            //alert('Sorry you cannot join, a game is currently running. :( ')
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