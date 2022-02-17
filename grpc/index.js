'use strict';
const { GrpcService } = require('moleculer-grpc-api');

module.exports = GrpcService({

  // Directory with you .proto files
  directory: `${__dirname}/protos`,

  // gRPC port. Default: 50051
  port: '',

  // List of actions available. ${protoPackage}.${protoService}/${serviceName}: ${moleculerService}.${moculerAction}
  aliases: {
  },

  // Authentication action to populate ctx.user using header
  authentication: {
    action: 'user.currentUser',
    params: {
      accessToken: 'Authorization'
    }
  }
});
