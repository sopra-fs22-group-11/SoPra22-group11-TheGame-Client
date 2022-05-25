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

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);


  const doLogin = async () => {
    if (!buttonPressed) {
      try {
        setButtonPressed(true);
        const requestBody = JSON.stringify({username, password});
        const response = await api.post('/session', requestBody)
        // Get the returned User and update a new object.
        const user = new User(response.data)
        // Store the token into the session storage.
        sessionStorage.setItem('token', user.token)
        sessionStorage.setItem('loggedInUser', user.id);
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('clickedStart', JSON.stringify(false));
        // Login successfully worked --> navigate to the route /game in the GameRouter
        if (sessionStorage.getItem('FromWaitingRoom') == true) {
          sessionStorage.removeItem('FromWaitingRoom');
          history.push('/waitingroom/1');
          return;
        } else {
          history.push(`/startpage`);
          return;
        }
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        setButtonPressed(false);
      }

    }
  };

  async function fetchData() {
    try {
      const response = await api.put('/users');

      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      //setUsers(response.data);

      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);

    } catch (error) {
      console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the users! See the console for details.");
    }
  }

// moves to the registration page
  const doRegister = () =>{
      history.push(`/registration`);
      return;
  }

  return (
      <div>
        <Header height="100"/>
      <BaseContainer>
        <div className="entry container">
          <div className="entry form">
            <div className="entry title">
              Login
            </div>
            <FormField2
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
            />
            <FormField
                label="Password"
                value={password}
                type ={"password"}
                onChange={n => setPassword(n)}
            />
            <div className="entry button-container">
              <Button
                  disabled={!username || !password}
                  width="100%"
                  onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>
            <div className="entry button-container" display = "block">
              <label className="entry label">
                No account yet?
              </label>

              <a href="/registration"
              > Register here </a>
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
export default Login;
