import * as React from 'react';
import * as ReactDOM from 'react-dom';
import wasm from './hello.go';

const { add } = wasm;

interface State {
    value: number
    result: string
}

class HelloMessage extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            value: 0,
            result: ''
        };
    }

    async updateValue(value: number) {
        let result = await add<number, string>(this.state.value, value);
        this.setState({ value, result });
    }

    render() {
        return (
            <div>
                <input type="number" value={this.state.value} onChange={(e) => this.updateValue(parseInt(e.target.value, 10))} />
                <p>Value now is {this.state.result}</p>
            </div>
        );
    }
  }

  ReactDOM.render(React.createElement(HelloMessage), document.getElementById('main'));
