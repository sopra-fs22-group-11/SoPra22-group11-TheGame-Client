import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, subscribe} from "../utils/sockClient";
import User from "../../models/User";


const WaitingroomOverview = () => {

    const history = useHistory();
    const [players, setPlayers] = useState([]);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        if (!isConnected()) {
            connect(WaitingRoomPlayersSocket());
        }
        else {
            WaitingRoomPlayersSocket();
        }
    }, []);

    const WaitingRoomPlayersSocket = () => {
        //subscribe('/topic/players', msg => {
       //     console.log(msg);
        //    sessionStorage.setItem('playerList', JSON.stringify(msg));
        //    setPlayers((JSON.parse(sessionStorage.getItem('playerList'))));
        //    sessionStorage.removeItem('playerList');
        //});
    }

    const joinWaitingRoom = async () => {
        if (!registered) {
            setRegistered(true);
            await sendName(localStorage.getItem('username'));
        }
        history.push('/waitingroom/1'); //for the start we need the waitingroom 1
    }

    const checkIfWaitingRoomFull = () => {
            if (players.length >= 4) {
                return true;
            }
            return false;
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
                    onClick={() => joinWaitingRoom()}
                >
                    Join the Waiting Room - ({players.length}/4 players are in this Waiting Room)
                </Button>
            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;