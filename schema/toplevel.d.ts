/**
 * Toplevel<T> describes the root module of an application.
 *
 * It defines:
 *  - the main prompt
 *  - the target language for code generation
 *  - the module dependency graph
 *  - optional skeleton/template
 *  - optional output filename
 */
export type Toplevel<T extends {
    /** High‑level natural‑language instruction for the entire application */
    prompt: string;

    /** Root‑level module dependencies */
    modules: import("./prompt-module").PromptModule<any>[];

    /** Output language (e.g., "ts", "html", "python") */
    targetLanguage: string;

    /** Optional code skeleton/template */
    skeleton?: string;

    /** Optional output filename hint */
    targetFilename?: string;
}> = T;
