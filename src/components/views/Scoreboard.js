import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";

// TODO: display calculated score winningCount/gameCount

const User = ({user}) => (
    <div className="user container">
        <div className="username">{user.username}</div>
        <div className="status">{user.status}</div>
    </div>
);

User.propTypes = {
    user: PropTypes.object
};

const Scoreboard = () => {

    const history = useHistory();

    const [users, setUsers] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

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
    if (users) {
        content = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => (
                        <li>
                            <button className="user-button">
                                <User user={user} key={user.username}/>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "Home container">
            <h2>Ranking</h2>
            <p className="game paragraph">
                User ranking with their percentage of won games and status:
                <p></p>
                <button className="user-button">
                    Username, Score, Status
                </button>
            </p>
            {content}
        </BaseContainer>
        </div>

    ) ;

}

export default Scoreboard;
