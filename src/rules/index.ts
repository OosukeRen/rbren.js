import errors from "../consts/ERRORS";
// import { Table } from "../orm/index";
// import { FieldDefinition } from "../orm/Field";

export {}; // make this a module



declare type When = {
    CREATE?: boolean;
    READ?: boolean;
    UPDATE?: boolean;
    DELETE?: boolean;
};

// Row type derived from the table's Fields
type RowOf<F extends Record<string, FieldDefinition>> = ComplexDBObject<F>;

type RuleExecution = <Fields extends Record<string, FieldDefinition>> (record: RowOf<Fields>, previous: RowOf<Fields> ) => Promise<void>;
declare type RuleCondition = (record: any, previous: any) => Promise<boolean>;

declare type RuleConstructor<Fields extends Record<string, FieldDefinition>> = {
    name: string;
    table: Table<Fields>;
    condition: RuleCondition;
    when: When;
    active?: boolean;
}

class BaseRuleError extends Error {
  cause?: unknown;
  constructor(_rule: DBRule<any>, message: string, cause?: unknown) {
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

const RuleError = (rule: DBRule<any>, message: string, cause?: unknown) => {
    throw new BaseRuleError(rule, message, cause);
};

const RuleErrorWrapper = (_rule: DBRule<any>) =>  {
    return `\tRule Name: ${_rule.name}\n`;
}

let log = globalThis.Log || console.log;

class DBRule <Fields extends Record<string, FieldDefinition>>{
    name: string;
    table: Table<Fields>;
    condition: RuleCondition;
    priority: number;
    #execute: RuleExecution<Fields>;
    #condition: RuleCondition;
    active: boolean;
    execute: RuleExecution<Fields>;

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

    constructor(constr: RuleConstructor<Fields>) {
        let {name, table, condition, when, active = true} = constr;
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
        this.active = active;
        
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

declare global {
  var Rule: typeof DBRule;

  function Log(property: any): void;
}

// Install globally at runtime
(globalThis as any).Rule = DBRule;