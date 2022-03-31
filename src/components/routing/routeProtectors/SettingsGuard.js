import {Redirect, useParams} from "react-router-dom";
import PropTypes from "prop-types";

export const SettingsGuard = props => {
    let { userId } = useParams();
    if( userId==localStorage.getItem("loggedInPlayer")){
        return props.children;
    }

    return <Redirect to="/startpage"/>;
};

SettingsGuard.propTypes = {
    children: PropTypes.node
};