export default class JsonTreeViewer {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.container.classList.add('json-tree');
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.appendChild(this.buildTree(this.data));
    }

    buildTree(obj, path = []) {
        const ul = document.createElement('ul');

        for (const key in obj) {
            const li = document.createElement('li');
            const currentPath = [...path, key];

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                li.innerHTML = `<span class="key">${key}</span>`;
                li.appendChild(this.buildTree(obj[key], currentPath));
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.classList.toggle('collapsed');
                });
            } else {
                li.innerHTML = `
          <span class="key">${key}</span>:
          <span class="value">${obj[key]}</span>
          <span class="edit" style="margin-left:5px; color: blue; cursor: pointer;">✎</span>
        `;

                const editBtn = li.querySelector('.edit');
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editValue(li, currentPath);
                });
            }

            ul.appendChild(li);
        }

        return ul;
    }

    editValue(li, path) {
        const keySpan = li.querySelector('.key');
        const valueSpan = li.querySelector('.value');
        const editBtn = li.querySelector('.edit');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = valueSpan.textContent;
        input.style.marginLeft = '5px';

        li.innerHTML = '';
        li.appendChild(keySpan);
        li.appendChild(document.createTextNode(': '));
        li.appendChild(input);

        input.focus();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.updateValue(path, input.value);
            }
        });

        input.addEventListener('blur', () => {
            this.updateValue(path, input.value);
        });
    }

    updateValue(path, newValue) {
        let obj = this.data;
        for (let i = 0; i < path.length - 1; i++) {
            obj = obj[path[i]];
        }
        const lastKey = path[path.length - 1];

        // Try to parse numbers automatically
        if (!isNaN(newValue) && newValue.trim() !== '') {
            newValue = Number(newValue);
        }

        obj[lastKey] = newValue;
        this.render();
    }
}
