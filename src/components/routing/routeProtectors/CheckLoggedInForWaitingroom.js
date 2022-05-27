import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export  const CheckLoggedInForWaitingroom = props => {
    if (sessionStorage.getItem("token")) {
        return props.children;
    }
    // if user is already registered, redirects to the main app
    sessionStorage.setItem('FromWaitingRoom', JSON.stringify(true));
    return <Redirect to="/registration"/>;
};

CheckLoggedInForWaitingroom.propTypes = {
    children: PropTypes.node
}