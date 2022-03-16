import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Icon, Label } from './common';
import Utils from '../utils.js'
import Resources from '../resources';

const styles = StyleSheet.create({
    filterRow: {
        ...AppStyles.row,
        height: 40
    },
    filterCol: {
        ...AppStyles.col,
        justifyContent: 'center'
    }
});


//
//per app
//
const FilterIcon = (props) => <Icon image={require('../assets/icons/filter.png')} width={20} height={20} style={{ width: 40, height: 35 }} onPress={props.onPress} />;

export const DateRangeFilterInfo = (props) => {
    const [state, setState] = React.useState({
        popup: null
    });

    const _showFilter = () => {
        var _filter = {...props.filter}; //local copy (?)

        //prepare popup -> for now we always use the same filter (DateRange)
        var _content = (
            <DateRangeFilter type={props.type} filter={_filter} onOK={(filter) => {
                Utils.hidePopup({ state, setState });
                props.filterData(filter);
            }} />
        );

        Utils.showPopup({ state, setState }, Resources("Filter"), _content, AppStyles.dateRangeFilter);
    }

    return (
        <>
            <View style={[AppStyles.row, { paddingLeft: 7, borderBottomWidth: 1, borderBottomColor: '#ddd' }]}>
                <View style={AppStyles.row}>
                    <Label style={{ paddingLeft: 2 }}>{Resources("From")}:</Label>
                    <Text style={{ paddingLeft: 2 }} onPress={_showFilter}>
                        {Utils.formatDate(props.filter["dateFrom"])}
                    </Text>
                </View>

                <View style={AppStyles.row}>
                    <Label style={{ paddingLeft: 2 }}>{Resources("To")}:</Label>
                    <Text style={{ paddingLeft: 2 }} onPress={_showFilter}>
                        {Utils.formatDate(props.filter["dateTo"])}
                    </Text>
                </View>

                <View style={[AppStyles.row, { justifyContent: 'flex-end' }]}>
                    <FilterIcon onPress={_showFilter} />
                    {props.extraButtons}
                </View>
            </View>

            {state.popup}
        </>
    );
}

export const DateRangeFilter = (props) => {
    const [state, setState] = React.useState({
        datePicker: null,
        filter: {
            ...props.filter
        }
    });

    const _filterProp = (prop) => {
        return state.filter[prop];
    }

    const _showDatePickerFrom = () => {
        Utils.showDatePicker({ setState }, _filterProp("dateFrom") || new Date(), _setDateFrom);
    }
    const _setDateFrom = (date) => {
        setState(prevState => ({
            datePicker: null,
            filter: {
                ...prevState.filter,
                dateFrom: date
            }
        }))
    }
    const _clearDateFrom = () => {
        _setDateFrom(null);
    }

    const _showDatePickerTo = () => {
        Utils.showDatePicker({ setState }, _filterProp("dateTo") || new Date(), _setDateTo);
    }
    const _setDateTo = (date) => {
        setState(prevState => ({
            datePicker: null,
            filter: {
                ...prevState.filter,
                dateTo: date
            }
        }))
    }
    const _clearDateTo = () => {
        _setDateTo(null);
    }

    const _onOK = () => {
        var type = props.type || "filter";

        //store values
        ["dateFrom", "dateTo"].forEach(item => {
            var date = _filterProp(item);
            if (date)
                Utils.storeItem(type + "-" + item, date.toISOString());
            else
                Utils.clearItem(type + "-" + item);
        });

        props.onOK(state.filter);
    }

    return (
        <>
            <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                    <Label>{Resources("From")}:</Label>
                </View>
                <View style={[styles.filterCol, { flex: 2 }]}>
                    <Text>{Utils.formatDate(state.filter.dateFrom)}</Text>
                </View>
                <View style={AppStyles.row}>
                    <View style={[styles.filterCol, { alignItems: "flex-start" }]}>
                        <Icon image={require('../assets/icons/calendar.png')} width={24} onPress={_showDatePickerFrom} />
                    </View>
                    {
                        _filterProp("dateFrom") &&
                        <View style={styles.filterCol}>
                            <Icon image={require('../assets/icons/close-grey.png')} width={16} onPress={_clearDateFrom} />
                        </View>
                    }
                </View>
            </View>
            <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                    <Label>{Resources("To")}:</Label>
                </View>
                <View style={[styles.filterCol, { flex: 2 }]}>
                    <Text>{Utils.formatDate(state.filter.dateTo)}</Text>
                </View>
                <View style={AppStyles.row}>
                    <View style={[styles.filterCol, { alignItems: "flex-start" }]}>
                        <Icon image={require('../assets/icons/calendar.png')} width={24} onPress={_showDatePickerTo} />
                    </View>
                    {
                        _filterProp("dateTo") &&
                        <View style={styles.filterCol}>
                            <Icon image={require('../assets/icons/close-grey.png')} width={16} onPress={_clearDateTo} />
                        </View>
                    }
                </View>
            </View>

            <View style={AppStyles.buttonContainer}>
                <Button title={Resources("Apply")} style={{ flex: 0.5 }} onPress={_onOK} />
            </View>

            {state.datePicker}
        </>
    );
}

export default DateRangeFilter;