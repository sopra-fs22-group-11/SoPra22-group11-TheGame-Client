import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const GameIdGuard = props => {
    if( null!=sessionStorage.getItem("gto")){
        return props.children;
    }
    return <Redirect to="/reload"/>;
};

GameIdGuard.propTypes = {
    children: PropTypes.node
};

