import wasm from './hello.go';

const { add } = wasm;

add(1, 2).then(result => console.log(result));
