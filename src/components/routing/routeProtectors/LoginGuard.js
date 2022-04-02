import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  if (!localStorage.getItem("token")) {
    return props.children;
  }
  // if player is already logged in, redirects to the main /app
  return <Redirect to="/startpage"/>;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}