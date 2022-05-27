import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import TheGameLogo from "../../TheGameLogo.png";


const Header = props => (
    <div className="header container">
        <div className="header title">
            The Game |
            <img src={TheGameLogo} alt="game Logo" height="45px" />
        </div>
        <div className="header-right">
            <a href="/login"
            >Login </a>
            <a href="/registration"
            >Register</a>
        </div>
    </div>
);




Header.propTypes = {
    height: PropTypes.string
};

export default Header;
