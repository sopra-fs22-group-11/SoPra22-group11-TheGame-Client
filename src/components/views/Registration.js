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
                type={props.type}
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
    const [Password, setPassword] = useState(null);
    const [playername, setPlayername] = useState(null);

    const doRegister = async () => { //Registers the player
        try {

            const requestBody = JSON.stringify({playername,  password: Password});
            const response = await api.post('/players', requestBody);


            // Get the returned player and update a new object.
            const player = new Player(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', player.token);
            localStorage.setItem('loggedInPlayer', player.id);


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
                    <FormField
                        label="Playername"
                        value={playername}
                        onChange={un => setPlayername(un)}
                    />
                    <FormField
                        label="Password"
                        value={Password}
                        type ={"password"}
                        onChange={n => setPassword(n)}
                    />
                    <div className="register button-container">
                        <Button
                            disabled={!playername || !Password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;


