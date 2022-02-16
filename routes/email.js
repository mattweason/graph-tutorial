const router = require('express-promise-router')();
const graph = require('../graph.js');
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const { body, validationResult } = require('express-validator');
const validator = require('validator');

/* GET /calendar */
router.get('/',
    async function(req, res) {
        if (!req.session.userId) {
            // Redirect unauthenticated requests to home page
            res.redirect('/')
        } else {
            const params = {
                active: { email: true }
            };

            // Get the user
            const user = req.app.locals.users[req.session.userId];

            try {
                // Get the messages
                const messages = await graph.getEmailView(
                    req.app.locals.msalClient,
                    req.session.userId
                )

                // Assign the events to the view parameters
                params.messages = messages.value;
            } catch (err) {
                req.flash('error_msg', {
                    message: 'Could not fetch events',
                    debug: JSON.stringify(err, Object.getOwnPropertyNames(err))
                });
            }

            res.render('email', params);
        }
    }
);

module.exports = router;