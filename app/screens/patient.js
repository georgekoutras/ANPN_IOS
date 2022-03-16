import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Image, StyleSheet } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Label } from '../components/common';
import MenuButton from '../components/menuButton'
import Utils from '../utils.js'
import Resources from '../resources';

const styles = StyleSheet.create({
    rowFont: {
        //fontSize: 17
    }
});

const FormRow = (props) => {
    return (
        <View style={[{ marginVertical: 3, flex: 1 }, props.style]}>
            <Label>{props.label}</Label>
            <Text style={AppStyles.input}>{props.text}</Text>
        </View>
    );
};

export default class PatientScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasReport: null,
            popup: null,
            loader: null
        };

        this.params = this.props.route.params;
        this.item = this.params.item;
    }

    componentDidMount() {
        //load data in case of 'View' -> setState({item: ...})
    }

    render() {
        var userIcon = require('../assets/icons/patient.png');
        return (
            <SafeAreaView style={AppStyles.container}>
                <ScrollView>
                    <View style={AppStyles.subHeader}>
                        <Image source={userIcon} style={{ aspectRatio: 1, height: Utils.FHD() ? 180 : 130 }} />
                    </View>
                    <View style={[AppStyles.buttonContainer]}>
                        <MenuButton
                            style={{ width: 113 }}
                            icon={require('../assets/icons/new-daily.png')}
                            title={Resources("NewDailyReport")}
                            onPress={() => this.props.navigation.push("DailyReport", { patientId: this.item.id, patient: this.item.fullName })}
                        />
                        <MenuButton
                            style={{ width: 113 }}
                            icon={require('../assets/icons/historic-daily.png')}
                            title={Resources("DailyReportsHistory")}
                            onPress={() => this.props.navigation.push("DailyReports", { patientId: this.item.id, patient: this.item.fullName })}
                        />
                        <MenuButton
                            style={{ width: 116 }}
                            icon={require('../assets/icons/notification.png')}
                            title={Resources("Notifications")}
                            onPress={() => this.props.navigation.push("Notifications", { accountId: this.item.accountId, patient: this.item.fullName })}
                        />
                    </View>

                    <View style={AppStyles.center90}>
                        <FormRow
                            label={Resources("Lastname")}
                            text={this.item.lastName}
                        />

                        <FormRow
                            label={Resources("Firstname")}
                            text={this.item.firstName}
                        />

                        <View style={AppStyles.row}>
                            <FormRow
                                label={Resources("AMKA")}
                                text={this.item.amka}
                                style={{ marginRight: 7 }}
                            />

                            <FormRow
                                label={Resources("DateOfBirth")}
                                text={Utils.formatDate(this.item.birthDate)}
                            />
                        </View>

                        <FormRow
                            label={Resources("Mobile")}
                            text={this.item.mobile}
                        />

                        <FormRow
                            label={Resources("Email")}
                            text={this.item.email}
                        />

                    </View>
                </ScrollView>

                {this.state.popup}
                {this.state.loader}
            </SafeAreaView>
        );
    }
}