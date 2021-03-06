import {Redirect, useParams} from "react-router-dom";
import PropTypes from "prop-types";

export const SettingsGuard = props => {
    let { userId } = useParams();
    if( userId==sessionStorage.getItem("loggedInUser")){
        return props.children;
    }

    return <Redirect to="/startpage"/>;
};

SettingsGuard.propTypes = {
    children: PropTypes.node
};