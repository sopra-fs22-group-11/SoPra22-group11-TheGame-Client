



function Modal(){

    return(
    <div className={'modal'}>
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
    </div>
    );
}

export default Modal;