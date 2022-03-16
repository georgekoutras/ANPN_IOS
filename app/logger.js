import * as Sentry from 'sentry-expo';

import Config from './config.js'

const Logger = {
    init: () => {
        Sentry.init({
            dsn: Config.Sentry.dsn,
            enableInExpoDevelopment: true,
            debug: false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
            release: Config.Sentry.release
        });
    },
    info: (msg) => {
        console.log(msg)
        Sentry.Native.captureMessage(msg)
    },
    error: (msg) => {
        console.error(msg)
        Sentry.Native.captureException(new Error(msg))
    }
}

export default Logger;