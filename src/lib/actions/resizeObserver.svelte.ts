import type { Action } from 'svelte/action';

interface Attributes {
    'onelementresize': (event: CustomEvent<{ width: number, height: number; }>) => void;
}

export const resizeObserver: Action<HTMLElement, undefined, Attributes> = (node: HTMLElement) => {
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            node.dispatchEvent(
                new CustomEvent('resize', {
                    detail: {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    },
                })
            );
        }
    });

    observer.observe(node);

    return {
        destroy() {
            observer.unobserve(node);
        },
    };
}