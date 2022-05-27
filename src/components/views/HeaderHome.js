import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {api} from "../../helpers/api";
import TheGameLogo from "../../TheGameLogo.png";
import {
    LeaveWaitingRoom
} from "../utils/sockClient";



export const logout = () => {
    //get a token
    let id = sessionStorage.getItem('loggedInUser');
    try{
        const response = api.get('/session/'+ id);
        LeaveWaitingRoom(sessionStorage.getItem('username'));
    } catch (e){
        console.log(e)
    }
    sessionStorage.removeItem('loggedInUser')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('clickedStart');
    sessionStorage.removeItem('gto')
    sessionStorage.removeItem('playerList')
    sessionStorage.removeItem('gameStatus')


    //TODO check correct removeItem
}

const goToHome = () => {
    try{
        LeaveWaitingRoom(sessionStorage.getItem('username'));
    } catch (e) {
        console.log("it did not work")
    }
}




const HeaderHome = props => (
    <div className="header container">

        <div className="header title"
        >
            The Game |
            <img src={TheGameLogo} alt="game Logo" height="45px" />
        </div>
        <iv className="header-right">
            <a
               cursor="pointer"
               onClick={() => goToHome()}
               href="/startpage"
            >Home </a>
            <a cursor="pointer"
                onClick={() => goToHome()}
                href="/editUser/"

            >Edit Profile</a>
            <a cursor="pointer"
               onClick={() => goToHome()}
                href="/rulePage"
            >Rules</a>
            <a href="/login"
               cursor="pointer"
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
