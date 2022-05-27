import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import "styles/ui/Button.scss";
import HeaderHome from "./HeaderHome";
import {connect} from "../utils/sockClient";


const Startpage = () => {

    const history = useHistory();

    const goToWaitingroomOverview = () => {
        connect(()=> {
            history.push('/waitingroomOverview');
            return;
        })
    }




    let content = (
            <div className="home"
            >
                <div display="block" justify-content="space-between">
                <Button
                    width ="30%"
                    onClick={() => {history.push('/rulePage');
                                    return;}}


                >

                    Rules<br />
                    <img src="https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/FFFFFF/external-question-call-to-action-bearicons-detailed-outline-bearicons.png" width="50px"/>
                </Button>
                <Button
                    width ="30%"
                    onClick={() => {history.push('/scoreboard')
                                    return;}}
                >
                    Scores <br />
                    <img src="https://img.icons8.com/ios/50/FFFFFF/trophy--v1.png"/>
                </Button>
                </div>
                <Button className = "button-startPage"
                        margine-top ="10px"
                    onClick={() => goToWaitingroomOverview()}

                >
                    Let's play <br />
                    <img src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/play--v1.png"/>
                </Button>
            </div>
        );



    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className="home container">
            <h2> Welcome to</h2>
            <div className="home form">
                <div className="home title">
                    The Game
                </div>
                <h2> </h2>
                <h2> </h2>
                <h2> </h2>
                {content}
            </div>
            <a target="_blank" href="https://icons8.com/icon/LVtMPps1ASuP/spielen" >Spielen icon by Icons8</a>
            <a target="_blank" href="https://toppng.com/free-image/svg-logo-punisher-punisher-skull-PNG-free-PNG-Images_180739" >Image credit: Marvel Studios</a>
        </BaseContainer>
        </div>
    );
}

export default Startpage;
