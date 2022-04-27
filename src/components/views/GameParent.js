import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import ZoomVideo from '@zoom/videosdk';
import initClientEventListeners from "../../zoom/js/meeting/session/client-event-listeners";
import initButtonClickHandlers from "../../zoom/js/meeting/session/button-click-handlers";
import state from "../../zoom/js/meeting/session/simple-state";
import sessionConfig from "../../zoom/js/config";
import VideoSDK from "@zoom/videosdk";
import HeaderHome from "./HeaderHome";
import SockClient from "../utils/sockClient";
import config from "../../zoom/js/config";
import AppRouter from "../routing/routers/AppRouter";
import Game from "./Game";
import Waitingroom from "./Waitingroom";
import SockJS from "sockjs-client";
import {getDomain} from "../../helpers/getDomain";






const GameParent =   () => {

    const [test, setTest] = useState("15");


    return (
        <div>
            <Game test1={test} test2={setTest()} />
            <Waitingroom test1={test} test2={setTest()} />
            <sockClient/>
        </div>


    );

}

export default GameParent;