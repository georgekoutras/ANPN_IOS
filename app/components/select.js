import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Icon, Label, useConstructor } from './common';
import Utils from '../utils.js'

const itemHeight = 40;

//items must have 'label' and 'value'
const RenderItem = (props) => {
    return (
        <TouchableOpacity style={[AppStyles.row, { height: itemHeight }]} onPress={() => props.onPress(props.item.value, props.index) }>
            <Text style={{ fontSize: 15 }}>{props.item.label}</Text>
        </TouchableOpacity>
    );
}

const ListOfItems = (props) => {
    const itemsRef = React.useRef();

    React.useEffect(() => {
        setTimeout(() => {
            itemsRef.current.scrollToIndex({ animated: false, index: props.selectedIndex, viewOffset: 0, viewPosition: 0 });
        }, 50);
    });

    return (
        <FlatList
            ref={itemsRef}
            data={props.items}
            renderItem={({ item, index }) => <RenderItem item={item} index={index} onPress={props.onPress} />}
            getItemLayout={(data, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
            initialNumToRender={20}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

export default function (props) {
    //find index by value
    var selectedIndex = Utils.indexOf(props.items, "value", props.selectedValue);
    if (selectedIndex == -1)
        selectedIndex = 0;

    const [state, setState] = React.useState({
        popup: null
    });

    const _showItems = () => {
        var _content = (
            <ListOfItems items={props.items} selectedIndex={selectedIndex} onPress={_onPress} />
        );

        Utils.showPopup({ state, setState }, null, _content, {}, {}, true);
    }

    const _onPress = (value, index) => {
        Utils.hidePopup({ state, setState });

        if (index != selectedIndex)
            props.onValueChange(value, index);
    }

    return (
        <>
            <TouchableOpacity style={[AppStyles.row, { ...props.style, paddingLeft: 5 }]} onPress={_showItems}>
                <Text style={{flex: 2}}>{props.selectedValue}</Text>
                <Icon image={require('../assets/icons/caret-down.png')} width={10} height={10} style={{width: 20, height: 20}} onPress={_showItems} />
            </TouchableOpacity>

            {state.popup}
        </>
    );
}