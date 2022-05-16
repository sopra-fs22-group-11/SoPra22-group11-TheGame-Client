import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";



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
        const  sortedUsers = [].concat(users)
            .sort((a, b) => a.score < b.score ? 1 : -1)
            .map((user) => user);
        console.log(sortedUsers)
        content = (
            <div>
                <table className="score user-table">
                    <thead>
                    <tr>
                        <th className="score labelAccent">Username</th>
                        <th className="score labelAccent">Status</th>
                        <th className="score labelAccent">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(sortedUser => (
                            <tr key={sortedUser.id}>
                                <td>{sortedUser.username}</td>
                                <td>{sortedUser.status}</td>
                                <td>{sortedUser.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "score container">
            <div className="score titleSmall">Scoreboard</div>
            <div className="score form">
            {content}
            </div>
        </BaseContainer>
        </div>

    ) ;

}

export default Scoreboard;
