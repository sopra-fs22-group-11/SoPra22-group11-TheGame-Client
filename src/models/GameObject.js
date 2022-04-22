/**
 * Game model
 */
class GameObject {
    constructor(data = {}) {
        this.noCardsOnDeck = null;
        this.whoseTurn = null;
        this.pilesList = null;
        this.playerCards= null;
        this.gameRunning = null;
        Object.assign(this, data); // target, source, checks if key is there and updates the new value, if its not there, it adds the new key value pair
        // it doesn't have to be in the correct order
        //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    }
}
export default GameObject;
