import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import Player from 'models/Player';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
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

const Login = props => {
  const history = useHistory();
  const [name, setName] = useState(null);
  const [Playername, setPlayername] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ Playername, name});
      const response = await api.post('/players', requestBody);

      // Get the returned player and update a new object.
      const player = new Player(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', player.token);
      localStorage.setItem('loggedInPlayer', player.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doRegistration = async () => {
    try {
      // registration --> navigate to the route /registration in the AppRouter
      history.push(`/registration`);
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <h3>Login</h3>
          <FormField
            label="Playername"
            value={Playername}
            onChange={un => setPlayername(un)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={n => setName(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!Playername || !name}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <div className="registration primary-button">
              <Button
                  width="100%"
                  onClick={() => doRegistration()}
              >
               go to registration
              </Button>
            </div>
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
export default Login;
