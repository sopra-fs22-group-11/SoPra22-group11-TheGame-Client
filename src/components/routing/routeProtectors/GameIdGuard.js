import {Redirect, useParams} from "react-router-dom";
import PropTypes from "prop-types";

export const GameIdGuard = props => {
    let { gameId } = useParams();
    if( gameId==sessionStorage.getItem("gameId")){
        return props.children;
    }
    return <Redirect to="/startpage"/>;
};

GameIdGuard.propTypes = {
    children: PropTypes.node
};


// Hier muss noch entschieden werden, wie wir kontrollieren, dass Spieler nur in ihr eigenes game können