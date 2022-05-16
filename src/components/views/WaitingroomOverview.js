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

    /*
    if (counter === 0) {
        getPlayers();
        setCounter(1);
    }

     */


    const WaitingRoomPlayersSocket = () => {
        subscribe('/topic/players', msg => {
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setNoOfPlayers(JSON.parse(sessionStorage.getItem('playerList')));
            //sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook
            console.log(noOfPlayers)

            /*
            console.log(msg);
            setNoOfPlayers(msg);
            console.log(noOfPlayers);
            // console.log(noOfPlayers.length); --> this part does not work, gives 0 when leaving
            sessionStorage.setItem('playerList', JSON.stringify(msg))

             */
        });

        /*
        subscribe('/topic/getPlayers', msg => {
            console.log(msg)
            sessionStorage.setItem('playerList', JSON.stringify(msg))
            setNoOfPlayers(JSON.parse(sessionStorage.getItem('playerList')));
            //sessionStorage.removeItem('playerList')//TODO figure out how to store the string array in a hook
            console.log(noOfPlayers)
        });

         */
    }


    const joinWaitingRoom = async () => {
        console.log(noOfPlayers)
        if (checkIfWaitingRoomHasSpace()) {
            await sendName(localStorage.getItem('username'));
            //getPlayers();
            history.push('/waitingroom/1');
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