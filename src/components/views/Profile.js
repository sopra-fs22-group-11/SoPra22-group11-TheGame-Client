import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";

const Profile = () => {


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "Home container">

        </BaseContainer>
        </div>

    ) ;

}

export default Profile;