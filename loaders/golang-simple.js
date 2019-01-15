const { readFileSync } = require('fs');
const { join } = require('path');

const wasmExec = readFileSync(join(__dirname, '..', 'loaders', 'wasm_exec.js'));

const proxyBuilder = `
let ready = false;

async function init() {
    const go = new Go();
    let result = await WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject);
    go.run(result.instance);
    ready = true;
}

function sleep() {
  return new Promise(requestAnimationFrame);
}

init();

let proxy = new Proxy(
  {},
  {
    get: (_, key) => {
      return (...args) => {
        return new Promise(async (resolve, reject) => {
          let run = () => {
            let handler = {
              cb: (err, ...msg) => (err ? reject(err) : resolve(...msg))
            };
            window[key].apply(undefined, [...args, handler]);
          };

          while (!ready) {
            await sleep();
          }
          run();
        });
      };
    }
  }
);
  
export default proxy;
  `;

module.exports = function loader(source) {
    return wasmExec + proxyBuilder;
};
