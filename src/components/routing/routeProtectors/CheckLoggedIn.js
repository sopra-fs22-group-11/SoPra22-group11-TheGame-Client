import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */

export  const CheckLoggedIn = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    // if user is already registered, redirects to the main app
    return <Redirect to="/registration"/>;
};

CheckLoggedIn.propTypes = {
    children: PropTypes.node
}