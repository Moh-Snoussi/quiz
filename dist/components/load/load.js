import BaseComponent from '/components/BaseComponent.js';

export default class Load extends BaseComponent {
    constructor(container) {
        super(container);
    }

    loaded() {
        console.log('Load loaded');
    }
}
