import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import "styles/ui/Button.scss";
import HeaderHome from "./HeaderHome";
import {connect} from "../utils/sockClient";


// COPY FROM GAME SITE OF M1
const User = ({user}) => (
    <div className="user container">
        <div className="user username">{user.username}</div>
        <div className="user name">{user.name}</div>
        <div className="user id">id: {user.id}</div>
    </div>
);


User.propTypes = {
    user: PropTypes.object
};

const Startpage = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);


    const goToWaitingroomOverview = () => {
        history.push('/waitingroomOverview');
    }

    //join directly the waitingroom
    /*
    const joinWaitingroom = async () => {
        connect(()=> {
            history.push('/waitingroom/1'); //for the start we need the waitingroom 1
        })
    }

     */

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
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

        fetchData();
    }, []);

    let content = <Spinner/>;

    //put away the users
   /* <ul className="home user-list">
        {users.map(user => (
            <User user={user} key={user.id}/>
        ))}
    </ul>*/

    if (users) {
        content = (
            <div className="home"
            >
                <div display="block" justify-content="space-between">
                <Button
                    width ="30%"
                    onClick={() => history.push('/rulePage')}


                >

                    Rules
                    <img src="https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/FFFFFF/external-question-call-to-action-bearicons-detailed-outline-bearicons.png" width="50px"/>
                </Button>
                <Button
                    width ="30%"
                    onClick={() => history.push('/scoreboard')}
                >
                    Scores
                    <img src="https://img.icons8.com/ios/50/FFFFFF/trophy--v1.png"/>
                </Button>
                </div>
                <Button className = "button-startPage"
                        margine-top ="10px"
                    onClick={() => goToWaitingroomOverview()}

                    //  onClick={() => history.push('/game')}
                >
                    Let's play
                    <img src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/play--v1.png"/>
                </Button>
            </div>
        );
    }


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className="home container">
            <h2> Welcome to</h2>
            <div className="home form">
                <div className="home title">
                    The Game
                </div>
                <h2> </h2>
                <h2> </h2>
                <h2> </h2>
                {content}
            </div>
            <a target="_blank" href="https://icons8.com/icon/LVtMPps1ASuP/spielen" >Spielen icon by Icons8</a>
        </BaseContainer>
        </div>
    );
}

export default Startpage;
