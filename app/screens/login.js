import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Platform } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Label, Loader } from '../components/common';
import Toggle from '../components/toggle';
import Utils from '../utils.js'
import Resources from '../resources';
import ApiClient from '../apiClient';
import PushNotif from '../pushNotifications'

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "", //doctor1@anapneo.eu, patient1@anapneo.eu
            password: "", //1111
            rememberMe: false,
            message: "",
            loading: null,

            render: false
        };
    }

    componentDidMount() {
        global.username = ""; //always 'reset'

        /** //old impl
        Utils.loadItem("username", "")
            .then((val) => { if (val) this.setState({ username: val }); });
        
        //server logout, only if there is a token (user SignOut)
        if (ApiClient._accessToken != "") {
            ApiClient.logout();
        }
        /**/

        Utils.loadItem("apiTokens", "")
            .then((val) => {
                let apiTokensVal = val;
                //console.log("apiTokens ---> " + val);
                //console.log("ApiClient._accessToken ---> " + ApiClient._accessToken);

                let restoreState = (apiTokensVal && ApiClient._accessToken == "");
                if (!restoreState)
                    this.setState({ render: true });

                Utils.loadItem("loginInfo", "")
                    .then((val) => {
                        var loginInfo = val ? JSON.parse(val) : {};
                        let usernameVal = loginInfo.username;
                        //console.log("loginInfo ---> " + val);

                        if (loginInfo.rememberMe)
                            this.setState({ username: loginInfo.username, password: loginInfo.password, rememberMe: loginInfo.rememberMe });

                        //server logout, only if there is a token (user SignOut)
                        if (ApiClient._accessToken != "") {
                            ApiClient.logout();
                        }
                        else if (apiTokensVal) {
                            //
                            //--> Restore State
                            //
                            //if there is no 'ApiClient._accessToken' but there is 'apiTokens',
                            //that means that App came into foreground and last user did not sign-out:
                            //  a) on purpose
                            //  b) due to server error (since or error we ignore) --> TODO ???
                            //
                            //In either case, we refresh token and go to 'Home' (userInfo is also needed)
                            //
                            Utils.loadItem("userInfo", "")
                                .then((val) => {
                                    let userInfoVal = val;
                                    //console.log("userInfo ---> " + val);

                                    //all must have values --> username and userInfo are stored 'together'
                                    if (usernameVal && userInfoVal) {
                                        let apiTokens = JSON.parse(apiTokensVal);

                                        //restore api tokens separately -> MUST be done before 'ApiClient.refreshToken'
                                        ApiClient._accessToken = apiTokens.accessToken;
                                        ApiClient._refreshToken = apiTokens.refreshToken;
                                        ApiClient._deviceToken = apiTokens.deviceToken;

                                        let restored = false;
                                        ApiClient.refreshToken(() => {
                                            global.username = usernameVal;
                                            global.userInfo = JSON.parse(userInfoVal);
                                            restored = true;

                                            this.props.navigation.reset({ index: 0, routes: [{ name: "Main" }] });
                                        }).finally(() => { if (!restored) this.setState({ render: true }); });
                                    }
                                    else
                                        this.setState({ render: true });
                                });
                        }
                    });
            });
    };

    _login = () => {
        if (this.state.username.trim() == "" || this.state.password.trim() == "") {
            this.setState({ message: Resources("FillUsernamePassword") });
            return;
        }

        this.setState({ loading: true });
        var _logged = false;

        ApiClient.validateUser(this.state.username, this.state.password)
            .then((data) => {
                _logged = (data.res == "");

                if (_logged) {
                    global.username = this.state.username; //required for AsyncStorage
                    global.userInfo = data.userInfo;

                    var loginInfo = {
                        username: this.state.username,
                        password: this.state.rememberMe ? this.state.password : "",
                        rememberMe: this.state.rememberMe
                    };

                    //on purpose without 'user'
                    Utils.storeItem("loginInfo", JSON.stringify(loginInfo), "");
                    Utils.storeItem("userInfo", JSON.stringify(data.userInfo), "");

                    PushNotif.registerForPushNotificationsAsync()
                        .then(token => {
                            PushNotif.setNotificationHandler();
                            ApiClient.deviceToken(data.userInfo.accountId, token, Platform.OS);
                        });

                    //new nav: manually set first screen
                    this.props.navigation.reset({ index: 0, routes: [{ name: "Main" }] });
                }
                else
                    this.setState({ message: data.res });
            })
            .finally(() => { if (!_logged) this.setState({ loading: false }); });
    };

    render() {
        var _aspectRatio = Utils.FHD() ? 1 : 1.4; //1.4 with try-and-see

        if (!this.state.render)
            return <Loader animating={true} />;

        return (
            <SafeAreaView style={[AppStyles.container]}>
                <KeyboardAvoidingView
                    behavior={Utils.iOS() ? "padding" : ""}
                    style={{ flex: 1 }}
                >
                    <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: '#dcebf8'}}>
                        <View style={{ flex: 1 }}>
                            <Image source={require('../assets/login-img.png')} style={{ aspectRatio: _aspectRatio, width: undefined, height: undefined, resizeMode: 'cover' }} />
                        </View>

                        <View style={{ flex: 1, paddingLeft: 40, paddingRight: 40, justifyContent: 'flex-end' }}>
                            <Label style={{textAlign: 'center'}}>{Resources("Username")}</Label>
                            <TextInput
                                style={AppStyles.input}
                                onChangeText={(val) => { this.setState({ username: val }) }}
                                value={this.state.username}
                            />

                            <View style={{marginVertical: 5}}></View>

                            <Label style={{textAlign: 'center'}}>{Resources("Password")}</Label>
                            <TextInput
                                secureTextEntry={true}
                                style={AppStyles.input}
                                onChangeText={(val) => { this.setState({ password: val }) }}
                                value={this.state.password}
                            />

                            <View style={{marginVertical: 5}}></View>

                            <View style={[AppStyles.row, { justifyContent: 'center' }]}>
                                <Label style={{ marginRight: Utils.iOS() ? 10 : 0 }}>{Resources("RememberMe")}</Label>
                                <Toggle
                                    value={this.state.rememberMe}
                                    onValueChange={(val) => { this.setState({ rememberMe: val }) }}
                                />
                            </View>
                            
                            <View style={AppStyles.buttonContainer}>
                                <Button key="loginBtn" title={Resources("SignIn")} onPress={this._login} style={{ flex: 1 }} />
                                {this.state.loading && <View style={[AppStyles.absoluteFill, AppStyles.cover, { backgroundColor: '#eee' }]}></View>}
                            </View>

                            <Label style={{ color: '#f00' }}>{this.state.message}</Label>
                        </View>
                        
                        <View style={{ ...AppStyles.center90 }}>
                            <Image source={require('../assets/EU_ERDF_gr-1024x219.jpg')} style={{ width: undefined, height: 80, resizeMode: 'contain' }} />
                        </View>

                        <View style={{ flex: 1, paddingRight: 20, alignItems: 'flex-end' }}>
                            <Label>v{global.version}</Label>
                        </View>
                    </ScrollView>
                    
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}