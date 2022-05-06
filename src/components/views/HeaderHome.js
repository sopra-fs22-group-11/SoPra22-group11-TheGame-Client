import React from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import goToHome from "./Waitingroom";
import goToRulePage from "./Startpage";
import doRegister from "./Login";
import goToLogin from "./Registration";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const getRouterInHeader = () => {
    if (localStorage.getItem("token")) {
        return "/login";
    } else{
        return "/startpage";
    }
}

const hasToken = () => {
    if (localStorage.getItem("token")) {
        return "/login";
    } else{
        return "/startpage";
    }
}

const changeLocation = () =>{
    if (hasToken() ==true){
        goToRulePage();
    } else{
        doRegister();
    }
}

const logout = () => {
    //get a token
    //localStorage.removeItem('token'); // It is important that this happens after the logout is done
    let id = localStorage.getItem('loggedInUser');
    console.log('/session/'+ id)
    try{
        const response = api.get('/session/'+ id);}
    catch (e){
        console.log(e)
    }

    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    localStorage.removeItem('username');
    localStorage.removeItem('clickedStart');
    localStorage.removeItem('gto')
    localStorage.removeItem('playerList')

    //TODO check correct removeItem
}
const goToUserPage = () => {
    console.log("Hello")
    //const response = fetchUser()

    //console.log(response.id)

}



const HeaderHome = props => (
    <div className="header container">
        <div className="header title">
            The Game |
        </div>
        <iv className="header-right">
            <a href="/startpage"
               onClick={() => goToHome()}
            >Home </a>
            <a href="/editUser/"
               onClick={() => goToUserPage()}
            >Edit Profile</a>
            <a href="/rulePage"
               onClick={() => goToRulePage()}
            >Rules</a>
            <a href="/login"
               onClick={() => logout()}
            >Logout</a>
        </iv>
    </div>
);



HeaderHome.propTypes = {
    height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderHome;
