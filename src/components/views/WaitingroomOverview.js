import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect, isConnected, sendName, subscribe, checkNoOfPlayersWaitingRoom} from "../utils/sockClient";
import User from "../../models/User";


const WaitingroomOverview = () => {

    const history = useHistory();
    const [noOfPlayers, setNoOfPlayers] = useState([]);

    useEffect(() => {
        if (!isConnected()) {
            connect(WaitingRoomPlayersSocket);
        }
        else {
            WaitingRoomPlayersSocket();
        }
    }, []);

    const WaitingRoomPlayersSocket = () => {
        subscribe('/topic/players', msg => {
            console.log(msg.length);
            setNoOfPlayers(msg);
            //console.log(noOfPlayers);
            sessionStorage.setItem('playerList', JSON.stringify(msg))
        });
    }

    const joinWaitingRoom = () => {
        console.log(noOfPlayers)
        if (checkIfWaitingRoomHasSpace()) {
            sendName(localStorage.getItem('username'));
            history.push('/waitingroom/1'); //for the start we need the waitingroom 1
        } else {
            alert('Sorry, this waiting room is already full! :(')
        }
    }

    const checkIfWaitingRoomHasSpace = () => {
            if (noOfPlayers.length < 4) {
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
                    Waiting Room 1 - ({noOfPlayers.length}/4 players are in this Waiting Room)
                </Button>
            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;