import { getContext, hasContext, setContext } from "svelte";


type ContextCurrentValue<TValue> = { current: TValue };

export class CustomContext<T> {

    readonly #key: symbol;

    constructor(name: string) {
        this.#key = Symbol(name);
    }

    exists(): boolean {
        return hasContext(this.#key);
    }

    get(): ContextCurrentValue<T> {
        return getContext(this.#key);
    }

    init(value: T): ContextCurrentValue<T> {
        const _value = $state({ current: value });
        return setContext(this.#key, _value);
    }
}