import './tiny.scss';

export class Tiny {
  cards = [];

  constructor() {
    this.generateCard();
    this.generateCard();
    document.onkeydown = (e) => {
      let keyNum = window.event ? e.keyCode :e.which;
      this.generateCard();//TODO 移动完成之后再生成
      // 37~40 ←↑→↓
      switch (keyNum) {
        case 37:
          this.cards[0].x = 0;
          break;
        case 38:
          this.cards[0].y = 0;
          break;
        case 39:
          this.cards[0].x = 3;
          break;
        case 40:
          this.cards[0].y = 3;
          break;
      }
    };
  }

  moveRight() {

  }

  generateCard() {
    if (this.cards.length === 16) {
      alert('Game Over!');
    }
    let map = new Map();
    for(let card of this.cards) {
      map.set(card.location, card.value);
    }
    let randomLocation = Math.floor(Math.random() * (16 - this.cards.length));
    let location = 0;
    for(let i = 0; i < 16; i++) {
      if (!map.get(i)) {
        if (location === randomLocation) {
          this.cards.push({
            location: i,
            value: 2
          });
          break;
        }
        location++;
      }
    }
  }

  getYLocation(location) {
    return Math.floor(location);
  }
}
