import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Label } from '../components/common';
import Utils from '../utils.js'
import Resources from '../resources';
import ApiClient from '../apiClient'

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        borderWidth: 1, borderColor: '#aaa',
        borderRadius: 7,
        marginTop: 10,
        padding: 5
    },
    rowFont: {
        fontSize: 17
    }
});

const YesBackCol = '#107dbb';
const NoBackCol = '#c00';
const NullBackCol = '#888';

const ReportQuestion = (props) => {
    let answer = props.value;

    const [state, setState] = useState({
        yesBackCol: (answer == true) ? YesBackCol : NullBackCol,
        noBackCol: (answer == false) ? NoBackCol : NullBackCol
    });

    const _onYes = () => {
        if (props.readOnly)
            return;
        
        setState({
            yesBackCol: YesBackCol,
            noBackCol: NullBackCol
        });
        
        props.onChange(props.id, true);
    }
    const _onNo = () => {
        if (props.readOnly)
            return;
        
        setState({
            yesBackCol: NullBackCol,
            noBackCol: NoBackCol
        });
        
        props.onChange(props.id, false);
    }

    return (
        <View style={[styles.row, AppStyles.center90, props.style]}>
            <Text style={styles.rowFont}>{props.children}</Text>
            <View style={[AppStyles.buttonContainer, { justifyContent: 'flex-start' }]}>
                <Button title={Resources("Yes")} textStyle={{ fontSize: 15 }} style={{ width: 60, backgroundColor: state.yesBackCol }} onPress={_onYes} />
                <Button title={Resources("No")} textStyle={{ fontSize: 15 }} style={{ width: 60, backgroundColor: state.noBackCol }} onPress={_onNo} />
            </View>
        </View>
    );
};

const ReportInput = (props) => {
    const [val, setVal] = useState((props.value ?? "") + ""); //must be a string

    const _onChange = (val) => {
        setVal(val);
        props.onChange(props.id, val);
    }

    return (
        <View style={[styles.row, AppStyles.center90, props.style]}>
            <Text style={styles.rowFont}>{props.children}</Text>
            <View style={[AppStyles.buttonContainer, { justifyContent: 'flex-start' }]}>
                {
                    !props.readOnly &&
                    <TextInput
                        keyboardType='numeric' //all are floats -> otherwise as prop
                        style={[AppStyles.input, { flex: 1, backgroundColor: '#fcfcfc' }]}
                        onChangeText={_onChange}
                        value={val}
                    />
                }
                {
                    props.readOnly &&
                    <Text style={[AppStyles.input, { flex: 1, backgroundColor: '#fcfcfc' }]}>{val}</Text>
                }
            </View>
        </View>
    );
};

const Answers = {};
const Inputs = {};

