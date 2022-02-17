'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');
const {MoleculerClientError} = require('moleculer').Errors;

const { FrontSettings } = require('../graphql/types/frontSettings');
const { frontSettings } = require('../graphql/queries/frontSettings');
const { updateFrontSettings } = require('../graphql/mutations/frontSettings');
const { frontSettingsUpdated } = require("../graphql/subscriptions/frontSettings");

const {schema, fields} = require('../models/frontSettings')
const _ = require("lodash");

module.exports = {
    name: 'frontSettings',

    /**
     * Mixins
     */
    mixins: [DbMixin('frontSettings'), AuthMixin],

    /**
     * Settings
     */
    settings: {
        entityName: 'frontSettings',
        // Available fields in the responses
        fields: fields,
        // Validator for the `create` & `insert` actions.
        entityValidator: schema,
        entityRevisions: true,
        graphql: {
            type: [FrontSettings]
        }
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        update: {
            graphql: {
                mutation: updateFrontSettings
            },
            async handler(ctx) {
                const { data } = ctx.params;
                const userId = ctx?.meta?.user?._id;
                const userRole = ctx?.meta?.user?.role;

                let result = null

                if (userRole === 'admin') {
                    const items = await this.adapter.find()
                    result = await this.adapter.updateById(items[0]._id, { ...data, modifiedAt: new Date(), modifiedBy: userId });
                } else {
                    throw new MoleculerClientError('User not have permission for this action!', 403, 'FORBIDDEN');
                }

                return result
            }
        },
        read: {
            graphql: {
                query: frontSettings
            },
            async handler(ctx) {
                const items = await this.adapter.find()
                return items[0]
            }
        },
        settingsUpdatedSub: {
            graphql: {
                subscription: frontSettingsUpdated,
                tags: ['settingsUpdatedSub']
            },
            handler(ctx) {
                return ctx.params.payload
            }
        },
    },


    /**
     * Action Hooks
     */
    hooks: {
        before: {},
        after: {
            async update(ctx, res) {
                await ctx.broadcast('graphql.publish', {
                    tag: 'settingsUpdatedSub',
                    payload: res
                });
                return res;
            },
        }
    },

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {
        /**
         * Loading sample data to the collection.
         * It is called in the DB.mixin after the database
         * connection establishing & the collection is empty.
         */
        async seedDB() {
            const DATE = new Date();
            await this.adapter.insertMany([
                {
                    enabledRegistration: true,
                    enabledLogin: true,
                    modifiedBy: this.settings.systemAccountCode,
                    modifiedAt: DATE,
                }
            ]);
        }
    },

    /**
     * Fired after database connection establishing.
     */
    async afterConnected() {
        /**
         * Create necessary indexes
         */
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
    }
};
