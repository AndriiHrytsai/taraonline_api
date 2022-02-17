'use strict';

const Cron = require('moleculer-cron');
const moment = require('moment');

module.exports = {
  name: 'product-cron-job',

  mixins: [Cron],

  crons: [
    {
      name: 'deactivate-products-scheduler',
      cronTime: '0 23 * * *',
      onTick: function () {
        console.log('deactivate-products-scheduler ticked: ', moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'));

        this.getLocalService('product-cron-job')
            .actions.deactivateProducts()
            .then(() => {
              console.log('Products deactivated by time!');
            });
      },
      runOnInit: function () {
        console.log('Starting deactivate products scheduler');
      }
    },
    {
      name: 'delete-customers-scheduler',
      cronTime: '0 23 * * *',
      onTick: function () {
        console.log('delete-customers-scheduler ticked: ', moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'));

        this.getLocalService('product-cron-job')
            .actions.deleteCustomers()
            .then(() => {
              console.log('Costumers deleted by time!');
            });
      },
      runOnInit: function () {
        console.log('Starting delete customers scheduler');
      }
    }
  ],

  actions: {
    deactivateProducts: {
      async handler(ctx) {
        const products = await ctx.call('products.allActivatedList');

        if (products?.length) {
          for await (const product of products) {
            await ctx.call('products.deactivate', {_id: product._id});
          }
        }
      }
    },
    deleteCustomers: {
      async handler(ctx) {
        await ctx.call('productCustomers.deleteNotFinishedCustomers');
      }
    }
  }
}
