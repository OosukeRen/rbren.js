//Field.ts

import { Table } from "./table";

type referenceOptionalFields = {
    /** Action to take when referenced row is deleted */
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    /** Action to take when referenced row is updated */
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    /** Whether the constraint check can be deferred */
    deferrable?: boolean;
}

/**
 * Base field definition containing common SQL column properties.
 */
export type BaseFieldDefinition = {
    /**
     * Field Name for inside the CMS platform, if necessary 
     */
    label: string;

    /**
     * Internal field name for the database
     */
    name: string;
    /**
     * Marks the field as a primary key.
     */
    primary_key?: boolean;

    /**
     * If true, the field value will automatically increment with each new entry.
     * Only applicable for numeric fields.
     */
    autoincrement?: boolean;

    /**
     * Ensures the field has unique values across rows.
     */
    unique?: boolean;

    /**
     * Ensures the field cannot be null.
     */
    not_null?: boolean;

    /**
     * Default value assigned to the field if no value is provided.
     */
    default?: any;

    /**
     * SQL `CHECK` constraint as a raw string expression.
     * Example: `"age > 0"`
     */
    check?: string;

    /**
     * If true, creates an index on the field.
     */
    index?: boolean;

    /**
     * Foreign key reference configuration for this field.
     */
    references?: {
        /**
         * The table being referenced.
         */
        table: Table<any>;

        /**
         * The specific column in the referenced table.
         */
        field: string;

        /**
         * Defines behavior when the referenced row is deleted.
         */
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';

        /**
         * Defines behavior when the referenced row is updated.
         */
        onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';

        /**
         * If true, makes the foreign key constraint deferrable.
         */
        deferrable?: boolean;
    };
};

/**
 * Field definition for TEXT columns.
 */
export type StringFieldMeta = {
    type: "TEXT";
    requirements?: {
        /**
         * Minimum character length required.
         */
        min?: number;

        /**
         * Maximum character length allowed.
         */
        max?: number;

        /**
         * A list of characters that are forbidden in the string.
         */
        forbiddenSymbols?: string[];

        /**
         * A list of characters that must be present in the string.
         */
        requiredSymbols?: string[];

        /**
         * If true, the field must be provided (non-null and non-empty).
         */
        required?: boolean;

        /**
         * Custom validator function for the value. It gets run upon assignment, if it returns false, the code will throw an error.
         */
        validator?: (value: any) => boolean;
    };

    /**
     * Formats the value upon assignment
     */
    formatter?: (value: string) => string;
} & BaseFieldDefinition;

/**
 * Field definition for INTEGER columns.
 */
export type IntegerFieldMeta = {
    type: "INTEGER";
    requirements?: {
        /**
         * Minimum value allowed.
         */
        min?: number;

        /**
         * Maximum value allowed.
         */
        max?: number;

        /**
         * If true, the field must be provided (non-null).
         */
        required?: boolean;

        /**
         * Custom validator function for the value. It gets run upon assignment, if it returns false, the code will throw an error.
         */
        validator?: (value: any) => boolean;
    };
} & BaseFieldDefinition;

/**
 * Field definition for REAL (floating-point) columns.
 */
export type RealFieldMeta = {
    type: "REAL";
    requirements?: {
        /**
         * Minimum value allowed.
         */
        min?: number;

        /**
         * Maximum value allowed.
         */
        max?: number;

        /**
         * Number of decimal places allowed.
         */
        precision?: number;

        /**
         * If true, the field must be provided (non-null).
         */
        required?: boolean;

        /**
         * Custom validator function for the value. It gets run upon assignment, if it returns false, the code will throw an error.
         */
        validator?: (value: any) => boolean;
    };
} & BaseFieldDefinition;

/**
 * Field definition for BLOB (binary large object) columns.
 */
export type BlobFieldMeta = {
    type: "BLOB";
    requirements?: {
        /**
         * Maximum size in bytes.
         */
        maxSize?: number;

        /**
         * If true, the field must be provided (non-null).
         */
        required?: boolean;

        /**
         * Custom validator function for the value. It gets run upon assignment, if it returns false, the code will throw an error.
         */
        validator?: (value: any) => boolean;
    };
} & BaseFieldDefinition;

/**
 * Field definition for NUMERIC (precise number) columns.
 */
export type NumericFieldMeta = {
    type: "NUMERIC";
    requirements?: {
        /**
         * Minimum value allowed.
         */
        min?: number;

        /**
         * Maximum value allowed.
         */
        max?: number;

        /**
         * Number of decimal places allowed.
         */
        precision?: number;

        /**
         * If true, the field must be provided (non-null).
         */
        required?: boolean;

        /**
         * Custom validator function for the value. It gets run upon assignment, if it returns false, the code will throw an error.
         */
        validator?: (value: any) => boolean;
    };
} & BaseFieldDefinition;

/**
 * A union type that defines any supported SQL field type.
 */
export type FieldDefinition =
    | StringFieldMeta
    | IntegerFieldMeta
    | RealFieldMeta
    | BlobFieldMeta
    | NumericFieldMeta;
