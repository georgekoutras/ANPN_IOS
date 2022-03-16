import React from 'react';
import { View, Text, FlatList, SectionList } from 'react-native';
//import { Picker } from '@react-native-picker/picker';

import { AppStyles } from '../styles/styles';
import { Button, Icon, Label } from './common';
import Select from './select';

const ListFooter = (props) => {
    var _loadPage = (page) => {
        props.loadPage(page);
    }

    var opts = props.opts;

    var _pages = [];
    for (var i = 1; i <= opts.totalPages; i++) {
        //_pages.push((<Picker.Item label={i + ""} value={i} key={i} />));
        _pages.push({ label: i + "", value: i }); //for custom 'Select'
    }

    var resText = ""
        + ((opts.total > 0) ? (opts.page - 1) * opts.limit + 1 : 0) + "-"
        + ((opts.page < opts.totalPages) ? opts.page * opts.limit : opts.total) + "/"
        + (opts.total);

    return (
        <View style={[AppStyles.buttonContainer, { alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 3 }]}>
            <Label style={{ paddingLeft: 2 }}>
                {resText}
            </Label>

            <Button title="<<" onPress={() => {
                _loadPage(1);
            }} />

            <Button title=" < " onPress={() => {
                if (opts.page > 1)
                    _loadPage(opts.page - 1);
            }} />

            <View style={{ borderWidth: 1, borderColor: '#ddd' }}>
                <Select
                    style={{ width: 70 }}
                    selectedValue={opts.page}
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue > 0)
                            _loadPage(itemValue);
                    }}
                    items={_pages}
                />
            </View>

            <Button title=" > " onPress={() => {
                if (opts.page < opts.totalPages)
                    _loadPage(opts.page + 1);
            }} />

            <Button title=">>" onPress={() => {
                _loadPage(opts.totalPages);
            }} />
        </View>
    );
}

export default function (props) {
    let opts = props.opts;
    opts.itemHeight = opts.itemHeight || 25; //default

    return (
        <>
            {props.sections && (
                <SectionList
                    sections={props.sections}
                    renderItem={props.renderItem}
                    renderSectionHeader={props.renderSectionHeader}
                    getItemLayout={(data, index) => ({ length: opts.itemHeight, offset: opts.itemHeight * index, index })} //boosts performance

                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => props.header}
                    ListFooterComponent={() => <ListFooter opts={opts} loadPage={props.loadPage} />}

                    keyboardShouldPersistTaps="handled"
                />
            )}

            {props.data && (
                <FlatList
                    data={props.data}
                    renderItem={props.renderItem}
                    getItemLayout={(data, index) => ({ length: opts.itemHeight, offset: opts.itemHeight * index, index })} //boosts performance

                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => props.header}
                    ListFooterComponent={() => <ListFooter opts={opts} loadPage={props.loadPage} />}

                    keyboardShouldPersistTaps="handled"
                />
            )}
        </>
    );
}