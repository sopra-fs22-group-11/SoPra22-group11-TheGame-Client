import {useHistory} from 'react-router-dom';
import "styles/views/Entry.scss";
import Header from "./Header";
import "styles/ui/BaseContainer.scss";
import {Button} from "../ui/Button";
import React from "react";






const LandingPage = () => {
    const history = useHistory();

    const goToLogin = () => {
        history.push('/login');
    }

    return (
        <div>
            <Header height="100"/>
            <div className="landingPage">
                <h2> Are you ready to play </h2>
                <div className="home title">
                    The Game ?
                </div>
                <Button
                    onClick={() => goToLogin()}

                >
                    Play
                </Button>

            </div>
        </div>
    );
}

export default LandingPage;
