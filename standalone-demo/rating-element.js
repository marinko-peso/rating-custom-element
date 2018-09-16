class RatingElement extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'max'];
  }

  constructor() {
    super();

    this.choices = [];
    this._classes = {
      choices: this.getAttribute('choices-class') || 'x-choice',
      checked: this.getAttribute('checked-class') || 'checked',
      highlighted: this.getAttribute('highlighted-class') || 'highlighted'
    };

    this.onHighlight = this.onHighlight.bind(this);
    this.onRate = this.onRate.bind(this);
  }

  onHighlight(e) {
    if (e.type === 'mouseleave') return this.highlightChoices();
    const index = this.choices.indexOf(e.target);
    if (index !== -1) this.highlightChoices(index);
  }

  onRate(e) {
    const index = this.choices.indexOf(e.target);
    if (index === -1) return;
    const oldValue = this.value;
    const value = index + 1;
    this.value = value;
    const detail = { value, oldValue };
    this.dispatchEvent(new CustomEvent('rate', { detail }));
  }

  connectedCallback() {
    this.addEventListener('mouseleave', this.onHighlight);
    this.addEventListener('mouseover', this.onHighlight);
    this.addEventListener('click', this.onRate);

    if (!this.hasAttribute('value')) this.setAttribute('value', 0);
    if (!this.hasAttribute('max')) this.setAttribute('max', 5);
  }

  disconnectedCallback() {
    this.removeEventListener('mouseleave', this.onHighlight);
    this.removeEventListener('mouseover', this.onHighlight);
    this.removeEventListener('click', this.onRate);
  }

  attributeChangedCallback(name) {
    if (name === 'max') this.renderChoices();
    const predicate = (_, i) => i < this.value;
    return toggleClass(this.choices, this._classes.checked, predicate);
  }

  renderChoices() {
    this.choices.forEach(el => el.remove());
    this.choices = Array.from({ length: this.max }, () => {
      const el = document.createElement('div');
      el.className = this._classes.choices;
      return this.appendChild(el);
    });
  }

  highlightChoices(end = -1) {
    const predicate = (_, i) => i <= end;
    return toggleClass(this.choices, this._classes.highlighted, predicate);
  }

  get value() {
    return parseInt(this.getAttribute('value'), 10);
  }

  set value(val) {
    val = parseInt(val, 10);
    if (val < 0 || val > this.max) return;
    this.setAttribute('value', val);
  }

  get max() {
    return parseInt(this.getAttribute('max'), 10);
  }

  set max(val) {
    val = parseInt(val, 10);
    if (val < Math.max(this.value, 1)) return;
    this.setAttribute('max', val);
  }
}

if (window.customElements && window.customElements.define) {
  window.customElements.define('x-rating-element', RatingElement);
}

function toggleClass(elements, className, callback) {
  elements.forEach((el, i, items) => {
    el.classList.toggle(className, callback(el, i, items));
  });
}
