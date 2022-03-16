import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Icon, Label } from '../components/common';
import { DateRangeFilterInfo } from '../components/dateRangeFilter';
import DataList from '../components/dataList';
import Utils from '../utils.js'
import Resources from '../resources';
import ApiClient from '../apiClient'

const styles = StyleSheet.create({
    headerFont: {
        //fontSize: 13
    },
    rowFont: {
        fontSize: 16,
        marginLeft: 5
    },
    row: {
        backgroundColor: 'white'
    }
});

const MyListHeader = (props) => {
    var opts = props.opts;

    return (
        <View style={AppStyles.row}>
            <View style={AppStyles.col}><Label style={styles.headerFont}>{Resources("Date")}</Label></View>
        </View>
    );
};

const MyListRow = (props) => {
    var item = props.item;
    var opts = props.opts;

    return (
        <TouchableOpacity style={[styles.row, AppStyles.center90, { height: opts.itemHeight }]} onPress={props.onPress}>
            <View style={[AppStyles.row, AppStyles.center90, {padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}]}>
                <Image source={require('../assets/icons/historic-daily.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                <Label style={{ marginLeft: 15 }}>{Resources("Date")}:</Label>
                <Text style={{...styles.rowFont, ...AppStyles.text }}>{item.dateStr}</Text>
                <Label style={{ marginLeft: 15 }}>{Resources("Time")}:</Label>
                <Text style={{...styles.rowFont, ...AppStyles.text }}>{item.timeStr}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default class DailyReportsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                dateFrom: null,
                dateTo: null
            },

            total: 0,
            items: [],
            page: 0,
            totalPages: 0,

            popup: null,
            loader: null
        };

        this.params = this.props.route.params;
        this.patientId = this.params.patientId;
        this.patient = this.params.patient;
    }

    componentDidMount() {
        //load data from server
        this._loadData(1, {});

        //load filter from storage -> if we want to apply the last filter 
        // Utils.loadDateRangeFilter("history", (filterVal) => {
        //     this._filterData(filterVal);
        // });
    }

    _loadData = (page, filter) => {
        Utils.showLoader(this);

        ApiClient.dailyReports(this.patientId, filter.dateFrom, filter.dateTo, page, (data) => {
            var _items = data.rows;

            //group by month-year
            var _groups = Utils.groupBy(_items, "monthYear");

            var _grouped = [];
            for (var key in _groups) {
                _grouped.push({
                    title: key,
                    data: _groups[key]
                });
            }

            this.setState({ total: data.total, items: _grouped, page: page, totalPages: data.totalPages });
        }).finally(() => { Utils.hideLoader(this); });
    }

    _filterData = (filter) => {
        this.setState({ filter: { ...filter } }, () => { this._loadData(1, filter) });
    }

    _gotoReport = (item) => {
        this.props.navigation.push("DailyReport", { patientId: this.patientId, patient: this.patient, reportId: item.id, reportDate: item.date });
    }
    
    render() {
        //only necessary data
        var listOpts = {
            type: "dailyRep",
            total: this.state.total,
            page: this.state.page,
            totalPages: this.state.totalPages,
            limit: ApiClient.pageLimit,
            itemHeight: 50
        };

        //for filter info
        var extraButtons = null;
        var filter = this.state.filter;

        return (
            <SafeAreaView style={AppStyles.container}>
                {this.patient &&
                    <View style={{ ...AppStyles.subHeader, height: 30, justifyContent: 'center' }}>
                        <Text style={AppStyles.subHeaderText}>{this.patient}</Text>
                    </View>
                }

                <DataList
                    sections={this.state.items}
                    renderItem={({ item, index }) => <MyListRow item={item} opts={{ index: index, itemHeight: listOpts.itemHeight }} onPress={() => this._gotoReport(item)}/>}
                    renderSectionHeader={({ section }) => (
                        <View style={AppStyles.center90}>
                            <Text style={AppStyles.listSection}>{section.title}</Text>
                            {/* <MyListHeader opts={{}} /> */}
                        </View>
                    )}

                    //header={<DateRangeFilterInfo type={listOpts.type} filter={filter} filterData={this._filterData} extraButtons={extraButtons} />}
                    header={null} //no filter
                    opts={listOpts}
                    loadPage={(page) => { this._loadData(page, filter) }}
                />

                {this.state.popup}
                {this.state.loader}
            </SafeAreaView>
        );
    }
}