export function divideWithRest(a: number, b: number): [number, number] {
    return [Math.trunc(a / b), a % b];
}