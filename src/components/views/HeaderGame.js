import React, {useState} from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import goToHome from "./Game";
import goToRulePage from "./Startpage";
import doRegister from "./Login";
import goToLogin from "./Registration";

import BaseContainer from "../ui/BaseContainer";
import Modal from "../ui/Modal";
import Backdrop from "../ui/Backdrop";
import {terminate} from "../utils/sockClient";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import TheGameLogo from "../../TheGameLogo.png";



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
    localStorage.removeItem('token');
    //get ID of user
    let id = localStorage.getItem('ID');
    localStorage.removeItem('ID')
}


const leaveGame = () => {
    terminate();
    localStorage.removeItem('gto');
    goToHome();
}

const HeaderGame = props => {

    const [modalIsOpen, setModalIsOpen]= useState(false);
    const [textToDisplay, setTextToDisplay]= useState();
    const history = useHistory();

    function openModal(){
        setModalIsOpen(true);
    }

    function closeModal(){
        setModalIsOpen(false);
    }

    function clickRules(){
        setTextToDisplay(rulesText);
        openModal()
    }
    const rulesText = (
        <ul>
            <li>Saying numbers is not allowed! But you can say for example: " Don't put a card on that pile."</li>
            <li>The upwards triangle means that the pile goes from 1 to 100.</li>
            <li>The downwards triangle means that the pile goes from 100 to 1.</li>
            <li>You can only go down in an upwards pile, if you lay down a card that is exactly 10 less than the top card.</li>
            <li>You can only go up in an downwards pile, if you lay down a card that is exactly 10 more than the top card.</li>
            <li>You can do the backwards trick as often as you like during your turn.</li>
            <li>As long as the draw pile has cards you have to lay down at least two cards.</li>
            <li>When the draw pile is empty you only have to lay down at least one card.</li>
            <li>The game is over if you laid down all cards or a player can't play the minimum amount of cards.</li>

        </ul>


    )

    function cannotPlay(){ // TODO notify websocket that gamerunning: lost
        setTextToDisplay(lostText);
        openModal();
    }
    const lostText =(
        <div>
            <p>You have lost the game. Click "OK" to see your results</p>

            <Button className ="player-button"
                    disabled = {false}
                    width = "10%"
                    onClick={() => history.push('/gameResults')}
            >
                OK
            </Button>
        </div>



    )
    return(
        <div className="header container">
            <div className="header title">
                The Game |
                <img src={TheGameLogo} alt="game Logo" height="45px" />
            </div>

            <div className="header-right">
                <a //href="/rulePage"
                    onClick={() => clickRules()} /*gotoRulesPage()}*/
                > Rules
                    <img src="https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/000000/external-question-call-to-action-bearicons-detailed-outline-bearicons.png" width="50px"/>


                </a>
                <a href="/startpage"
                   onClick={() => leaveGame()}
                   display ="block"
                >
                    Leave Game
                    <img src="https://img.icons8.com/emoji/48/000000/leaf-fluttering-in-wind.png" />



                </a>
            </div>
            <div>
                <BaseContainer className = "overlay">
                    {modalIsOpen && <Modal text ={textToDisplay}/>}
                    {modalIsOpen &&<Backdrop clicked ={closeModal}/>}

                </BaseContainer>
            </div>

        </div>
    );

}



HeaderGame.propTypes = {
    height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderGame;
