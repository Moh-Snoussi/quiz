import BaseComponent from '/components/BaseComponent.js';

export default class Loadcourse extends BaseComponent {
    constructor(container) {
        super(container);
    }

    loaded() {
        console.log('Loadcourse loaded');
    }
}
