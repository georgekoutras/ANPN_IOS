import 'react-native-gesture-handler'; //make sure it's at the top and there's nothing else before it

import React from 'react';
import { View, Image, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

//app
import LoginScreen from './app/screens/login';
import HomeScreen from './app/screens/home';
import DailyReportScreen from './app/screens/dailyReport';
import DailyReportsScreen from './app/screens/dailyReports';
import NotificationsScreen from './app/screens/notifications';
import PatientScreen from './app/screens/patient';
import PatientsScreen from './app/screens/patients';

import { Button } from './app/components/common';
import Utils from './app/utils.js'
import Logger from './app/logger.js'
import Resources from './app/resources';
import { expo } from './app.json';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'VirtualizedLists should never be nested',
]);

Logger.init();

const AppStack = createStackNavigator();
const MainStack = createStackNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: '#dcebf8'
    },
    headerTintColor: '#107dbb',
    headerTitleStyle: {
        //fontWeight: 'bold',
        color: '#107dbb'
    },
    //headerBackTitle: "Back", //iOS only
    headerBackTitleVisible: false //iOS only
};

export default function App() {
    const navigationRef = React.useRef();

    global.version = expo.version;

    return (
        <NavigationContainer
            ref={navigationRef}
            onStateChange={(state) => {
                const currentScreen = navigationRef.current.getCurrentRoute().name;

                if (global.currentScreen !== currentScreen) {
                    //console.log("onStateChange: prevScreen: " + global.currentScreen + ", currentScreen: " + currentScreen);
                    global.currentScreen = currentScreen;
                    Analytics.setCurrentScreen(currentScreen, currentScreen);
                }
            }}
        >
            <AppStack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
                <AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <AppStack.Screen name="Main" component={mainStack} options={{ headerShown: false }} />
                {/* <AppStack.Screen name="Main" component={mainDrawer} options={{ headerShown: false }} /> */}
            </AppStack.Navigator>
        </NavigationContainer>
    );
}

const mainStack = () => {
    return (
        <MainStack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeScreen} options={{ title: Resources("AppTitle") }} />
            <MainStack.Screen name="DailyReport" component={DailyReportScreen} options={{ title: Resources("DailyReport") }} />
            <MainStack.Screen name="DailyReports" component={DailyReportsScreen} options={{ title: Resources("DailyReports") }} />
            <MainStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: Resources("Notifications") }} />
            <MainStack.Screen name="Patient" component={PatientScreen} options={{ title: Resources("Patient") }} />
            <MainStack.Screen name="Patients" component={PatientsScreen} options={{ title: Resources("Patients") }} />
        </MainStack.Navigator>
    );
}