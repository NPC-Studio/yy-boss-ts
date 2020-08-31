# YY-BOSS-TS

This is a Typescript native binding for the Yy-Boss Json Api. It is in early stages of development, but will be complete, as much as the YyBoss is, in the foreseeable future.

The **YyBoss** is an executable which is capable of making changes to a given Gms2, 2.3, project. It takes Json commands over stdin. It is, itself, written in Rust, and can also be used as a library for other Rust projects.

This project, **YyBossTs**, provides an interface to abstract the exe into a simple async library. Calls to the YyBoss look similar to the following:

```ts
async function main() {
    const yyp_boss = await create_yy_boss();

    assert(yyp_boss.hasClosed == false, 'huh');

    await yyp_boss.writeCommand(new CreateFolderVfs('folders/Test.yy', 'Test2'));
    await yyp_boss.writeCommand(new SerializationCommand());
    await yyp_boss.shutdown();

    assert(yyp_boss.hasClosed, 'should be closed..');
}
```

More details on the YyBoss project generally can be found here, at [https://github.com/NPC-Studio/yy-boss](the YyBoss Github page).

## License

This project is dual licensed under both the MIT and Apache license.
