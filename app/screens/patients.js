import React from 'react';
import { SafeAreaView, View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Icon, Label } from '../components/common';
import DataList from '../components/dataList';
import Utils from '../utils.js'
import Resources from '../resources';
import ApiClient from '../apiClient'

const styles = StyleSheet.create({
    headerFont: {
        //fontWeight: 'bold'
        //fontSize: 13
    },
    rowFont: {
        //fontSize: 13
    },
    row: {
        backgroundColor: 'white'
    }
});

const MyListHeader = (props) => {
    const [filter, setFilter] = React.useState(props.filter);
    var opts = props.opts;

    return (
        <>
            <View style={[AppStyles.row, { paddingLeft: 7, borderBottomWidth: 1, borderBottomColor: '#ddd' }]}>
                <View style={[AppStyles.row, { flex: 3 }]}>
                    <Label style={{ paddingLeft: 2 }}>{Resources("Name_AMKA")}:</Label>
                    <TextInput
                        style={[AppStyles.input, {marginLeft: 5, flex: 1}]}
                        onChangeText={(val) => { setFilter(val) }}
                        //value={""}
                        defaultValue={filter}
                        placeholder={Resources("StartTyping")}
                    />
                </View>

                <View style={[AppStyles.row, { justifyContent: 'flex-end' }]}>
                    <Icon image={require('../assets/icons/search.png')} width={18} height={18} style={{ width: 40, height: 35 }} onPress={() => props.filterData({txt: filter})} />
                </View>
            </View>

            <View style={{ marginVertical: 5 }}></View>

            <View style={[AppStyles.row, { marginLeft: 30 }]}>
                <View style={[AppStyles.col, { flex: 3 }]}><Text style={styles.headerFont}>{Resources("Patient")}</Text></View>
                <View style={[AppStyles.col, { flex: 1.6 }]}><Text style={styles.headerFont}>{Resources("AMKA")}</Text></View>
            </View>
        </>
    );
};

const MyListRow = (props) => {
    var item = props.item;
    var opts = props.opts;

    return (
        <TouchableOpacity style={[AppStyles.row, styles.row, { height: opts.itemHeight, paddingHorizontal: 7, marginBottom: 4 }]} onPress={props.onPress}>
            <Image source={require('../assets/icons/patients.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
            <View style={[AppStyles.row, { marginLeft: 5, alignSelf: 'center' }]}>
                <View style={[AppStyles.col, { flex: 3 }]}><Text numberOfLines={1} style={{...styles.rowFont, ...AppStyles.text }}>{item.fullName}</Text></View>
                <View style={[AppStyles.col, { flex: 1.5 }]}><Label style={styles.rowFont}>{item.amka}</Label></View>
            </View>
        </TouchableOpacity>
    );
};

export default class PatientsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                txt: ""
            },

            total: 0,
            items: [],
            page: 0,
            totalPages: 0,

            popup: null,
            loader: null
        };

        this.params = this.props.route.params;
        this.accountId = this.params.accountId;
    }

    componentDidMount() {
        //load data from server
        this._loadData(1, {txt: ""});
    }

    _loadData = (page, filter) => {
        Utils.showLoader(this);

        ApiClient.patients(this.accountId, filter.txt, page, (data) => {
            var _items = data.rows;

            this.setState({ total: data.total, items: _items, page: page, totalPages: data.totalPages });
        }).finally(() => { Utils.hideLoader(this); });
    }

    _filterData = (filter) => {
        this.setState({ filter: { ...filter } }, () => { this._loadData(1, filter) });
    }

    _gotoPatient = (item) => {
        this.props.navigation.push("Patient", {item: item});
    }

    render() {
        //only necessary data
        var listOpts = {
            type: "patient",
            total: this.state.total,
            page: this.state.page,
            totalPages: this.state.totalPages,
            limit: ApiClient.pageLimit,
            itemHeight: 40
        };

        var filter = this.state.filter;

        return (
            <SafeAreaView style={AppStyles.container}>
                <DataList
                    data={this.state.items}
                    renderItem={({ item, index }) => <MyListRow item={item} opts={{ index: index, itemHeight: listOpts.itemHeight }} onPress={() => this._gotoPatient(item)} />}

                    header={<MyListHeader opts={{}} filter={filter.txt} filterData={this._filterData} />}
                    opts={listOpts}
                    loadPage={(page) => { this._loadData(page, filter) }}
                />

                {this.state.popup}
                {this.state.loader}
            </SafeAreaView>
        );
    }
}