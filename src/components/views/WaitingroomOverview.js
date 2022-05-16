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
    unsubscribe,
    getPlayers
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


    const WaitingRoomPlayersSocket = () => {

        subscribe('/topic/players', msg => {
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            //setNoOfPlayers(msg)
            setNoOfPlayers(JSON.parse(sessionStorage.getItem('playerList')));
            //sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook
            console.log(JSON.stringify(noOfPlayers))

        });



        subscribe('/topic/getPlayers', msg => {
            console.log(msg)
            sessionStorage.setItem('overviewList', JSON.stringify(msg))
            setNoOfPlayers(JSON.parse(sessionStorage.getItem('overviewList')));
            //sessionStorage.removeItem('overviewList')//TODO figure out how to store the string array in a hook
            console.log(JSON.stringify(noOfPlayers))
        });

        subscribe('/topic/start', msg => {
            sessionStorage.setItem('gameStarted', JSON.stringify(msg.gameRunning));
        });

        if (counter === 0) {
            getPlayers();
            setCounter(counter => (counter + 1));
        }
    }


    const joinWaitingRoom = () => {
        console.log(noOfPlayers)
        if (checkIfWaitingRoomHasSpace()) {
            sendName(sessionStorage.getItem('username'));
            getPlayers();
            setCounter(counter => (counter - 1));
            history.push('/waitingroom/1');
        } else {
            alert('Sorry, this waiting room is already full! :(');
        }
    }

    const checkIfWaitingRoomHasSpace = () => {
            if (noOfPlayers.length < 4) {
                return true;
            }
            return false;
    }

    const checkIfGameStarted = () => {
        let gameStared
        try {
            gameStared = sessionStorage.getItem('gameStarted');
        } catch (e) {}
        finally {
            gameStared = false;
        }
        console.log('game started: ' + gameStared)
        if (gameStared) {
            alert('Sorry you cannot join, a game is currently running.')
            return true;
        } else {
            return false;
        }
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
                    disabled={checkIfGameStarted()}
                    onClick={() => joinWaitingRoom()}
                >
                    Waiting Room 1 - ({noOfPlayers.length}/4 players are in this Waiting Room)
                </Button>
            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;