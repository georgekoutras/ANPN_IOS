import Utils from './utils.js'
import Logger from './logger.js'
import Config from './config.js'

const BaseUrl = Config.ApiClient.BaseUrl;

const mapUser = (item) => {
    return {
        accountId: item.account_id,
        patientId: item.patient_id,
        fullName: item.full_name,
        userRole: item.role,

        isAdmin: (item.role == 'administrator'),
        isDoctor: (item.role == 'doctor'),
        isPatient: (item.role == 'patient')
    };
}

const mapQuestion = (item) => {
    return {
        id: item.id,
        text: item.text,
        label: item.label,
        parentId: item.parent_id
    };
}

const mapDailyReport = (item) => {
    //console.log("mapDailyReport:::"+JSON.stringify(item));
    let _date = ApiClient._createDate(item.date);

    return {
        id: item.id,
        accountId: item.accountId,
        date: _date,

        dateStr: Utils.formatDate(_date),
        timeStr: Utils.formatTime(_date, '.'),
        monthYear: Utils.monthName(_date) + ' ' + _date.getFullYear()
    };
}

const mapNotification = (item) => {
    let _date = ApiClient._createDate(item.created_at);

    return {
        id: item.id,
        accountId: item.account_id,
        date: _date,
        type: item.type,
        msg: item.notification_message,

        dateStr: Utils.formatDate(_date),
        monthYear: Utils.monthName(_date) + ' ' + _date.getFullYear()
    };
}

const mapPatient = (item) => {
    //console.log("mapPatient:::"+JSON.stringify(item));
    let _date = ApiClient._createDate(item.birth_date);

    return {
        id: item.id,
        accountId: item.account_id,
        firstName: item.first_name,
        lastName: item.last_name,
        fullName: item.full_name,

        amka: item.social_id,
        birthDate: _date,
        //remarks: item.remarks,

        email: item.email,
        mobile: item.mobile
    };
}

