import {Table} from "./dist/index.js";
// import { testImport } from "./importTest.js";
// globalThis.Log = console.log;

// let TestUserForName = new Rule(
// {
//     name:       "TestUserForName",
//     table:      "user",
//     priority:    10,
//     condition:   async function() {
//         return true;
//     },
//     when: {
//         CREATE: true,
//         DELETE: true
//     }
// });

// TestUserForName.execute = async function() {
//     // console.log("Gosho");
//     console.log(this);
//     /**
//      * Will log:
//      * 
//      * Rule {
//         name: 'TestUserForName',
//         table: 'user',
//         condition: [Getter/Setter],
//         priority: undefined,
//         active: true,
//         when: { CREATE: true, DELETE: true },
//         description: undefined
//         }
//      */
// }

// if(await TestUserForName.condition()) {
//     await TestUserForName.execute({}, {});
// }

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

console.log(Users.isChildOf(Base));