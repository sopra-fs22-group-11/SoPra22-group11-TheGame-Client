/**
 * Player model
 */
class Player {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default Player;
