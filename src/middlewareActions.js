const bodyParser = require('body-parser');
const cookieSection = require('cookie-session');

module.exports = function (app) {
    app.use(cookieSection({
        name: 'node-app-session',
        keys: ['secret-application-session-key'],
        maxAge: 30 * 24 * 60 * 60 * 1000
    }));

    app.set('trust proxy', 1);
    app.set('views engine', 'ejs');

    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '3mb' }));

    app.use((req, res, next) => {
        const isAuthPage = req.url.indexOf('/login') !== -1 || req.url.indexOf('/sign-up') !== -1;

        if ((!req.session || !req.session.userInfo) && !isAuthPage) {
            res.redirect('/login');

            return;
        }

        next();
    });
};
