import React from 'react';
import { SafeAreaView, View, ScrollView, Text, Image, BackHandler } from 'react-native';

import { AppStyles } from '../styles/styles';
import { Button, Icon, Label } from '../components/common';
import MenuButton from '../components/menuButton'
import Utils from '../utils';
import Resources from '../resources';

export default function HomeScreen (props) {
    const [state, setState] = React.useState({
        acceptedGDPR: false,
        popup: null
    });

    let userInfo = global.userInfo;
    let accountId = userInfo.accountId;
    let patientId = userInfo.patientId;

    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    }, []);

    React.useEffect(() => {
        if (state.acceptedGDPR === true) {
            props.navigation.setOptions({
                headerRight: () => (
                    <View style={AppStyles.buttonContainer}>
                        <Icon image={require('../assets/icons/info-64.png')} width={23} onPress={() => _showInfo()} />
                        <Icon image={require('../assets/icons/gdpr.png')} width={23} onPress={() => _showGDPR()} />
                    </View>
                )
            });
        }

        //Utils.clearItem("acceptedGDPR"); //temporary...

        Utils.loadItem("acceptedGDPR")
            .then((val) => {
                if (val === "true")
                    setState(prevState => ({ ...prevState, acceptedGDPR: true }));
            });
    }, [state.acceptedGDPR]);

    //if 'Home' is the first screen (after login)
    const onBackPress = () => {
        return Utils.onBackPress(props, "Home");
    }

    const _showInfo = () => {
        var _content = (
            <View style={{marginTop: 20}}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'justify' }}>
                    Με τη συγχρηματοδότηση της Ελλάδας και της Ευρωπαϊκής Ένωσης
                </Text>
                <Text style={{marginVertical: 15, textAlign: 'justify'}}>
                    Το έργο υλοποιείται στο πλαίσιο της Δράσης ΕΡΕΥΝΩ – ΔΗΜΙΟΥΡΓΩ - ΚΑΙΝΟΤΟΜΩ και συγχρηματοδοτήθηκε από την Ευρωπαϊκή Ένωση και εθνικούς πόρους μέσω του Ε.Π. Ανταγωνιστικότητα, Επιχειρηματικότητα & Καινοτομία (ΕΠΑνΕΚ) (κωδικός έργου: Τ1ΕΔΚ-05355)
                </Text>
                <Image source={require('../assets/EU_ERDF_gr-1024x219.jpg')} style={{ width: undefined, height: 80, resizeMode: 'contain' }} />
            </View>
        );

        Utils.showPopup({state, setState}, Resources("AppTitle") + " (v" + global.version + ")", _content, { top: '15%', height: 400 });
    }

    const _contentGDPR = () => {
        const paragraph = {marginVertical: 5, textAlign: 'justify'};
        const companyName = <Text style={{fontWeight: 'bold'}}>Θ.ΚΟΥΤΣΟΥΡΑΣ ΚΑΙ ΣΙΑ ΕΕ. “OpenIT”</Text>
        var _content = (
            <View style={{ marginVertical: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'justify', marginBottom: 10 }}>
                    Δήλωση Συγκατάθεσης για την συλλογή και χρήση Δεδομένων Προσωπικού Χαρακτήρα
                </Text>
                
                <Text style={paragraph}>
                    Βάσει του Γενικού Ευρωπαϊκού Κανονισμού Προστασίας Προσωπικών Δεδομένων 679/2016
                    (GDPR), η {companyName} υποχρεούται να ζητήσει την συγκατάθεσή
                    σας σχετικά με την συλλογή και επεξεργασία των προσωπικών σας δεδομένων (άρθρο 6,
                    ΓΚΠΔ), στα πλαίσια του έργου “ΑΝΑΠτυξη εφαρμογών για κιΝητά τηλέφωνα για την βΕλτίωση
                    της ζωής των χρόνιΩν ασθενών του αναπνευστικού – ΑΝΑΠΝΕΩ”.
                </Text>

                <Text style={paragraph}>
                    Υπογράφοντας την παρούσα Δήλωση Συγκατάθεσης, δηλώνω ότι κατανοώ και συμφωνώ με
                    τον σκοπό συγκέντρωσης και τήρησης των προσωπικών μου δεδομένων καθώς και με το
                    γεγονός ότι στο εξής, η {companyName}, επέχει ρόλο υπεύθυνου
                    επεξεργασίας. Αναγνωρίζω ότι τα στοιχεία τα οποία παρέχω, στον επεξεργαστή δεδομένων,
                    περιλαμβάνουν ευαίσθητα δεδομένα τα οποία εμπίπτουν στον ορισμό προσωπικών
                    δεδομένων ειδικών κατηγοριών και συναινώ στην συλλογή και επεξεργασία τους (άρθρο 9, ΓΚΠΔ).
                </Text>

                <Text style={paragraph}>
                    Tα προσωπικά αυτά δεδομένα μεταξύ άλλων περιλαμβάνουν:{"\n"}
                    - Τα προσωπικά μου στοιχεία,{"\n"}
                    - Ιατρικό ιστορικό,{"\n"}
                    καθώς και οποιοδήποτε άλλο στοιχείο κρίνεται απαραίτητο για την εξυπηρέτηση, καθώς και την
                    διαφύλαξη της υγείας μου.
                </Text>

                <Text style={paragraph}>
                    Η {companyName} αναγνωρίζει και σέβεται τα δικαιώματα των
                    ασθενών. Ο ασθενής αναφορικά με τα προσωπικά του δεδομένα έχει τα ακόλουθα δικαιώματα:{"\n"}
                    1) Δικαίωμα πρόσβασης στα δεδομένα του{"\n"}
                    2) Δικαίωμα διόρθωσης των δεδομένων του{"\n"}
                    3) Δικαίωμα διαγραφής των δεδομένων του υπό ορισμένες προϋποθέσεις.
                    Ο ασθενής δεν μπορεί να ζητήσει διαγραφή των δεδομένων του κατά την περίοδο που
                    η {companyName} έχει νόμιμη υποχρέωση να τηρεί αρχείο (10ετία από την τελευταία καταχώρηση),{"\n"}
                    4) Δικαίωμα περιορισμού της επεξεργασίας των δεδομένων του,{"\n"}
                    5) Δικαίωμα στη φορητότητα των δεδομένων του.
                </Text>

                <Text style={paragraph}>
                    Όταν ο ασθενής υποβάλλει ένα σχετικό αίτημα ασκώντας κάποιο από τα παραπάνω
                    δικαιώματα, η {companyName} οφείλει να απαντήσει θετικά ή
                    αρνητικά εντός 1 μηνός, είτε εξηγώντας τους λόγους της καθυστέρησης. Σε περίπτωση
                    καθυστέρησης οφείλει να απαντήσει θετικά ή αρνητικά εντός 3 μηνών από το αίτημα.
                </Text>

                <Text style={paragraph}>
                    Η {companyName} κατά την συλλογή, επεξεργασία, και αποθήκευση
                    των προσωπικών σας δεδομένων, θα τηρήσει όλα τα απαραίτητα μέτρα ασφάλειας ή και
                    κρυπτογράφησης, για να διαφυλάξει τα δεδομένα σας.
                </Text>

                <Text style={paragraph}>
                    Δεν θα μοιραστεί τα δεδομένα σας με τρίτους, παρά μόνο για την διασφάλιση των ζωτικών σας
                    συμφερόντων ή στα πλαίσια παροχής των ζητούμενων υπηρεσιών. Καθ΄ όλη τη διαδικασία, τα
                    δεδομένα σας προστατεύονται από το ιατρικό απόρρητο.
                </Text>

                <Text style={paragraph}>
                    Σε κάθε περίπτωση και ανά πάσα στιγμή, μπορείτε να προχωρήσετε σε άρση της συναίνεσής
                    σας και να αιτηθείτε πρόσβαση σε ή καταστροφή των προσωπικών σας δεδομένων. Για να
                    γίνει αυτό μπορείτε να υποβάλετε σχετικό αίτημα στην γραμματεία ή να αποστείλετε το αίτημά
                    σας μέσω ηλεκτρονικού ταχυδρομείου στην διεύθυνση: <Text style={{ fontWeight: 'bold' }}>info@openit.gr</Text>
                </Text>
            </View>
        );

        return _content;
    }

    const _showGDPR = () => {
        var _content = (
            <>
                {_contentGDPR()}
            </>
        );

        Utils.showPopup({state, setState}, Resources("AppTitle") + " (v" + global.version + ")", _content, { top: '10%', height: '80%' });
    }

    const _acceptGDPR = () => {
        Utils.storeItem("acceptedGDPR", "true");
        setState(prevState => ({ ...prevState, acceptedGDPR: true }));
    }

    if (state.acceptedGDPR !== true) {
        return (
            <SafeAreaView style={AppStyles.container}>
                <ScrollView style={{ padding: 12 }}>
                    {_contentGDPR()}
                </ScrollView>

                <View style={AppStyles.buttonContainer}>
                    <Button title="Έξοδος" style={{ flex: 0.5 }} onPress={() => Utils.signOut(props)} />
                    <Button title="Αποδέχομαι" style={{ flex: 0.5 }} onPress={_acceptGDPR} />
                </View>
            </SafeAreaView>
        );
    }

    var userIcon = userInfo.isDoctor ? require('../assets/icons/doctor.png') : require('../assets/icons/patient.png');
    return (
        <SafeAreaView style={AppStyles.container}>
            <View style={AppStyles.subHeader}>
                <Image source={userIcon} style={{aspectRatio: 1, height: Utils.FHD() ? 220 : 180}} />
            </View>

            <View style={{alignItems: 'center'}}>
                <Text style={{...AppStyles.dateText, marginVertical: 5 }}>{Utils.formatDate(new Date())}</Text>
                <View style={AppStyles.lineSep}></View>
                <Text style={{...AppStyles.text, fontSize: 17, marginVertical: 15 }}>{Resources("Hi")} {userInfo.fullName}</Text>
            </View>

            {
                userInfo.isDoctor &&
                <>
                    <View style={AppStyles.buttonContainer}>
                        <MenuButton
                            icon={require('../assets/icons/notification.png')}
                            title={Resources("Notifications")}
                            onPress={() => props.navigation.push("Notifications", { accountId: accountId })}
                        />
                        <MenuButton
                            icon={require('../assets/icons/patients.png')}
                            title={Resources("Patients")}
                            onPress={() => props.navigation.push("Patients", { accountId: accountId })}
                        />
                    </View>

                    <View style={AppStyles.buttonContainer}>
                        <MenuButton
                            icon={require('../assets/icons/exit.png')}
                            title={Resources("SignOut")}
                            onPress={() => Utils.signOut(props)}
                        />
                    </View>
                </>
            }

            {
                userInfo.isPatient &&
                <>
                    <View style={AppStyles.buttonContainer}>
                        <MenuButton
                            icon={require('../assets/icons/new-daily.png')}
                            title={Resources("NewDailyReport")}
                            onPress={() => props.navigation.push("DailyReport", { patientId: patientId })}
                        />

                        <MenuButton
                            icon={require('../assets/icons/historic-daily.png')}
                            title={Resources("DailyReportsHistory")}
                            onPress={() => props.navigation.push("DailyReports", { patientId: patientId })}
                        />
                    </View>

                    <View style={AppStyles.buttonContainer}>
                        <MenuButton
                            icon={require('../assets/icons/notification.png')}
                            title={Resources("Notifications")}
                            onPress={() => props.navigation.push("Notifications", { accountId: accountId })}
                        />

                        <MenuButton
                            icon={require('../assets/icons/exit.png')}
                            title={Resources("SignOut")}
                            onPress={() => Utils.signOut(props)}
                        />
                    </View>
                </>
            }

            {
                userInfo.isAdmin &&
                <View style={AppStyles.buttonContainer}>
                    <MenuButton
                        icon={require('../assets/icons/exit.png')}
                        title={Resources("SignOut")}
                        onPress={() => Utils.signOut(props)}
                    />
                </View>
            }

            {state.popup}
        </SafeAreaView>
    );
}