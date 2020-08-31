cd "../../Rust/yy-boss";
cargo build --release;
cd "../../Typescript/yy-boss-ts";
npx tsc;
node build/index.js