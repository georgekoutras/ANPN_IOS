import React from 'react';
import { Switch } from 'react-native';

export default function (props) {
    const [state, setState] = React.useState({
        value: props.value
    });

    React.useEffect(() => {
        setState({value: props.value});
    }, [props.value]);

    const _onValueChange = (value) => {
        setState({value: value});
        props.onValueChange(value);
    }

    return (
        <Switch
            style={props.style}
            value={state.value}
            onValueChange={_onValueChange}
        />
    );
}