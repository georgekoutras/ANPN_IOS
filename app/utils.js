import React from 'react';
import { Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Popup, Loader } from './components/common';
import Logger from './logger.js'
import Resources from './resources';

//hard-coded prefix: anapneo (though not needed)
const storeKey = (key, user) => {
    return (user === "" ? user : user || global.username) + ':anapneo:' + key;
}

const Utils = {
    //
    //Various
    //
    FHD: () => {
        const { width, height, scale } = Dimensions.get("window");
        return (height > 650); //we assume the HD is 604, so 650 is enough
    },

    iOS: () => {
        return Platform.OS === "ios";
    },

    signOut: (props) => {
        Utils.confirmBox(
            Resources("SignOut"),
            Resources("AreYouSure"),
            () => {
                //new nav: manually set first screen
                props.navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            },
            () => { }
        );
    },

    onBackPress: (props, screen) => {
        //Not used anymore.
        //Needed if popup is not modal, in order to close it.
        if (global.onBackPress) {
            global.onBackPress();
            return true; // Return true to disable back button
        }

        //only for 'screen'
        if (global.currentScreen === screen) {
            Utils.signOut(props);
            return true; // Return true to disable back button
        }

        return false;
    },


    //
    //Dialogs
    //
    confirmBox: (title, message, onOK, onCancel) => {
        Alert.alert(
            title,
            message,
            [
                { text: Resources("BtnCancel"), onPress: onCancel, style: 'cancel' },
                { text: Resources("BtnOK"), onPress: onOK },
            ],
            { cancelable: false }
        );
    },

    alertBox: (message, title, onOK) => {
        Alert.alert(
            (title != null) ? title : Resources("Alert"),
            message,
            [
                { text: Resources("BtnOK"), onPress: onOK },
            ],
            { cancelable: false }
        );
    },


    //
    //Storage -> we use custom prefix: anapneo (though not needed)
    //
    loadItem: (key, user) => {
        return AsyncStorage.getItem(storeKey(key, user));
    },

    storeItem: (key, val, user) => {
        return AsyncStorage.setItem(storeKey(key, user), val);
    },

    clearItem: (key, user) => {
        return AsyncStorage.removeItem(storeKey(key, user));
    },


    //
    //Popup
    //
    showPopup: (obj, header, content, style, stateVals, isList) => {
        var onClose = () => { Utils.hidePopup(obj); };

        //construct it every time
        var _popup = (
            <Popup header={header} onClose={onClose} style={style} isList={isList}>
                {content}
            </Popup>
        );

        //caller must have defined 'popup' property in state
        global.prevPopup = obj.state.popup; //store previous -> Due to iOS issue: one active Modal
        
        stateVals = stateVals || {};
        obj.setState(prevState => ({ ...prevState, ...stateVals, popup: _popup }));
    },

    hidePopup: (obj) => {
        //caller must have defined 'popup' property in state
        obj.setState(prevState => ({ ...prevState, popup: null }));

        //restore previous -> Due to iOS issue: one active Modal
        if (global.prevPopup) {
            obj.setState(prevState => ({ ...prevState, popup: global.prevPopup }));
            global.prevPopup = null;

            //TODO:
            // That way we only store-restore only one previous popup.
            // If we want more, we should use a stack and push and pop.
        }
    },


    //
    //Loader
    //
    showLoader: (obj, stateVals) => {
        //construct it every time
        var _loader = (
            <Loader animating={true} />
        );

        //caller must have defined 'loader' property in state
        stateVals = stateVals || {};
        obj.setState(prevState => ({ ...prevState, ...stateVals, loader: _loader }));
    },

    hideLoader: (obj) => {
        //caller must have defined 'loader' property in state
        obj.setState(prevState => ({ ...prevState, loader: null }));
    },


    //
    //DatePicker
    //
    showDatePicker: (obj, value, onChange, stateVals) => {
        //construct it every time
        var _picker = (
            <DateTimePicker
                value={value}
                mode='date'
                display= {Utils.iOS() ? 'spinner' : 'calendar'} //for Android 'calendar' in order to style it (if eject)
                onChange={(event, value) => {
                    if (value !== undefined)
                        onChange(value);
                    
                    if (!Utils.iOS())
                        Utils.hideDatePicker(obj);
                }}
                //style={{ backgroundColor: "red"}} //optional for ios only (default height is fixed to 216px)
            />
        );

        //caller must have defined 'datePicker' property in state
        stateVals = stateVals || {};
        obj.setState(prevState => ({ ...prevState, ...stateVals, datePicker: _picker }));
    },

    hideDatePicker: (obj) => {
        //caller must have defined 'datePicker' property in state
        obj.setState(prevState => ({ ...prevState, datePicker: null }));
    },

    formatDate: (date, delim) => {
        if (!date)
            return " - ";

        var iso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        var parts = iso.split('T')[0].split('-');

        delim = delim || "/";
        var res = parts[2] + delim + parts[1] + delim + parts[0]; //hard-coded: GR format
        return res;
    },

    formatTime: (date, delim, withSecs) => {
        if (!date)
            return " - ";

        var iso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        var parts = iso.split('T')[1].split(':');

        delim = delim || ":";
        var res = parts[0] + delim + parts[1] + (withSecs ? delim + parts[2].split('.')[0] : "");
        return res;
    },

    monthName: (date) => {
        if (!date)
            return " - ";
        
        var monthNames = [
            "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
            "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
        ];
        var month = date.getMonth();

        return monthNames[month]; //hard-coded: GR name
    },


    //
    //Arrays
    //
    indexOf: (items, prop, val) => {
        for (var i = 0; i < items.length; i++) {
            if (items[i][prop] === val) {
                return i;
            }
        }

        return -1;
    },

    groupBy: (items, prop) => {
        var res = [];

        items.forEach((item) => {
            var key = item[prop];

            if (!res[key])
                res[key] = [];

            res[key].push(item);
        });

        return res;
    },


    //
    //Http requests
    //
    getJson: (url, opts) => {
        return Utils.fetchJson("GET", url, null, opts);
    },

    postJson: (url, data, opts) => {
        return Utils.fetchJson("POST", url, data, opts);
    },

    //generic
    fetchJson: async (method, url, data, opts) => {
        opts = opts || {};

        //prepare fetchOpts
        let fetchOpts = {
            method: method,
            headers: {
                //default JSON
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        //opts takes priority
        fetchOpts.headers = { ...fetchOpts.headers, ...opts.headers };

        if (method == "POST") {
            if (fetchOpts.headers["Content-Type"] == "application/json")
                fetchOpts.body = JSON.stringify(data);
            else
                fetchOpts.body = data;
        }

        //fetch data
        try {
            let response = await fetch(url, fetchOpts);

            if (!response.ok)
                throw Error(response.status);
            
            let responseJson = await response.json();

            if (opts.onSuccess)
                opts.onSuccess(responseJson);

            return responseJson;
        }
        catch (error) {
            let _data = (data) ? " -> data: " + JSON.stringify(data) : "";
            Logger.info(url + _data + " -> " + error);
            
            Utils.alertBox(Resources("ServerCommError"));
        }
    },


    //
    //App Specific
    //
    loadDateRangeFilter: (type, onSuccess) => {
        type = type || "filter";
        
        Utils.loadItem(type + "-dateFrom")
            .then((valFrom) => {
                Utils.loadItem(type + "-dateTo")
                    .then((valTo) => {
                        var _filter = {
                            dateFrom: (valFrom) ? new Date(valFrom) : null,
                            dateTo: (valTo) ? new Date(valTo) : null
                        };

                        onSuccess(_filter);
                    });
            });
    },
}

export default Utils;