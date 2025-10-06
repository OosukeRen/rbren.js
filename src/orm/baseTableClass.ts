import { FieldDefinition } from "./Field";

// helpers (can live near the class)
type MergeSchemas<Schema1 extends object, Schema2 extends object> = Omit<Schema1, keyof Schema2> & Schema2;
type NoOverlap<Schema1, Schema2> = keyof Schema1 & keyof Schema2 extends never ? unknown : ["Duplicate field keys:", keyof Schema1 & keyof Schema2];

export type TableSchema<Fields extends Record<string, FieldDefinition>> = {
    /** The name of the table */
    name: string;
    /** Object defining each field/column in the table */
    fields: Fields;
    /** Whether the table is temporary (exists only for current session) */
    temporary?: boolean;
    /** Whether to create table WITHOUT ROWID (for optimization in some cases) */
    withoutRowid?: boolean;
    /** Array of primary key column names (for composite primary keys) */
    primaryKeys?: string[];
    /** Optional function to generate custom IDs for records */
    idProvider?: (record: object) => string;

    /**
     * a list of all of the extended parents of a table.
     */
    parentList?: string[];
};

export class Table<Fields extends Record<string, FieldDefinition>> {
    /** The name of the table */
    name: string;
    /** Object defining each field/column in the table */
    fields: Fields;
    /** Whether the table is temporary (exists only for current session) */
    temporary?: boolean;
    /** Whether to create table WITHOUT ROWID (for optimization in some cases) */
    withoutRowid?: boolean;
    /** Array of primary key column names (for composite primary keys) */
    primaryKeys?: string[];
    /** Optional function to generate custom IDs for records */
    idProvider?: (record: object) => string;

    #schema: TableSchema<Fields>;
    #parentList: string[] = [];

    constructor (schema: TableSchema<Fields>) {
        const { name, fields, temporary = false, withoutRowid = false, primaryKeys = [], idProvider} = schema;

        if (!name || typeof name !== "string") {
            throw new Error("Table name must be a valid string");
        }

        if (!fields || typeof fields !== "object") {
            throw new Error("Fields must be an object with column names as keys and field definitions as values");
        }

        this.name = name;
        this.fields = fields;
        this.temporary = temporary;
        this.withoutRowid = withoutRowid;
        this.primaryKeys = primaryKeys;
        this.idProvider = idProvider;
        this.#schema = schema;
        
        if(schema.parentList) {
            this.#parentList = schema.parentList;
        }
    }

    /**
     * Create a new Table by extending this one with extra fields/options.
     * - Merges fields (base + extras)
     * - Inherits options unless overridden
     * - (Optional) compile-time guard against duplicate field names
     */
    extend<
        ExtendedFields extends Record<string, FieldDefinition>,
        _Check extends unknown = NoOverlap<Fields, ExtendedFields>
    >(
        childSchema: TableSchema<ExtendedFields>
    ): Table<MergeSchemas<Fields, ExtendedFields>> {
        const mergedFields = { ...this.fields, ...childSchema.fields } as MergeSchemas<Fields, ExtendedFields>;

        return new Table<MergeSchemas<Fields, ExtendedFields>>({
            ...this.#schema,
            name: childSchema.name,                        // must be explicit for the new table
            fields: mergedFields,
            parentList: [...this.#parentList, this.name]
        });
    }

    isChildOf(passedTable: Table<any>): boolean {
        return this.#parentList.includes(passedTable.name);
    }
}
