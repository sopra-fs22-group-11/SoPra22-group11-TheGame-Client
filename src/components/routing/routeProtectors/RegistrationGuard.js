import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const RegistrationGuard = props => {
    if (!sessionStorage.getItem("token")) {
        return props.children;
    }
    // if user is already registered, redirects to the main app
    return <Redirect to="/startpage"/>;
};

RegistrationGuard.propTypes = {
    children: PropTypes.node
}