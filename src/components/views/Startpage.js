import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";


// COPY FROM GAME SITE OF M1
const Player = ({player}) => (
    <div className="user container">
        <div className="user playername">{player.playername}</div>
        <div className="user name">{player.name}</div>
        <div className="user id">id: {player.id}</div>
    </div>
);


Player.propTypes = {
    player: PropTypes.object
};

const Startpage = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [players, setPlayers] = useState(null);

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/players');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned players and update the state.
                setPlayers(response.data);

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

        fetchData();
    }, []);

    let content = <Spinner/>;

    if (players) {
        content = (
            <div className="home">
                <ul className="home player-list">
                    {players.map(player => (
                        <Player player={player} key={player.id}/>
                    ))}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Play
                </Button>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Rules
                </Button>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Score
                </Button>
            </div>
        );
    }


    return (
        <BaseContainer className="home container">
            <h2> Welcome to</h2>
            <div className="home form">
                <div className="home title">
                    The Game
                </div>
                {content}
            </div>

        </BaseContainer>
    );
}

export default Startpage;
