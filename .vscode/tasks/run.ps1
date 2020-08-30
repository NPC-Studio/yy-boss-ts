cd "../../Rust/yy-boss";
cargo build --release;
cd "../../Typescript/yy-boss-ts";
npx ts-node .\src\index.ts;