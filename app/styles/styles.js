import { StyleSheet } from 'react-native';

export const AppStyles = StyleSheet.create({
    container: {
        //borderWidth: 1, borderColor: '#A00',
        flex: 1,
        backgroundColor: '#f3f1f5',
        justifyContent: 'flex-start'
    },
    label: {
        color: '#777'
    },
    input: {
        paddingLeft: 3,
        height: 40,
        borderRadius: 5,
        textAlignVertical: 'center',
        backgroundColor: 'white',
        borderWidth: 1, borderColor: '#ccc'
    },
    icon: {
        margin: 7,
        padding: 7,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        //borderWidth: 1, borderColor: '#000'
    },
    button: {
        margin: 7,
        padding: 7,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#107dbb',
        borderWidth: 1, borderColor: '#aaa'
    },
    buttonContainer: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    row: {
        flexDirection: 'row',
        flex: 1, alignSelf: 'stretch',
        alignItems: 'center'
    },
    col: {
        flex: 1, alignSelf: 'stretch',
        //borderWidth: 1, borderColor: '#AAA'
    },
    rowOdd: {
        backgroundColor: '#ccc',
        borderBottomWidth: 1, borderBottomColor: '#aaa'
    },
    rowEven: {
        backgroundColor: '#ddd',
        borderBottomWidth: 1, borderBottomColor: '#aaa'
    },
    listSection: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
        padding: 5
    },

    absoluteFill: {
        ...StyleSheet.absoluteFillObject
    },
    cover: {
        backgroundColor: '#111', opacity: 0.5
    },
    popupHeader: {
        fontSize: 16, fontWeight: 'bold',
        color: '#fff', backgroundColor: '#107dbb', //446baf
        padding: 8
    },

    bordered: {
        borderWidth: 1, borderColor: '#A00'
    },
    disabled: {
        backgroundColor: '#e8e8e8'
    },
    
    lineSep: {
        width: '90%', alignSelf: 'center',
        borderBottomWidth: 1, borderColor: '#aaa'
    },

    //
    //App Specific
    //
    dateRangeFilter: {
        top: '20%',
        height: (Platform.OS === 'ios') ? 400 : 250 //400 due to iOS Calendar
    },

    subHeader: {
        backgroundColor: '#107dbb',
        alignItems: 'center'
    },

    subHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        //height: 30,
        //borderBottomWidth: 1, borderBottomColor: '#aaa'
    },

    text: {
        color: '#107dbb'
    },

    dateText: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    center90: {
        width: '90%', alignSelf: 'center'
    }
});