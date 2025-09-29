import errors from "./consts/ERRORS";

export {}; // make this a module

declare global {
  class Rule {
    name: string;
    table: string;
    condition: RuleFunction;
    priority: number;
    when: When;
    description: string;

    constructor(constr: RuleConstructor);
  }

  function Log(property: any): void;
}

declare type When = {
    CREATE?: boolean;
    READ?: boolean;
    UPDATE?: boolean;
    DELETE?: boolean;
};

declare type RuleFunction = (record: any, previous: any) => Promise<boolean>;

declare type RuleConstructor = {
    name: string;
    table: string;
    condition: RuleFunction;
    when: When;
}

class BaseRuleError extends Error {
  cause?: unknown;
  constructor(_rule: Rule, message: string, cause?: unknown) {
    message = `${RuleErrorWrapper(_rule)}${message}`
    super(message);


    // this.name = "RuleError";
    this.cause = cause;

    Object.setPrototypeOf(this, Error.prototype);
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, new.target);
    }
  }
}

const RuleError = (rule: Rule, message: string, cause?: unknown) => {
    throw new BaseRuleError(rule, message, cause);
};

const RuleErrorWrapper = (_rule: Rule) =>  {
    return `\tRule Name: ${_rule.name}\n`;
}

let log = globalThis.Log || console.log;

class Rule {
    name: string;
    table: string;
    condition: RuleFunction;
    priority: number;
    #execute: RuleFunction;
    when: When;
    description: string;

    constructor(constr: RuleConstructor) {
        let {name, table, condition, when} = constr;
        if(!name) {
            RuleError(this, errors.RULES.NAME.MISSING);
        }
        
        this.name = name;

        if(!condition) {
            RuleError(this, errors.RULES.CONDITION.MISSING);
        }

        if(!table) {
            RuleError(this, errors.RULES.TABLE.MISSING);
        }

        if(!when) {
            RuleError(this, errors.RULES.WHEN.MISSING);
        }

        this.when = when;
        this.condition = condition;
        this.table = table;

        Object.defineProperty(this, "execute", {
            set(_execute) {
                this.#execute = _execute;
            },
            get() {
                return async function (record: any, previous: any) {
                    try {
                        await this.#execute(record, previous);
                    } catch(e) {
                        log(e);
                    }
                }
            }
        })
    }


}

// Install globally at runtime
(globalThis as any).Rule = Rule;