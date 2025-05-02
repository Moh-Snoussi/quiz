import BaseComponent from '/components/BaseComponent.js';

export default class LoadCourse extends BaseComponent {
    constructor(container) {
        super(container);
    }

    loaded() {
        console.log('LoadCourse loaded');
    }
}