const ApiClient = {

    //generic method
    sendRequest: (method, url, data, onSuccess, onError) => {
        //console.log("sendRequest: " + url + ", token: " + ApiClient._accessToken);

        return Utils.fetchJson(
            method,
            BaseUrl + url,
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "access-token": ApiClient._accessToken
                },
                onSuccess: (result) => {
                    //console.log("result: "+JSON.stringify(result));

                    if (result.success) {
                        onSuccess(result.data);
                    }
                    else {
                        //if caller provides the onError, he is fully responsible for handling error, thus we return
                        if (onError) {
                            onError(result.error);
                            return;
                        }

                        if (!result.error) {
                            Utils.alertBox("Server Error");
                            return;
                        }

                        var errorMsg = result.error.message;
                        //console.log("result.error.code: " + result.error.code);
                        //console.log("result.error: " + errorMsg);

                        if (result.error.code == 498) {
                            //refresh token
                            ApiClient.refreshToken(() => {
                                ApiClient.sendRequest(method, url, data, onSuccess); //resend request
                            });
                        }
                        else if (result.error.code == 499) {
                            var msg = "Login session timed-out. You must sign-out and sign-in again.";
                            Utils.alertBox(msg, null, () => {
                                //TODO: goto login -> how???
                            });
                        }
                        else {
                            var msg = "Server Error.\n[" + result.error.code + ": " + errorMsg + "]";
                            Utils.alertBox(msg);
                        }
                    }
                }
            }
        );
    },

    //could be out of ApiClient
    _setTokens: (data) => {
        ApiClient._accessToken = data.access_token;
        ApiClient._refreshToken = data.refresh_token;
        
        let apiTokens = {
            accessToken: ApiClient._accessToken,
            refreshToken: ApiClient._refreshToken,
            deviceToken: ApiClient._deviceToken
        };
        Utils.storeItem("apiTokens", JSON.stringify(apiTokens), "");
    },
    _clearTokens: () => {
        ApiClient._accessToken = "";
        ApiClient._refreshToken = "";
        
        Utils.clearItem("apiTokens", "");
    },
    _totalPages: (total, limit) => {
        return (total == 0) ? 1 : Math.ceil(total / limit); //round up
    },

    _createDate: (dateStr) => {
        let _date = new Date(dateStr.replace(" ","T"));
        _date = new Date(_date.getTime() + (_date.getTimezoneOffset() * 60000)); //server returns in GR TimeZone
        return _date;
    },

    pageLimit: 50, //hard-coded
    _accessToken: "",
    _refreshToken: "",
    _deviceToken: "",

    validateUser: async (username, password) => {
        var res = "Login failed"; //assume fail by default, since empty means success
        var userInfo = {};

        //validate
        await ApiClient.sendRequest(
            "POST",
            "login",
            "email=" + username + "&password=" + password,
            (data) => {
                ApiClient._setTokens(data);

                res = ""; //empty means success
                userInfo = mapUser(data);
            },
            (error) => {
                res = error?.message || "Login Error";
            }
        );

        //onSuccess(res); //if ever needed
        return { res, userInfo };
    },

    refreshToken: (onSuccess) => {
        return ApiClient.sendRequest(
            "POST",
            "refresh",
            "access_token=" + ApiClient._accessToken + "&refresh_token=" + ApiClient._refreshToken,
            (data) => {
                ApiClient._setTokens(data);

                onSuccess();
            }
        );
    },

    logout: () => {
        return ApiClient.sendRequest(
            "POST",
            "logout",
            "access_token=" + ApiClient._accessToken + "&device_token=" + ApiClient._deviceToken,
            (data) => {
                ApiClient._clearTokens();

                //onSuccess(); //if ever needed
            },
            (error) => {
                //ignore any error
                Logger.info("Logout Error: " + error?.message); //TODO ???
            }
        );
    },

    deviceToken: (accId, token, type) => {
        //device_token/{account_id}
        return ApiClient.sendRequest(
            "POST",
            "device_token/" + accId,
            "device_token=" + token + "&device_type=" + type,
            (data) => {
                //console.log("device_token=" + token + "&device_type=" + type);
                ApiClient._deviceToken = token;
                //onSuccess(); //if ever needed
            }
        );
    },

    questions: (onSuccess) => {
        //reports/questions
        return ApiClient.sendRequest(
            "GET",
            "reports/questions",
            null,
            (data) => {
                var res = [];

                if (data) {
                    data.forEach((item) => {
                        res.push(mapQuestion(item));
                    });
                }

                onSuccess(res);
            }
        );
    },

    dailyReports: (patId, from, to, page, onSuccess) => {
        var limit = ApiClient.pageLimit;

        var offset = (page === null) ? 0 : (page - 1) * limit;
        var paging = (page === null) ? 0 : 1;

        //patients/{patient_id}/reports?...
        return ApiClient.sendRequest(
            "GET",
            "patients/" + patId + "/reports?pagination=" + paging + "&offset=" + offset + "&limit=" + limit,
            null,
            (data) => {
                var _total = data?.total ?? 0;
                var res = {
                    total: _total,
                    rows: [],
                    totalPages: ApiClient._totalPages(_total, limit)
                };

                if (data?.rows) {
                    data.rows.forEach((item) => {
                        res.rows.push(mapDailyReport(item));
                    });
                }

                onSuccess(res);
            }
        );
    },

    submitDailyReport: (patId, params, onSuccess) => {
        //patients/{patient_id}/reports
        return ApiClient.sendRequest(
            "POST",
            "patients/" + patId + "/reports",
            params,
            (data) => {
                onSuccess();
            }
        );
    },

    loadDailyReport: (patId, repId, onSuccess) => {
        //patients/{patient_id}/reports/{daily_report_id}
        return ApiClient.sendRequest(
            "GET",
            "patients/" + patId + "/reports/" + repId,
            null,
            (data) => {
                //on purpose no mapping here, since its quite trivial
                onSuccess(data);
            }
        );
    },

    hasDailyReport: (patId, onSuccess) => {
        //patients/{patient_id}/reports
        return ApiClient.sendRequest(
            "GET",
            "patients/" + patId + "/has_report",
            null,
            (data) => {
                onSuccess(data);
            }
        );
    },

    notifications: (accId, from, to, page, onSuccess) => {
        var limit = ApiClient.pageLimit;

        var offset = (page === null) ? 0 : (page - 1) * limit;
        var paging = (page === null) ? 0 : 1;

        //notifications/{account_id}?...
        return ApiClient.sendRequest(
            "GET",
            "notifications/" + accId + "?pagination=" + paging + "&offset=" + offset + "&limit=" + limit,
            null,
            (data) => {
                var _total = data?.total ?? 0;
                var res = {
                    total: _total,
                    rows: [],
                    totalPages: ApiClient._totalPages(_total, limit)
                };

                if (data?.rows) {
                    data.rows.forEach((item) => {
                        res.rows.push(mapNotification(item));
                    });
                }

                onSuccess(res);
            }
        );
    },

    patients: (accId, search, page, onSuccess) => {
        var limit = ApiClient.pageLimit;

        var offset = (page === null) ? 0 : (page - 1) * limit;
        var paging = (page === null) ? 0 : 1;

        //patients?...
        return ApiClient.sendRequest(
            "GET",
            "patients?pagination=" + paging + "&offset=" + offset + "&limit=" + limit + "&search=" + search,
            null,
            (data) => {
                var _total = data?.total ?? 0;
                var res = {
                    total: _total,
                    rows: [],
                    totalPages: ApiClient._totalPages(_total, limit)
                };

                if (data?.rows) {
                    data.rows.forEach((item) => {
                        res.rows.push(mapPatient(item));
                    });
                }

                onSuccess(res);
            }
        );
    },
}

export default ApiClient;