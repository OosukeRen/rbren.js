Example for extension:

```
    const Base = new Table({
    name: "base",
    fields: {
        id:         { type: "INTEGER", primary_key: true, autoincrement: true },
        created_at: { type: "TEXT", not_null: true,  default: "CURRENT_TIMESTAMP" },
        updated_at: { type: "TEXT", not_null: true,  default: "CURRENT_TIMESTAMP" },
        active:     { type: "NUMERIC", not_null: true, default: 1 },
    },
    });

    const Users = Base.extend({
    name: "users",
    fields: {
        username: { type: "TEXT", not_null: true, unique: true },
        email:    { type: "TEXT", not_null: true, unique: true },
    },
    primaryKeys: ["id"], // or override/inherit as needed
    });
```

Example to check for inheritance:

```
    Users.isChildOf(Base)
```