import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const LoginGuard = props => {
  if (!sessionStorage.getItem("token")) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /app
  return <Redirect to="/startpage"/>;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}