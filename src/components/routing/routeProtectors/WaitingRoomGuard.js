import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const WaitingRoomGuard = props => {
    if (!JSON.parse(sessionStorage.getItem("gameStatus"))) {
        return props.children;
    }
    return <Redirect to="/waitingroomOverview"/>;
    return props.children;
};

WaitingRoomGuard.propTypes = {
    children: PropTypes.node
};