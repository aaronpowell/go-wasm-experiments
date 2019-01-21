const { readFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { execFile } = require('child_process');

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
            let cb = (err, ...msg) => (err ? reject(err) : resolve(...msg));
            window[key].apply(undefined, [...args, cb]);
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

const getGoBin = root => `${root}/bin/go`;

module.exports = function loader() {
    const cb = this.async();

    let opts = {
        env: {
            GOPATH: process.env.GOPATH,
            GOROOT: process.env.GOROOT,
            GOOS: 'js',
            GOARCH: 'wasm'
        }
    };

    let goBin = getGoBin(opts.env.GOROOT);

    let outFile = '/tmp/build.wasm';

    const args = ['build', '-o', outFile, this.resourcePath];

    let that = this;

    execFile(goBin, args, opts, (_, err) => {
        if (err) {
            cb(err);
            return;
        }

        let out = readFileSync(outFile);
        unlinkSync(outFile);
        that.emitFile('main.wasm', out);

        cb(null, wasmExec + proxyBuilder);
    })
};
