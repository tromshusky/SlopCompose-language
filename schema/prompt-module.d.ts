/**
 * Core module type describing a prompt‑generated AI component.
 *
 * A PromptModule<T> is a structured description of:
 *  - what the module should do (prompt)
 *  - what API surface it exposes (api)
 *  - what types it contributes (types)
 *  - what other modules it composes with (modules)
 */
export type PromptModule<T extends {
    /** Natural‑language instruction describing what this module should implement */
    prompt: string;

    /** Public API surface of the module (string signatures or structured types) */
    api: Record<string, any>;

    /** Type definitions contributed by this module */
    types?: Record<string, any>;

    /** Graph‑style dependencies: other modules this module composes with */
    modules?: PromptModule<any>[];
}> = T;
