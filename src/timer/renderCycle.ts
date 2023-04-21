export function renderCycle(cb: () => void): () => void {
    const idRef = {id: 0};
    const render = () => {
        idRef.id = requestAnimationFrame(() => {
            cb();
            render();
        });
    };

    render();

    return () => {
        cancelAnimationFrame(idRef.id);
    };
}