(function() {

    const calculator = {
        init: function() {
            const el_buttons = this.el_container.querySelectorAll('button'),
                el_outcomeBox = this.el_container.querySelector('#outcome'),
                arr_initialUnresolved = this.getUnresolvedArray();


            el_outcomeBox.innerHTML = arr_initialUnresolved.join('');
            // set initial content
            el_buttons.forEach(btn => btn.addEventListener('click', this.input));
            // give btns power
        },

        el_container: document.querySelector('#calculator'),
        el_u: '<span class="unresolved">0</span>',

        getUnresolvedArray: function() {
            const el_u = this.el_u;

            return [el_u, el_u, el_u, el_u, el_u, el_u, el_u, el_u, el_u, el_u];
        },

        input: function() {
            if (this.dataset.command) {
                switch (this.dataset.command) {
                    case 'recall':
                        calculator.recall();
                        break;
                    case 'clear':
                        calculator.clear();
                        break;
                    case 'displayOutcome':
                        calculator.displayOutcome();
                        break;
                }
            } else {
                calculator.addAnOperation(this.dataset.number || this.dataset.helper || this.dataset.operation);
            }
        },

        arr_operationsDoneSoFar: [],
        n_unusedArrIndexes: 10,

        addAnOperation: function(input) {
            let outcome = this.arr_operationsDoneSoFar;
            const arr_operators = ['-', '+', '/', ':', '.', '*']

            if (outcome[outcome.length - 1]) {
                if (arr_operators.includes(outcome[outcome.length - 1]) && arr_operators.includes(input)) {
                    Materialize.toast('Podwojny operator nie jest dozwolony', 2000);
                    return;
                }
            }

            if (this.n_unusedArrIndexes === 0) {
                Materialize.toast('Zbyt duzo znakow', 2000);
                return;
            } else {
                --this.n_unusedArrIndexes;
            }


            outcome.shift();
            outcome.push(input);

            for (let i = +outcome.length; i < 10; i++) {
                outcome.unshift(this.el_u);
            }

            this.el_container.querySelector('#outcome')
                .innerHTML = outcome.join('');
        },

        recall: function() {
            if (this.n_unusedArrIndexes >= 10) return;
            this.n_unusedArrIndexes++;
            this.arr_operationsDoneSoFar.pop();
            this.arr_operationsDoneSoFar.unshift(this.el_u);

            this.el_container.querySelector('#outcome')
                .innerHTML = this.arr_operationsDoneSoFar.join('');
        },

        displayOutcome: function() {
            const noEmptyCells = this.arr_operationsDoneSoFar
                .filter(el => !el.startsWith('<span class="unresolved"'));
            let copy = String(eval(noEmptyCells.join(''))),
                outcome = copy.split('');

            if (outcome.length > 10) outcome = outcome.slice(0, 10);

            this.n_unusedArrIndexes = 10 - outcome.length;

            if (outcome.length < 10) {
                for (let i = outcome.length; i < 10; i++) {
                    outcome.unshift(this.el_u);
                }
            }

            this.arr_operationsDoneSoFar = outcome;
            this.el_container.querySelector('#outcome')
                .innerHTML = this.arr_operationsDoneSoFar.join('');
        },

        clear: function() {
            this.arr_operationsDoneSoFar = this.getUnresolvedArray();
            this.n_unusedArrIndexes = 10;

            this.el_container.querySelector('#outcome')
                .innerHTML = this.arr_operationsDoneSoFar.join('');
        }
    };

    calculator.init();
})();
