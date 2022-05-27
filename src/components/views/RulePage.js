import {Spinner} from 'components/ui/Spinner';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/RulePage.scss";
import HeaderHome from "./HeaderHome";
import DiscardPiles from "../../DiscardPiles.png";
import DrawPile from "../../DrawPile.png";
import NoMovesButton from "../../NoMovesButton.png";
import BackwardsTrick from "../../BackwardsTrick.png";
import {connect} from "../utils/sockClient";
import {useHistory} from "react-router-dom";


const RulePage = () => {
    const history = useHistory();


    const goToHome = () => {
            history.push('/startpage');
    }



    let content = <Spinner/>;

    content = (
        <div className="rules">

            <div class = "rules column">
                <b>Players:</b> 2 – 4 people <br/>
                <b>Age:</b> 8 + <br/>
                <b>Duration:</b> approx. 20min
                <p>
                    During the game, four piles of cards are formed in the middle of the table.
                    Two piles are in ascending order (numbers 1–99), and two piles are in descending order (numbers 100–2).
                    Everyone plays together in the same team and tries to play as many cards as possible, all 98 if possible, in four piles of cards.
                </p>

                <p>
                    In an ascending pile of cards the card number of each card played must always be greater than the card played before it. How much space left between the cards does not matter, e.g. 3, 11, 12, 13, 18, 20, 34, 35, 51. Or 2, 7, 19, 25, 28, 29, 49, etc. The smaller the space left between cards the better, so that you can play as many cards as possible.
                    Only the top card of each pile is visible.
                    In a descending row of cards it‘s exactly the opposite: each card must always be smaller than the card before, e.g. 94, 90, 78, 61, 60, 57. Or 98, 97, 88, 83, 81, etc.
                </p>
                <p><img src={DiscardPiles} alt="Discard Piles in the game" height="60px" /></p>
                <b>How to play</b>
                <p>
                    For a 3- or 4-player game, each player is dealt 6 cards (7 cards for a 2-player game), which make up their hand. The remaining cards are on the draw pile.
                </p>
                <p>
                    On your turn you have to play at least two cards from your hand to any of the four piles. When the draw pile is empty you need to play at least one card.
                </p>
            </div>

            <div className="rules column">
                <p>
                    If possible, you can play as many more cards as you like, even until you have no cards left in your hand. Play the cards individually, one after the other.
                    You‘re free to choose which pile to play your cards on, as long as you follow the rules as described of laying in a descending or ascending order on the respective pile.  You can play all your cards on the same pile, or on multiple piles in any sequence you like.
                </p>
                <p>
                    Once you have finished your turn, click on the draw pile. Your cards fill up again, as long as the draw pile is not empty. The next player now takes their turn, plays their cards and picks up cards from the draw pile to complete their hand. The number of remaining cards is visible on the draw pile.
                </p>
                <p><img src={DrawPile} alt="Draw Pile in the game" height="70px" /></p>
                <b>The backwards trick!</b>
                <p>
                    As the game carries on, the four piles will increase in size as you add more and more cards to the piles. The general rules for playing cards as described above must be followed at all times.
                    However, there is one single exception that lets you play in the reverse order: whenever the value of the number card is exactly 10 higher or lower. Here‘s how it works:
                    <ul>
                        <li>
                            On your turn, you can play a card on an ascending pile when the number of this card is exactly 10 less than the number showing on the pile.
                        </li>
                        <li>
                            On your turn, you can play a card on a descending pile when the number of the card is exactly 10 greater than the number showing on the pile.
                        </li>
                    </ul>
                    You can use the backwards trick as often as you like and on different piles during your turn.
                </p>
            </div>

            <div className="rules column">
                <p><img src={BackwardsTrick} alt="Backwards trick" height="200px" /></p>
                <b>Allowed communication</b>
                <p>
                    During the game players are never allowed to ask the others for the exact numbers on their cards or reveal the numbers of their own cards. Mentioning concrete numbers in any way is strictly forbidden!
                    Other than that, all communication is allowed. For example, you can say: “Don‘t lay on the last pile,” or, “Don‘t make a big jump on this pile.”
                </p>
                <b>End of the game</b>
                <p>
                    When the draw pile is empty, continue playing without drawing cards. Note: From this point on, each player only has to play a single card, but still may play more.
                    The game is over as soon as a player cannot play the minimum number of cards during their turn. If all cards are played, the game is won. When you think you can't make a move anymore, click on the button "no moves possible".
                </p>
                <img src={NoMovesButton} alt="No moves possible button" height="55px" />
            </div>

        </div>
    );


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "rules container">
            <div className="rules title">

                Rules for The Game</div>

            <div className="rules form">


            {content}
            </div>
        </BaseContainer>
        </div>

    ) ;

}

/*<img src="https://img.icons8.com/ios/50/FFFFFF/back--v1.png" width="30px" className="rules backbutton-left"
     onClick={() => goToHome()}/>
<text> </text>*/

export default RulePage;