import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';

import { AppStyles } from '../styles/styles';


export const Label = (props) => {
    return (
        <Text numberOfLines={props.numberOfLines || 0} style={[AppStyles.label, props.style]}>{props.children}</Text>
    );
}

export const Button = (props) => {
    var btn = (<Text style={[{ color: '#fff' }, props.textStyle]}>{props.title}</Text>); //assume text button

    if (props.image) {
        var widthStyle = (props.width) ? { width: props.width, resizeMode: 'contain' } : {};
        var heightStyle = (props.height) ? { height: props.height, resizeMode: 'contain' } : {};
        btn = (<Image source={props.image} style={[widthStyle, heightStyle]} />);
    }

    return (
        <TouchableOpacity style={[AppStyles.button, props.style]} onPress={props.onPress}>
            {btn}
        </TouchableOpacity>
    );
}

export const Icon = (props) => {
    var widthStyle = (props.width) ? { width: props.width, resizeMode: 'contain' } : {};
    var heightStyle = (props.height) ? { height: props.height, resizeMode: 'contain' } : {};

    return (
        <TouchableOpacity style={[AppStyles.icon, props.style]} onPress={props.onPress}>
            <Image source={props.image} style={[widthStyle, heightStyle]} />
        </TouchableOpacity>
    );
}

export const Loader = (props) => {
    return (
        props.animating &&
        <View style={{
                position: 'absolute', top: '25%',
                alignSelf: 'center',
                width: 50, height: 50, borderRadius: 25,
                backgroundColor: '#fff',
                borderWidth: 2, borderColor: '#cde',
                justifyContent: 'center'
            }}
        >
            <ActivityIndicator size="large" color="#62b8bb" animating={props.animating} />  
        </View>
    );
}

/**
export const InputText = (props) => {
    return (
        <TextInput
            style={[AppStyles.input, props.style]}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
        />
    );
}
/**/

export const Popup = (props) => {
    if (props.visible === false) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={props.onClose}
        >
            <TouchableOpacity style={[AppStyles.absoluteFill, AppStyles.cover]} onPress={props.onClose} activeOpacity={0.5} />
            <View
                key='popup-content'
                style={[
                    {
                        position: 'absolute', top: '4%', left: '3%',
                        width: '94%', height: '92%',
                        backgroundColor: '#f3f3f3',
                        borderRadius: 12,
                        borderWidth: 2, borderColor: '#444',
                        overflow: 'hidden'
                    },
                    props.style
                ]}
            >
                {
                    props.header &&
                    <Text style={AppStyles.popupHeader}>
                        {props.header}
                    </Text>
                }

                {/* VirtualizedLists should never be nested inside plain ScrollViews with the same orientation */}
                {!props.isList &&
                    <ScrollView style={{ padding: 8 }}>
                        {props.children}
                    </ScrollView>
                }
                {props.isList &&
                    <View style={{ padding: 8 }}>
                        {props.children}
                    </View>
                }

                {
                    props.header &&
                    <Icon
                        image={require('../assets/icons/close-white.png')}
                        width={16}
                        style={{ margin: 0, position: 'absolute', top: -10, right: 0 }}
                        onPress={props.onClose}
                    />
                }

            </View>

        </Modal>
    );
}
