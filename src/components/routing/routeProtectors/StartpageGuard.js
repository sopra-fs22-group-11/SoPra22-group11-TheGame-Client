import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const StartpageGuard = props => {
    if (sessionStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/login"/>;
};

StartpageGuard.propTypes = {
    children: PropTypes.node
};