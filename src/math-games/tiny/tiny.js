import './tiny.scss';

export class Tiny {
  cards = [];

  constructor() {
    this.cards.push({
      x: 0,
      y: 0,
      value: 2
    });
    document.onkeydown = (e) => {
      let keyNum = window.event ? e.keyCode :e.which;
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
}
