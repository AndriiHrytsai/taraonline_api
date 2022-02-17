'use strict';

const PassportMixin 	= require('../mixins/passport.mixin');

module.exports = PassportMixin({
  routePath: '/auth',
  localAuthAlias: 'v1.accounts.login',
  successRedirect: '/',
  cookies: false,
  authCookieName: 'authToken',
  userDataCookieName: 'userData',
  providers: {
    google: process.env.GOOGLE_KEY && process.env.GOOGLE_SECRET,
    facebook: false,
    github: false,
    twitter: false
  }
})
