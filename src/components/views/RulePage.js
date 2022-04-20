import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/RulePage.scss";
import HeaderHome from "./HeaderHome";            //maybe change it later to Home.scss


const RulePage = () => {



    let content = <Spinner/>;

    content = (
        <div className="rules">
            <div class = "rules column">
                <b>Players:</b> 2 – 5 people <br/>
                <b>Age:</b> 8 years and up <br/>
                <b>Duration:</b> approx.20min
                <p>
                    During the game, four rows of cards are formed in the middle of the table.
                    Two rows are in ascending order (numbers 1–99), and two rows are in descending order (numbers 100–2).
                    Everyone plays together in the same team and tries to lay as many cards as possible, all 98 if possible, in four rows of cards
                </p>
                <b>The Rows of Cards: Rules for Laying Cards</b>
                <p>
                    In an ascending row of cards the card number of each card laid must always be greater than the card laid before it. How much space left between the cards does not matter, e.g. 3, 11, 12, 13, 18, 20, 34, 35, 51. Or 2, 7, 19, 25, 28, 29, 49, etc. The smaller the space left between cards the better, so that you can lay as many cards as possible.
                    Since you lay the card on the pile, only the top card of each pile is visible.
                    In a descending row of cards it‘s exactly the opposite: each card laid must always be smaller than the card before it, e.g. 94, 90, 78, 61, 60, 57. Or 98, 97, 88, 83, 81, etc.
                </p>
                <b>How to play</b>
                <p>
                    For a 3, 4 or 5-player game, each player is dealt 6 cards (7 cards for a 2-player game), which make up his hand. The remaining number cards are on the draw pile.
                </p>
                <p>
                    First, each player looks at his hand, then together the players decide who goes first. On your turn lay at least two cards from your hand to any of the four row piles.
                </p>
            </div>

            <div className="rules column">
                <p>
                    If possible, you can lay as many more cards as you like, even until you have no cards left in your hand. Lay the cards individually, one after the other.
                    You‘re free to choose which pile to lay your number cards on, as long as you follow the rules as described of laying in a descending or ascending order on the respective pile.  You can lay all your cards on the same pile, or on multiple piles in any sequence you like.
                </p>
                <p>
                    Once you have finished your turn, click on the draw pile to pick up the same number of cards, that you laid in this round. The next player now takes his turn, lays his cards and picks up cards from the draw pile to complete his hand.

                </p>
                <b>The piles are getting bigger: the backwards trick!</b>
                <p>
                    As the game carries on, the four piles will increase in size as you add more and more cards to the piles. The general rules for laying cards as described above must be followed at all times.
                    However, there is one single exception that lets you play in the reverse order: whenever the value of the number card is exactly 10 higher or lower. Here‘s how it works:
                    <ul>
                        <li>
                            On your turn, you can lay a card on an ascending pile when the number card is exactly 10 less than the number showing on the pile.
                        </li>
                        <li>
                            On your turn, you can lay a card on a descending pile when the number card is exactly 10 greater than the number showing on the pile.
                        </li>
                    </ul>
                    You can use the backwards trick as often as you like and on different piles during your turn.
                </p>
            </div>

            <div className="rules column">
                <b>The backwards trick!</b>
                <p>
                    As the game carries on, the four piles will increase in size as you add more and more cards to the piles. The general rules for laying cards as described above must be followed at all times.
                    However, there is one single exception that lets you play in the reverse order: whenever the value of the number card is exactly 10 higher or lower. Here‘s how it works:
                    <ul>
                        <li>
                            On your turn, you can lay a card on an ascending pile when the number card is exactly 10 less than the number showing on the pile.
                        </li>
                        <li>
                            On your turn, you can lay a card on a descending pile when the number card is exactly 10 greater than the number showing on the pile.
                        </li>
                    </ul>
                    You can use the backwards trick as often as you like and on different piles during your turn.
                </p>
                <b>Permissible communication</b>
                <p>
                    During the game players are never allowed to ask the others for the exact number on their cards or reveal the numbers of their own cards. Mentioning concrete numbers in any way is strictly forbidden!
                    Other than that, all other communication is allowed. For example, you can say: “Don‘t lay on the last pile,” or, “Don‘t make a big jump on this pile.”
                </p>
                <b>End of the game</b>
                <p>
                    When the draw pile is empty, continue playing without drawing cards. Note: From this point on, each player only has to play a single card, but still may play more.
                    The game is over as soon as a player cannot play the minimum number of cards during his turn or all cards are played.
                </p>
            </div>

        </div>
    );


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "Home container">
            <h2>Rules for The Game</h2>
            <div className="rules form">

            {content}
            </div>
        </BaseContainer>
        </div>

    ) ;

}

export default RulePage;