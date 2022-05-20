import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import closeAndRedirect from "./Game";

import BaseContainer from "../ui/BaseContainer";
import Modal from "../ui/Modal";
import Backdrop from "../ui/Backdrop";
import {playerLeaves, terminate} from "../utils/sockClient";
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
        <div>
        <div className="header title">Rules</div>
        <div className="header rules-overlay">
        <p>Pile with ▼: Only accepts smaller cards.</p>
        <p>Pile with ▲: Only accepts bigger cards.</p>
        <p>You have to play at least two cards when it is your turn, but when the draw pile is empty you only have to play at least one card. </p>
        <p>You can go in the opposite direction of a pile, if you lay down a card with the difference of exactly 10.</p>
        <p>You are allowed to talk, but it is forbidden to mention concrete numbers.</p>
        <p>The game is over, when there are no cards left or a player can't make any move.</p>
        </div>
        </div>
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
                <a
                    onClick={() => clickRules()} /*gotoRulesPage()}*/
                > Rules
                    <img src="https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/FFFFFF/external-question-call-to-action-bearicons-detailed-outline-bearicons.png" width="50px"/>

                </a>
                <a
                   onClick={() => {
                       // eslint-disable-next-line no-restricted-globals
                       let result = confirm("Are you sure you want to leave, this will end the Game for your teammates.")

                       if(result){
                           playerLeaves();
                           closeAndRedirect();
                       }}}
                >Leave Game
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
