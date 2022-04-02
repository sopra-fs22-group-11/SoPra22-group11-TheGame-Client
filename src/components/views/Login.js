import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import Player from 'models/Player';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
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

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [playername, setPlayername] = useState(null);


  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({playername, password});
      const response = await api.put('/session', requestBody)
      // Get the returned Player and update a new object.
      const player = new Player(response.data)
      // Store the token into the local storage.
      localStorage.setItem('token', player.token)
      localStorage.setItem('loggedInPlayer', player.id);
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  async function fetchData() {
    try {
      const response = await api.put('/players');

      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned players and update the state.
      //setPlayers(response.data);

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);

    } catch (error) {
      console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the players! See the console for details.");
    }
  }

// moves to the registration page
  const doRegister = async () =>{
    try{
      history.push(`/registration`);
    }
    catch (error){
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }

  }
  //  <!-- Kopie von oben -->
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
                value={password}
                type ={"password"}
                onChange={n => setPassword(n)}
            />
            <div className="login button-container">
              <Button
                  disabled={!playername || !password}
                  width="100%"
                  onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>
            <div className="register button-container">
              <Button
                  width="100%"
                  onClick={() => doRegister()}
              >
                Click here to register
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
export default Login;
