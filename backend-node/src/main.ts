import { GraphQLServer } from 'graphql-yoga';
import express from 'express';
import { IncomingMessage } from 'http';
import { ContextParameters } from 'graphql-yoga/dist/types';

import { prisma } from './prisma';
import { schema } from '../src/schema';
import { authSession } from './helpers/auth';
import { permissions } from './middlewares/permission';
import { paymentHandler } from './controllers/paymentHandler';
import { registerTenantHandler } from './controllers/registerTenantController';
import { emailVerificationTenantHandler } from '.DELETED_BASE64_STRING';
import { emailVerificationLandlordHandler } from '.DELETED_BASE64_STRING';
import { registerLandlordHandler } from './controllers/registerLandlordController';
import { emailRegisterLandlordInvitationHandler } from '.DELETED_BASE64_STRING';
import { emailRegisterTenantInvitationHandler } from '.DELETED_BASE64_STRING';

const server = new GraphQLServer({
  schema,
  context: async ({ request }: ContextParameters) => {
    let authorization = request.get('Authorization') || '';
    let token = authorization.replace(/^Bearer /, '');
    let authSessionResult = await authSession(token);
    return {
      prisma,
      ...authSessionResult,
    };
  },
  middlewares: [permissions],
});

server.express.use((_, res, next) => {
  res.setTimeout(500000, () => {
    // call back function is called when request timed out.
  });
  next();
});

server.express.use(
  express.json({
    verify: function(req: IncomingMessage, _res, buf) {
      let url = req.url;
      if (url?.startsWith('/stripe-notify')) {
        req.rawBody = buf;
      }
    },
  }),
);
// This endpoint is used to receive notifications from Stripe
server.express.post('/stripe-notify', paymentHandler);
server.express.get(
  '/register-tenant-verification/:token',
  registerTenantHandler,
);

server.express.get(
  '/register-landlord-verification/:token',
  registerLandlordHandler,
);

server.express.get(
  '/email-tenant-verification/:token',
  emailVerificationTenantHandler,
);

server.express.get(
  '/email-landlord-verification/:token',
  emailVerificationLandlordHandler,
);

server.express.get(
  '/register-landlord-via-invitation-verification/:token',
  emailRegisterLandlordInvitationHandler,
);

server.express.get(
  '/register-tenant-via-invitation-verification/:token',
  emailRegisterTenantInvitationHandler,
);

server.start({}, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:4000`);
});
