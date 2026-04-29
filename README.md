# Prompt‑Composition DSL (Prototype)

A declarative abstraction language for describing software in terms of
**AI‑generated modules**, **typed APIs**, and **composable prompt‑driven components**.
Instead of writing implementation code, you write *what the system should do*,
and the compiler delegates the implementation workload to an AI model.

This repository contains:

- The language specification (`SPEC.md`)
- Example `.d.ts`‑style DSL files
- A prototype parser and linter
- A reference intermediate representation (IR)

The goal of this DSL is to make AI‑assisted software development **structured,
repeatable, and type‑safe**, while keeping the authoring experience declarative
and high‑level.

---

## Key Ideas

### **Declarative AI Modules**
Each module is defined by:
- a natural‑language prompt
- a typed API surface
- optional type contributions
- optional dependencies on other modules

### **Composable Architecture**
Modules form a directed acyclic graph (DAG).  
The compiler resolves dependencies, merges types, and generates code for each module.

### **Typed Contracts**
APIs are expressed as TypeScript type signatures.  
Generated code must conform to these signatures.

### **Target‑Language Agnostic**
The root `Toplevel` definition specifies:
- target language (e.g., `"js"`, `"html"`, `"python"`)
- optional skeleton template
- output filename

### **AI‑Driven Implementation**
The DSL describes *what* should exist.  
The compiler uses AI to generate *how* it is implemented.

---

## Example

```ts
type Utils = PromptModule<{
  prompt: "CLI based backend for a small Hello user!-program";
  api: {
    askName: () => Promise<string>;
    printGreeting: (name: string) => string;
  };
}>;

/**
 * Root application: generates a runnable program in JavaScript.
 */
export type HelloWorldApp = Toplevel<{
  prompt: "Create a simple program that asks for the user's name and prints a greeting.";
  targetLanguage: "js";
  modules: [Utils];
  targetFilename: "hello.js";
}>;
```

```ts
type PromptModule<T extends {
    /** Natural‑language instruction describing what this module should implement */
    prompt: string;

    /** Public API surface of the module (string signatures or structured types) */
    api: Record<string, any>;

    /** Type definitions contributed by this module */
    types?: Record<string, any>;

    /** Graph-style dependencies: other modules this module composes with */
    modules?: PromptModule<any>[];
}> = T;

type Toplevel<T extends {
    prompt: string;
    modules: PromptModule<any>[];
    targetLanguage: string;
    skeleton?: string;
    targetFilename?: string;
}> = T;
```
#### What the generated program might look like
```ts
// hello.js
import { askName, makeGreeting } from "./hello-module.js";

async function main() {
  const name = await askName();
  const greeting = makeGreeting(name);
  console.log(greeting);
}

main();

```
```ts
// utils.js
export async function askName() {
  const name = prompt("What is your name?");
  return name?.trim() || "stranger";
}

export function makeGreeting(name) {
  return `Hello, ${name}`;
}
```
