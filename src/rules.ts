import errors from "./consts/ERRORS";

export {}; // make this a module

declare global {
  class Rule {
    name: string;
    table: string;
    condition: Function;
    priority: number;
    execute: Function;

    constructor(args: {
      name: string;
      table: string;
      condition: Function;
      priority?: number;
    });
  }
}

class Rule {
    name: string;
    table: string;
    condition: Function;
    priority: number;
    execute: Function;

    constructor({name, table, condition, priority}) {
        if(!condition) {
            throw new Error(errors.RULES.CONDITION.MISSING);
        }
    }
}

// Install globally at runtime
(globalThis as any).Rule = Rule;