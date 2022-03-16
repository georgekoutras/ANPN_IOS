const Config = {
    ApiClient: {
        BaseUrl: "https://panel.anapneo.eu/api/"
    },
    
    Sentry: {
        dsn: "https://109c4f8176d34c5794af5705329fa51e@o645276.ingest.sentry.io/5758680",
        release: "anapneo@" + global.version //must be the same as in app.json
    }
}

export default Config;