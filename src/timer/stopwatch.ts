import { isDefined } from "./isdefined";
import { StopwatchStatus } from "./stopwatchStatus";

export class Stopwatch {
    #startTime: number | null = null;
    #stopTime: number | null = null;

    history: number[] = [];

    get status(): StopwatchStatus {
        if (isDefined(this.#startTime) && isDefined(this.#stopTime)) {
            return StopwatchStatus.STOPPED;
        } else if (isDefined(this.#startTime)) {
            return StopwatchStatus.RUNNING
        } else {
            return StopwatchStatus.IDLE;
        }
    }

    start(): void {
        this.#startTime = Date.now();
        this.#stopTime = null;
    }

    stop(): void {
        this.#stopTime = Date.now();
    }

    reset(): void {
        if (this.status === StopwatchStatus.RUNNING) {
            this.#startTime = Date.now();
        } else if (this.status === StopwatchStatus.STOPPED) {
            this.#startTime = null;
            this.#stopTime = null;
        }
        this.history = [];
    }

    save(): void {
        this.history.push(this.getTime());
    }

    getTime(): number {
        if (!isDefined(this.#startTime)) {
            return 0;
        }

        const currentTime = isDefined(this.#stopTime)
            ? this.#stopTime
            : Date.now();

        return currentTime - this.#startTime;
    }
}



