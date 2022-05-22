import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import TheGameLogo from "../../TheGameLogo.png";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */


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

/**
 * Don't forget to export your component!
 */
export default Header;