export default class DailyReportScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mainQ: [],
            subQ: [],

            cssQ: {}, //styles
            showSubQ: {},
            
            popup: null,
            loader: null
        };

        this.params = this.props.route.params;
        this.patientId = this.params.patientId;
        this.patient = this.params.patient;
        this.reportId = this.params.reportId;
        this.reportDate = this.params.reportDate || new Date();

        this.readOnly = (this.reportId != null);
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData = () => {
        Utils.showLoader(this);

        let hasReport = false;
        ApiClient.hasDailyReport(this.patientId, (data) => {
            hasReport = data;

            if (hasReport === true && this.reportId == null) {
                Utils.alertBox(Resources("DailyReportAlreadySubmitted"), Resources("Message"), () => {
                    this.props.navigation.goBack();
                });
            }
            else {
                Utils.showLoader(this);

                ApiClient.questions((data) => {
                    let mains = [];
                    let subs = [];
                    let cssQ = {};
                    let showSubs = {};

                    //hard-coded: Inputs not provided by server (for now)
                    Inputs["walkingDist"] = null;
                    Inputs["heartRate"] = null;
                    Inputs["pefr"] = null;
                    Inputs["satO2"] = null;
                    Inputs["temperature"] = null;

                    data.forEach(item => {
                        //init
                        Answers[item.label] = null;

                        if (item.parentId == null)
                            mains.push(item);
                        else
                            subs.push(item);

                        cssQ[item.label] = {};
                        showSubs[item.label] = false; //hide by default
                    });

                    //load answers
                    if (this.reportId != null) {
                        ApiClient.loadDailyReport(this.patientId, this.reportId, (data) => {
                            //console.log("---:::"+JSON.stringify(data));

                            Object.keys(Answers).forEach(label => {
                                Answers[label] = (data[label] == 1) ? true : false;
                                showSubs[label] = Answers[label];
                            });

                            Object.keys(Inputs).forEach(label => {
                                Inputs[label] = data[label];
                            });

                            this.setState({ mainQ: mains, subQ: subs, cssQ: cssQ, showSubQ: showSubs });
                        });
                    }
                    else
                        this.setState({ mainQ: mains, subQ: subs, cssQ: cssQ, showSubQ: showSubs });
                }).finally(() => { Utils.hideLoader(this); });
            }
        }).finally(() => { if (hasReport) Utils.hideLoader(this); });
    }

    _onChangeQ = (label, val) => {
        //set answer
        Answers[label] = val;

        //if main, then reset sub questions
        let mainQ = this.state.mainQ.find(item => { return item.label == label });
        if (mainQ != null) {
            this.state.subQ
                .filter(item => { return item.parentId == mainQ.id })
                .forEach(item => {
                    Answers[item.label] = null;
                });
        }

        let cssQ = {
            ...this.state.cssQ,
            [label]: {} //un-error
        };

        let showSubs = {
            ...this.state.showSubQ,
            [label]: val //show or hide subs
        };

        this.setState({ cssQ: cssQ, showSubQ: showSubs });
    }

    _onChangeIn = (label, val) => {
        //set input -> no validations
        Inputs[label] = (val.trim() == "") ? null : val.trim();

        let cssQ = {
            ...this.state.cssQ,
            [label]: {} //un-error
        };

        this.setState({ cssQ: cssQ });
    }

    _sumbit = () => {
        let queryStr = "";
        let cssQ = {...this.state.cssQ};

        //
        //Questions
        //
        let qsOK = true;

        Object.keys(Answers).forEach((label, index) => {
            let valQ = Answers[label];
            if (valQ == null) {
                let mainQ = this.state.mainQ.find(item => { return item.label == label });
                let subQ = this.state.subQ.find(item => { return item.label == label });
                
                //if it is main question
                if (mainQ != null) {
                    cssQ[label] = { borderColor: '#a00' }; //error
                    qsOK = false;
                }
                else if (subQ != null) {
                    //if it is a sub question, then find the parent
                    let parent = this.state.mainQ.find(item => { return item.id == subQ.parentId });
                    let parentVal = Answers[parent.label];

                    //only if parent is 'Yes', otherwise we ignore sub question
                    if (parentVal == true) {
                        cssQ[label] = { borderColor: '#a00' }; //error
                        qsOK = false;
                    }
                }
            }

            if (valQ != null)
                queryStr += label + "=" + (valQ ? 1 : 0) + "&";
        });

        //
        //Inputs
        //
        let floatExp = /^((\.\d+)|(\d+(\.\d+)?))$/; //validation --> dot for decimal
        let numsOK = true;

        Object.keys(Inputs).forEach(label => {
            let valIn = Inputs[label];
            if (valIn != null && valIn != "") {
                if (!floatExp.test(valIn)) {
                    cssQ[label] = { borderColor: '#a00' }; //error
                    numsOK = false;
                }
                else
                    queryStr += label + "=" + valIn + "&";
            }
        });

        if (!qsOK) {
            Utils.alertBox(Resources("DailyReportRequired"));
            this.setState({ cssQ: cssQ });
        }
        else if (!numsOK) {
            Utils.alertBox(Resources("DailyReportInvalidNumbers"));
            this.setState({ cssQ: cssQ });
        }
        else {
            //console.log("-----Ready to POST: " + queryStr);
            Utils.showLoader(this);

            ApiClient.submitDailyReport(this.patientId, queryStr, () => {
                Utils.alertBox(Resources("DailyReportSubmit"), Resources("Message"), () => {
                    this.props.navigation.goBack();
                });
            }).finally(() => { Utils.hideLoader(this); });
        }
    }

    render() {
        return (
            <SafeAreaView style={AppStyles.container}>
                {this.patient &&
                    <View style={{ ...AppStyles.subHeader, height: 30, justifyContent: 'center' }}>
                        <Text style={AppStyles.subHeaderText}>{this.patient}</Text>
                    </View>
                }
                
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={{ ...AppStyles.subHeader, height: 40, justifyContent: 'center' }}>
                       <Text style={{ ...AppStyles.subHeaderText, ...AppStyles.dateText }}>{Utils.formatDate(this.reportDate)}</Text>
                    </View>

                    {
                        this.state.mainQ.map((item, index) => {
                            return (
                                <View key={item.label}>
                                    <ReportQuestion
                                        id={item.label}
                                        value={Answers[item.label]}
                                        onChange={this._onChangeQ}
                                        readOnly={this.readOnly}
                                        style={this.state.cssQ[item.label]}
                                    >
                                        {item.text}
                                    </ReportQuestion>
                                    {
                                        this.state.showSubQ[item.label] &&
                                        <View style={{ marginLeft: 20 }}>
                                            {
                                                this.state.subQ
                                                    .filter(el => { return el.parentId == item.id })
                                                    .map((subItem, subIndex) => {
                                                        return <ReportQuestion
                                                            key={subItem.label}
                                                            id={subItem.label}
                                                            value={Answers[subItem.label]}
                                                            onChange={this._onChangeQ}
                                                            readOnly={this.readOnly}
                                                            style={this.state.cssQ[subItem.label]}
                                                        >
                                                            {subItem.text}
                                                        </ReportQuestion>
                                                    })
                                            }
                                        </View>
                                    }
                                </View>
                            );
                        })
                    }


                    {
                        this.state.mainQ.length > 0 &&
                        <>
                            <Text style={[styles.rowFont, { marginTop: 20, marginLeft: 20, fontWeight: 'bold' }]}>{Resources("AdditionalInfo")}</Text>
                            {
                                Object.keys(Inputs).map(item => {
                                    return <ReportInput
                                        key={item}
                                        id={item}
                                        value={Inputs[item]}
                                        onChange={this._onChangeIn}
                                        readOnly={this.readOnly}
                                        style={this.state.cssQ[item]}
                                    >
                                        {Resources(item)}
                                    </ReportInput>
                                })
                            }
                        </>
                    }

                    <View style={AppStyles.buttonContainer}>
                        {
                            this.reportId == null && this.state.mainQ.length > 0 &&
                            <Button title={Resources("Submit")} onPress={this._sumbit} style={{ flex: 0.5 }} textStyle={[styles.rowFont, { fontWeight: 'bold' }]} />
                        }
                        {this.state.loader && <View style={[AppStyles.absoluteFill, AppStyles.cover, { backgroundColor: '#eee' }]}></View>}
                    </View>
                </ScrollView>

                {this.state.popup}
                {this.state.loader}
            </SafeAreaView>
        );
    }
}