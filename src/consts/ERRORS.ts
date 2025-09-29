const MandatoryProperty = (property: string, target: string) => {
    return `Field [${property}] is mandatory ${target ? "for " + target : ""}!`;
}


const MPR = (property: string)  => {
    return MandatoryProperty(property, "rules");
};


export default {
    RULES: {
        CONDITION: {
            MISSING: MPR("condition"),
        },
        NAME: {
            MISSING: MPR("name"),
        },
        PRIORITY: {
            MISSING: MPR("priority"),
        },
        TABLE: {
            MISSING: MPR("table"),
        },
        WHEN: {
            MISSING: MPR("when")
        },
        EXECUTE: {
            DEBUG: MPR
        }
    }
}