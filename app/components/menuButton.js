import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { AppStyles } from '../styles/styles';

const styles = StyleSheet.create({
    menuBtn: {
        width: 150,
        height: 120,
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1, borderColor: '#ddd',
        borderRadius: 7,
        alignItems: 'center'
    },
    menuFont: {
        fontSize: 15,
        //fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default (props) => {
    let _style = props.disabled ? { ...AppStyles.disabled } : {};
    return (
        <TouchableOpacity style={[styles.menuBtn, props.style, _style]} onPress={props.onPress} disabled={props.disabled ?? false}>
            {props.icon && <Image source={props.icon} style={{ width: 42, height: 42, resizeMode: 'contain' }} />}
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{...AppStyles.text, ...styles.menuFont, marginTop: 10}}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}