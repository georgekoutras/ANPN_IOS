
const resources = {
    "en": {
        "BtnOK": "OK",
        "BtnCancel": "Cancel",
        "Alert": "Alert",

        "Username": "Username",
        "Password": "Password",
        "RememberMe": "Remember Me",
        "SignIn": "Sign In",
        "SignOut": "Sign Out",
        "AreYouSure": "Are you sure?",
        "FillUsernamePassword": "Please fill Username and Password.",

        "Submit": "Submit",
        "Apply": "Apply",
        "OK": "OK",
        "Cancel": "Cancel",
        "Yes": "Yes",
        "No": "No",
        "From": "From",
        "To": "To",

        "Hi": "Hi",
        "Date": "Date",
        "Time": "Time",
        "Message": "Message",
        "Filter": "Filter",
        "StartTyping": "Start typing...",
        "ServerCommError": "Error while communicating with the server. Please check your internet connection.",


        //
        //App Specific
        //
        "AppTitle": "My Breathe",

        "NewDailyReport": "New Daily Report",
        "DailyReportsHistory": "Daily Reports History",
        "Notifications": "Notifications",
        "Patient": "Patient",
        "Patients": "Patients",

        "DailyReport": "Daily Report",
        "DailyReports": "Daily Reports",

        //Patient
        "Lastname": "Lastname",
        "Firstname": "Firstname",
        "Age": "Age",
        "DateOfBirth": "Date Of Birth",
        "Mobile": "Mobile",

        "Name_AMKA": "Name or AMKA",

        //Daily Report
        "DailyReportAlreadySubmitted": "The daily report for today has already been submitted.",
        "DailyReportRequired": "You did not answer all the questions.",
        "DailyReportSubmit": "The submition of the daily report was completed successfully.",
        "AdditionalInfo": "Additional Info",
        "DailyReportInvalidNumbers": "Invalid numbers in some inputs.",

        //for Inputs: same 'id' as the 'label' from server
        "walkingDist": "Walking distance (in km)",
        "heartRate": "Pulses (in pulses/minute)",
        "pefr": "Maximum expiratory flow rate (L/min)",
        "satO2": "Oxygen saturation (%)",
        "temperature": "Body temperature (in degrees Celsius)",

    },

    "gr": {
        "BtnOK": "Ενταξει", //on purpose without accentuation
        "BtnCancel": "Ακυρο", //on purpose without accentuation
        "Alert": "Προειδοποίηση",

        "Username": "Όνομα Χρήστη",
        "Password": "Κωδικός Πρόσβασης",
        "RememberMe": "Να με θυμάσαι",
        "SignIn": "Είσοδος",
        "SignOut": "Έξοδος",
        "AreYouSure": "Είστε σίγουροι;",
        "FillUsernamePassword": "Παρακαλώ συμπληρώστε Όνομα Χρήστη και Κωδικό Πρόσβασης.",

        "Submit": "Καταχώρηση",
        "Apply": "Εφαρμογή",
        "OK": "Εντάξει",
        "Cancel": "Άκυρο",
        "Yes": "Ναι",
        "No": "Όχι",
        "From": "Από",
        "To": "Έως",
        
        "Hi": "Γεια σου",
        "Date": "Ημ/νία",
        "Time": "Ώρα",
        "Message": "Μήνυμα",
        "Filter": "Φίλτρο",
        "StartTyping": "Πληκτρολογήστε...",
        "ServerCommError": "Σφάλμα κατά την επικοινωνία με τον διακομιστή. Παρακαλώ ελέγξτε τη σύνδεσή σας στο διαδίκτυο.",
        

        //
        //App Specific
        //
        "AppTitle": "ΑΝΑΠΝΕΩ",

        "NewDailyReport": "Προσθήκη Ημερήσιας Αναφοράς",
        "DailyReportsHistory": "Ιστορικό Ημερήσιων Αναφορών",
        "Notifications": "Ειδοποιήσεις",
        "Patient": "Ασθενής",
        "Patients": "Ασθενείς",

        "DailyReport": "Ημερήσια Αναφορά",
        "DailyReports": "Ημερήσιες Αναφορές",

        //Patient
        "Lastname": "Επίθετο",
        "Firstname": "Όνομα",
        "Age": "Ηλικία",
        "DateOfBirth": "Ημ/νία Γέννησης",
        "Mobile": "Κινητό",

        "Name_AMKA": "Όνομα ή ΑΜΚΑ",

        //Daily Report
        "DailyReportAlreadySubmitted": "Η ημερήσια αναφορά για σήμερα έχει ήδη καταχωρηθεί.",
        "DailyReportRequired": "Δεν απαντήσατε σε όλες τις ερωτήσεις.",
        "DailyReportSubmit": "Η καταχώρηση της ημερήσιας αναφοράς ολοκληρώθηκε επιτυχώς.",
        "AdditionalInfo": "Πρόσθετες Πληροφορίες",
        "DailyReportInvalidNumbers": "Μη έγκυρος αριθμός σε ορισμένα πεδία.",

        //for Inputs: same 'id' as the 'label' from server
        "walkingDist": "Απόσταση που διανύθηκε (σε χλμ.)",
        "heartRate": "Παλμοί (σε παλμούς/λεπτό)",
        "pefr": "Μεγίστη εκπνευστική ταχύτητα ροής (Λ/λεπτό)",
        "satO2": "Κορεσμός οξυγόνου (%)",
        "temperature": "Θερμοκρασία σώματος (σε βαθμούς Κελσίου)",

    }
}

export default function(id) {
    var lang = "gr";
    var res = resources[lang][id];
    return res || id;
}
