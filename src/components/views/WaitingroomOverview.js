import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";

const WaitingroomOverview = () => {

    const history = useHistory();

    const joinWaitingroom = () => {
        history.push('/waitingroom/1'); //for the start we need the waitingroom 1
    }

    return (
        <BaseContainer className = "home container">
            <Button
                width="100%"
                onClick={() => joinWaitingroom()}
            >
                Join Waiting Room
            </Button>

        </BaseContainer>


    ) ;

}

export default WaitingroomOverview;