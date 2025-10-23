import { FieldDefinition } from "./field";

interface TableCreationData {
    /**
     * Internal Name for the table in the database
     */
    name: string;

    /**
     * A list of all 
     */
    fields: FieldDefinition[]

    /** Whether the table is temporary (exists only for current session) */
    temporary?: boolean;
    /** Whether to create table WITHOUT ROWID (for optimization in some cases) */
    withoutRowid?: boolean;
    /** Array of primary key column names (for composite primary keys) */
    primaryKeys?: string[];
    /** Optional function to generate custom IDs for records */
    idProvider?: (record: object) => string;
}

const mergeFields = (oldFields: FieldDefinition[], newFields: FieldDefinition[]) => {
  // keep base order for non-overridden fields, use new order for overrides/additions
  const newNames = new Set(newFields.map(field => field.name));
  const keptBase = oldFields.filter(field => !newNames.has(field.name));
  return [...keptBase, ...newFields];
};

const mergeInit = (
  base: TableCreationData,
  patch: Partial<TableCreationData>
): TableCreationData => ({
  ...base,
  ...patch,
  // ensure fields are merged with overwrite semantics
  fields: patch.fields ? mergeFields(base.fields, patch.fields) : base.fields
});


export const Table = (initData: TableCreationData) => {
    const internalState = {};

    return {
        create: () => {
            console.log("TO DO", this);
        },
        
        read: () => {
            console.log("TO DO", this);
        },

        update: () => {
            console.log("TO DO", this);
        },
        
        delete: () => {
            console.log("TO DO", this);
        },

        extend: (newInitData: TableCreationData) => {
            let mergedData = mergeInit(initData, newInitData);
            return Table(mergedData);
        }
    }
};