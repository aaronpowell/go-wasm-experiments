import wasm from './hello.go';

const { add } = wasm;

class HelloMessage extends React.Component {
    constructor() {
        super();

        this.state = {
            value: 0,
            added: ''
        };
    }

    async updateValue(value) {
        let added = await add(1, value);
        this.setState({ value, added });
    }

    render() {
      return React.createElement(
        "div",
        null,
        React.createElement('input', { type: 'number', value: this.state.value, onChange: (e) => this.updateValue(e.target.value) }),
        React.createElement('p', null, `Added 1 is ${this.state.added}`)
      );
    }
  }

  ReactDOM.render(React.createElement(HelloMessage), document.getElementById('main'));
