import * as React from 'react';
import wasm from './hello.go';
import NumberInput from './NumberInput';

const { add } = wasm;

interface State {
    value: number[]
    result: string
}

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            value: [0, 0],
            result: '0'
        };
    }

    async updateValue(index: number, value: number) {
        let newValues = this.state.value.slice();
        newValues[index] = value
        let result = await add<number, string>(...newValues);
        this.setState({ value: newValues, result });
    }

    render() {
        return (
            <div>
                <p>Enter a number in the box below, on change it will add all the numbers together. Click the button to add more input boxes.</p>
                {this.state.value.map((value, index) =>
                    <NumberInput value={value} onChange={i => this.updateValue(index, i)} />
                )}
                <button type="button" onClick={() => this.setState({ value: [...this.state.value, 0]})}>More inputs!</button>
                <p>Value now is {this.state.result}</p>
            </div>
        );
    }
  }

export default App;