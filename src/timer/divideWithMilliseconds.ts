import { divideWithRest } from "./divideWIthRest";

export function formatMilliseconds(msValue: number): string {
    const [allSeconds, ms] = divideWithRest(msValue, 1_000);
    const [allMinutes, seconds] = divideWithRest(allSeconds, 60);
    const [hours, minutes] = divideWithRest(allMinutes, 60);

    return `${hours.toString().padStart(2, '0')
        }:${minutes.toString().padStart(2, '0')
        }:${seconds.toString().padStart(2, '0')
        }:${ms.toString().padStart(3, '0')}`;
}