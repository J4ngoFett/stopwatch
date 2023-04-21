import { formatMilliseconds } from "./divideWithMilliseconds";
import { renderCycle } from "./renderCycle";
import { Stopwatch } from "./stopwatch";
import { StopwatchStatus } from "./stopwatchStatus";

export class StopwatchUI {
    readonly #stopWatch: Stopwatch;
    readonly #displayElement: HTMLElement;
    readonly #actionsElement: HTMLElement;
    readonly #historyElement: HTMLElement;
    readonly #buttons: Map<string, HTMLButtonElement>;
    #stopCycle: (() => void) | null = null;
    readonly #onClick = (event: MouseEvent) => {
        const button = (event.target as HTMLElement).closest('button');
        if (button) {
            switch (button.name) {
                case 'start':
                    return this.#onStart();

                case 'stop':
                    return this.#onStop();
                case 'reset':
                    return this.#onReset();
                case 'save':
                    return this.#onSave();

            }
        }
    };

    constructor(
        stopWatch: Stopwatch,
        displayElement: HTMLElement,
        actionsElement: HTMLElement,
        historyElement: HTMLElement,
    ) {
        this.#stopWatch = stopWatch;
        this.#displayElement = displayElement;
        this.#actionsElement = actionsElement;
        this.#historyElement = historyElement;

        this.#buttons = new Map();

        for (const buttonElement of actionsElement.querySelectorAll('button')) {
            this.#buttons.set(buttonElement.name, buttonElement);
        }
    }

    init(): void {
        this.#updateDisplay();
        this.#updateButtons();
        this.#actionsElement.addEventListener('click', this.#onClick);
    }

    destroy(): void {
        this.#actionsElement.removeEventListener('click', this.#onClick);
    }

    #updateDisplay(): void {
        this.#displayElement.textContent = formatMilliseconds(this.#stopWatch.getTime());
    }

    #onStart(): void {
        this.#stopCycle = renderCycle(() => {
            this.#updateDisplay();
        });
        this.#stopWatch.start();
        this.#updateDisplay();
        this.#updateButtons();

    }

    #onStop(): void {
        this.#stopCycle?.();
        this.#stopWatch.stop();
        this.#updateDisplay();
        this.#updateButtons();
    }

    #onReset(): void {
        this.#stopWatch.reset();

        if (this.#stopWatch.status !== StopwatchStatus.RUNNING) {
            this.#updateDisplay()
            
        }
        this.#updateButtons();
        this.#updateHistory();
    }

    #onSave(): void {
        this.#stopWatch.save();
        this.#updateHistory();
    }

    #updateButtons(): void {
        switch (this.#stopWatch.status) {
            case StopwatchStatus.IDLE:
                this.#toggleButton ('start', true);
                this.#toggleButton ('stop', false);
                this.#toggleButton ('reset', false);
                this.#toggleButton ('save', false);
                return;
            case StopwatchStatus.RUNNING:
                this.#toggleButton ('start', false);
                this.#toggleButton ('stop', true);
                this.#toggleButton ('reset', true);
                this.#toggleButton ('save', true);
                return;
            case StopwatchStatus.STOPPED:
                this.#toggleButton ('start', true);
                this.#toggleButton ('stop', false);
                this.#toggleButton ('reset', true);
                this.#toggleButton ('save', false);
                return;
        }
    }

    #toggleButton(buttonName: string, state: boolean): void {
        const buttonElement = this.#buttons.get(buttonName);

        if (buttonElement) {
            buttonElement.disabled = !state;
        }
    }

    #updateHistory(): void {
        this.#historyElement.innerHTML = '';
        this.#historyElement.appendChild(
            this.#stopWatch.history.reduce(
                (fragment, time) => {
                    const liElement = document.createElement('li');
                    liElement.textContent = formatMilliseconds(time);
                    fragment.appendChild(liElement);
                    return fragment;
                },
                document.createDocumentFragment()
            )
        );
    }

}