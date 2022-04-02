import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import Player from 'models/Player';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Registration = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [playername, setPlayername] = useState(null);

    const doRegistration = async () => {
        try {
            let creationDate = new Date(); // if this does not work while testing try instant()
            const requestBody = JSON.stringify({playername: playername, password: password, creationDate});
            const response = await api.post('/players', requestBody);

            // Get the returned player and update a new object.
            const player = new Player(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', player.token);

            // Registration successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the registration: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <h3>Registration</h3>
                    <FormField
                        label="Playername"
                        value={playername}
                        onChange={un => setPlayername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <div className="registration button-container">
                        <Button
                            disabled={!playername || !password}
                            width="100%"
                            onClick={() => doRegistration()}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default Registration;


