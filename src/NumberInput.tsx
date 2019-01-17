import * as React from 'react';

export interface NumberInputProps {
    value: number
    onChange: (value: number) => void
}

const NumberInput : React.SFC<NumberInputProps> = ({ value, onChange }) => (
    <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} />
);

export default NumberInput;