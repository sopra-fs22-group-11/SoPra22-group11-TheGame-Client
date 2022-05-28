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
import React, {useEffect, useState} from "react";
import {Spinner} from "../ui/Spinner";


const WaitingroomOverview = () => {

    const history = useHistory();
    const [noOfPlayers, setNoOfPlayers] = useState([]);
    const [counter, setCounter] = useState(0);
    const [gameStatus, setGameStatus] = useState(false)


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
        subscribe('/topic/start', msg => {
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
            sessionStorage.setItem("clickedButton", true)
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
        if (!checkIfWaitingRoomHasSpace()) {
            return "The waiting room is already full"
        }
        return "Waiting Room - ("+noOfPlayers.length+"/4 players are in this Waiting Room)"
    }

    const goToHome = () => {
        history.push('/startpage');
    }

    let content = <div> <Spinner/> </div>
    if(isConnected()) {
        content = (
            <div>
              <Button
                  width="100%"
                  height="50%"
                  disabled={checkIfGameRunning() || !checkIfWaitingRoomHasSpace()}
                  onClick={() => joinWaitingRoom()}
              >
                  {buttonDescription()}
              </Button>
          </div>)
    }


    return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className = "home container">
                <div className="home form">
                    <div className="home title">
                        <img src="https://img.icons8.com/ios/50/FFFFFF/back--v1.png" className="rules backbutton-left"
                             onClick={() => goToHome()}/>
                        Join a Game Room
                    </div>
                    <h2> Before we start The Game:</h2>

                    <div className="home label">
                        When entering The Game, you need to wait some seconds for the audio communication to start. <br/>
                        Please make sure that you have enabled your microphone access before you start the game. <br/>
                        The communication system is running, when you see the red point on the tab. <br/>

                        <h2> Need help? </h2>

                        If you have not yet looked at the rules, we strongly suggest you to have a quick look.<br />
                        <h2>  </h2>

                        <Button
                            width ="20%"
                            onClick={() => {history.push('/rulePage');
                                return;}}
                        >
                            Rules<br />
                            <img src="https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/FFFFFF/external-question-call-to-action-bearicons-detailed-outline-bearicons.png" width="50px"/>
                        </Button> <br/>


                        <h2> Are you ready?</h2>
                        Join the waiting-room and wait for other players to join, before you start The Game.
                    </div>
                    {content}


                    <div>

                    </div>

                </div>
            </BaseContainer>
        </div>
    ) ;

}

export default WaitingroomOverview;