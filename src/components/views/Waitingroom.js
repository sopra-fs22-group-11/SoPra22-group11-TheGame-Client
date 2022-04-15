import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import sockClient from "../utils/sockClient";
import SockClient from "../utils/sockClient";

const Waitingroom = () => {

    // localStorage.setItem('gameId', ); Hier noch herausfinden wie wir schauen, dass leute nur in ihr spiel können
    // siehe gameIdGuard in RouteProtectors


    return (
        <BaseContainer className = "home container">

        </BaseContainer>


    ) ;

}

export default Waitingroom;