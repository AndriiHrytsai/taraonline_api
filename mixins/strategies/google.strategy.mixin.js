'use strict';

const passport = require('passport');
const refreshStrategy = require('passport-oauth2-refresh');
const url = require('url');
const providerName = 'google';
const phoneProviderName = 'google-phone';


/**
 * Handle keys: https://console.developers.google.com/project/express-mongo-boilerplate/apiui/consent
 */
module.exports = {
  methods: {

    registerGoogleStrategy(setting, route) {
      let Strategy;
      try {
        // eslint-disable-next-line global-require
        Strategy = require('passport-google-oauth20').Strategy;
      } catch (error) {
        this.logger.error('The \'passport-google-oauth20\' package is missing. Please install it with \'npm i passport-google-oauth20\' command.');
        return;
      }

      setting = Object.assign({}, {
        scope: 'profile email https://www.googleapis.com/auth/contacts.readonly'
      }, setting);

      const googleStrategy = new Strategy(Object.assign({
        clientID: process.env.GOOGLE_KEY,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT || process.env.API_URL + `/auth/${providerName}/callback`,
        passReqToCallback: true
      }, setting), (req, accessToken, refreshToken, profile, done) => {
        this.logger.info(`Received '${providerName}' social profile: `, profile);

        this.signInSocialUser({
          provider: providerName,
          accessToken,
          refreshToken,
          profile: this.processGoogleProfile(profile),
          socketId: req.query.state || ''
        }, done);
      });

      const googlePhoneStrategy = new Strategy(Object.assign({
        clientID: process.env.GOOGLE_KEY,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_PHONE_REDIRECT || process.env.API_URL + `/auth/${providerName}/phone/callback`,
        passReqToCallback: true
      }, setting), async (req, accessToken, refreshToken, profile, done) => {
        this.logger.info(`Received '${phoneProviderName}' social profile: `, profile);

        const formatProfile = this.processGoogleProfile(profile);
        formatProfile.phoneNumber = decodeURIComponent(req.query.state)

        this.signInPhoneUser({
          provider: phoneProviderName,
          accessToken,
          refreshToken,
          profile: formatProfile,
          phoneNumber: formatProfile.phoneNumber
        }, done);
      });

      passport.use(providerName, googleStrategy);
      passport.use(phoneProviderName, googlePhoneStrategy);
      refreshStrategy.use(providerName, googleStrategy);

      // Create route aliases
      const callback = this.socialAuthCallback(setting, providerName);
      const phoneCallback = this.socialPhoneAuthCallback(setting, phoneProviderName);

      route.aliases[`GET /${providerName}`] = (req, res) => passport.authenticate(providerName, {
        prompt: 'consent',
        accessType: 'offline',
        scope: setting.scope,
        state: this.socketId,
        session: false
      })(req, res);
      route.aliases[`GET /${providerName}/callback`] = (req, res) => passport.authenticate(providerName, {session: false})(req, res, callback(req, res));
      route.aliases[`GET /${providerName}/phone`] = (req, res) => {
        const urlParts = url.parse(req.url, true);
        const query = urlParts.query;
        passport.authenticate(phoneProviderName, {
          prompt: 'consent',
          accessType: 'offline',
          scope: setting.scope,
          state: query.key,
          session: false
        })(req, res);
      }
      route.aliases[`GET /${providerName}/phone/callback`] = (req, res) => passport.authenticate(phoneProviderName, {session: false})(req, res, phoneCallback(req, res));
    },

    processGoogleProfile(profile) {
      const res = {
        provider: profile.provider,
        socialID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      };
      if (profile.emails && profile.emails.length > 0) {
        res.email = profile.emails[0].value;
      }

      if (profile.photos && profile.photos.length > 0) {
        res.avatar = profile.photos[0].value.replace('sz=50', 'sz=200');
      }

      return res;
    }
  }
};
