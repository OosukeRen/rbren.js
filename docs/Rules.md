

execute
    the keyword <b>this<b> will have access to the current Rule.

```
    TestUserForName.execute = async function() {
    // console.log("Gosho");
    console.log(this);
    }

```

And the output is:

```
    Rule {
        name: 'TestUserForName',
        table: 'user',
        condition: [Getter/Setter],
        priority: undefined,
        active: true,
        when: { CREATE: true, DELETE: true },
        description: undefined
    }
```

Error logging:

    execute() and condition()

    are protected in internal try{} catch() logic inside of the rule class, with custom logging logic
    For now you're not able to turn off the try catch logic, but it's performance overhead is if you ACTUALLY have exceptions being thrown, otherwise you wouldn't see any difference.
    on the other hand you can customize where or how errors are being logged with this function in your main file before your import of the library.

    ```
        globalThis.Log = console.log;
    ```