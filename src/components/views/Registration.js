import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Entry.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";


const FormField = props => {
    return (
        <div className="entry field">
            <label className="entry label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="entry input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const FormField2 = props => {
    return (
        <div className="entry field">
            <label className="entry labelAccent">
                {props.label}
            </label>
            <input
                type={props.type}
                className="entry input"
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
    const [username, setUsername] = useState(null);
    const [buttonPressed, setButtonPressed] = useState(false);

    const doRegister = async () => { //Registers the user
        if (!buttonPressed) {
        try {
            setButtonPressed(true)
            const requestBody = JSON.stringify({username,  password: Password});
            const response = await api.post('/users', requestBody);


            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the session storage.
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('loggedInUser', user.id);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('clickedStart', JSON.stringify(false));

            if (JSON.parse(sessionStorage.getItem('FormWaitingRoom'))==true){
                sessionStorage.removeItem('FormWaitingRoom');

                history.push("/waitingroom/1");

                return;
            }else {
                history.push(`/startpage`);
                return;
            }

        } catch (error) {
            alert(`Something went wrong during the registration: \n${handleError(error)}`);
            setButtonPressed(false)
        }

        }
    };

    const goToLogin = () => {
        history.push('/login');
        return;
    }

    return (
        <div>
            <Header height="100"/>
        <BaseContainer>
            <div className="entry container">
                <div className="entry form">
                    <div className="entry title">
                        Registration
                    </div>
                    <FormField2
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={Password}
                        type ={"password"}
                        onChange={n => setPassword(n)}
                    />
                    <div className="entry button-container">
                        <Button
                            disabled={!username || !Password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
        </div>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;


