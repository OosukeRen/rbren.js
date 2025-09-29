import errors from "./consts/ERRORS";

export {}; // make this a module

declare global {
  class Rule {
    name: string;
    table: string;
    condition: RuleCondition;
    priority: number;
    when: When;
    description: string;
    execute: RuleExecution;

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

declare type RuleExecution = (record: any, previous: any) => Promise<void>;
declare type RuleCondition = (record: any, previous: any) => Promise<boolean>;


declare type RuleConstructor = {
    name: string;
    table: string;
    condition: RuleCondition;
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
    condition: RuleCondition;
    priority: number;
    #execute: RuleExecution;
    #condition: RuleCondition;
    #memoizedExecute = async function (record: any, previous: any) {
                            try {
                                await this.#execute(record, previous);
                            } catch(e) {
                                log(e);
                            }
                        };

    #memoizedCondition = async function (record: any, previous: any) {
                    try {
                        return await this.#condition(record, previous);
                    } catch(e) {
                        log(e);
                        return false;
                    }
                };
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
        this.table = table;

        Object.defineProperty(this, "condition", {
            set(_condition) {
                this.#condition = _condition;
            },
            get() {
                return this.#memoizedCondition;
            }
        })

        this.#condition = condition;

        Object.defineProperty(this, "execute", {
            set(_execute) {
                this.#execute = _execute;
            },
            get() {
                return this.#memoizedExecute;
            }
        })

        // safe default so calling execute before assignment doesn’t crash
        this.#execute = async (current, previous) => {};
    }
}

// Install globally at runtime
(globalThis as any).Rule = Rule;