class RatingElement extends HTMLElement {
  constructor () {
    super();

    this.ratingElements = [];

    // Handle default data sent as attributes.
    // Make sure value and number are last since they invoke render actions.
    this._defaultClass = this.getAttribute('default-class') || 'x-rating';
    this._markedClass = this.getAttribute('marked-class') || 'x-marked';
    this.value = parseInt(this.getAttribute('value')) || 0;
    this.number = parseInt(this.getAttribute('number')) || 5;

    // Initial value highlight.
    this.highlight(this.value - 1);

    // Reset hovering state to an actual state once it stops.
    this.addEventListener('mouseout', e => this.highlight(this.value - 1));
  }

  get value () {
    return this._value;
  }
  set value (val) {
    this.setAttribute('value', val);
    this._value = val;
    this.highlight(val - 1);
  }

  get number () {
    return this._number;
  }
  set number (num) {
    this.setAttribute('number', num);
    this._number = num;
    this.createRatingElements();
  }

  highlight (index) {
    // Highlight all the ratings up to and including the index.
    this.ratingElements.forEach((el, i) => {
      el.classList.toggle(this._markedClass, i <= index);
    });
  }

  createRatingElements () {
    this.clearRatingElements();

    for (let i = 0; i < this.number; i++) {
      const el = document.createElement('div');
      el.className = this._defaultClass;
      this.appendChild(el);
      this.ratingElements.push(el);
      el.addEventListener('mousemove', e => this.highlight(i));
      el.addEventListener('click', e => {
        this.value = i + 1
        this.dispatchEvent(new Event('rate'));
      });
    }
  }

  clearRatingElements () {
    this.ratingElements = [];
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }
}

// Register element so browser knows what to do with it.
window.customElements.define('x-rating-element', RatingElement);
