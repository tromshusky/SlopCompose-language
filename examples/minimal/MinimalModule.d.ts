import { PromptModule } from "../../schema/prompt-module";
import { Toplevel } from "../../schema/toplevel";

/**
 * A minimal domain type used by the module.
 */
type Message = { text: string };

/**
 * The smallest possible PromptModule.
 *
 * It has:
 *  - a prompt
 *  - a single API function
 *  - no types
 *  - no submodules
 */
export type MinimalModule = PromptModule<{
    prompt: "Return a friendly greeting message.";
    api: {
        greet: (name: string) => Message;
    };
}>;

/**
 * A minimal Toplevel application using the module.
 *
 * It has:
 *  - a prompt
 *  - a target language
 *  - a single module
 *  - no skeleton
 *  - no filename
 */
export type MinimalApp = Toplevel<{
    prompt: "Create a simple greeting application.";
    targetLanguage: "ts";
    modules: [MinimalModule];
}>;
