import { mutationField, FieldResolver, stringArg, intArg, arg } from 'nexus';

import { Context } from 'serverTypes';
import { NODE_ENV, HOST } from '../../constants/constants';

import {
  sendLandlordMessageEmail,
  sendTenantMessageEmail,
} from '../../helpers/sendEmail';

export let createPendingConversationResolver: FieldResolver<
  'Mutation',
  'createPendingConversation'
> = async (
  _,
  { brandId, propertyId, matchScore, messageInput, header, receiverEmail },
  context: Context,
) => {
  let userSender = context.tenantUserId
    ? await context.prisma.tenantUser.findOne({
        where: {
          id: context.tenantUserId,
        },
      })
    : context.landlordUserId
    ? await context.prisma.landlordUser.findOne({
        where: {
          id: context.landlordUserId,
        },
      })
    : null;

  if (!userSender) {
    throw new Error('Not Authorized');
  }

  let senderRole = messageInput.senderRole;
  if (
    (senderRole === 'TENANT' && context.landlordUserId) ||
    (senderRole === 'LANDLORD' && context.tenantUserId)
  ) {
    throw new Error('Wrong sender role');
  }

  let propertyOrBrand = context.tenantUserId
    ? await context.prisma.brand.findOne({
        where: { id: brandId },
        include: { tenantUser: true },
      })
    : context.landlordUserId
    ? await context.prisma.property.findOne({
        where: { id: propertyId },
        include: { landlordUser: true },
      })
    : null;

  if (!propertyOrBrand) {
    throw new Error('Property or brand not found!');
  }
  if ('landlordUser' in propertyOrBrand) {
    if (propertyOrBrand.landlordUser.id !== context.landlordUserId) {
      throw new Error('This is not your property');
    }
    let targetBrands = await context.prisma.brand.findMany({
      where: {
        tenantId: brandId,
      },
    });
    if (targetBrands.length) {
      throw new Error('Brand already exist please reload your search');
    }
  } else {
    if (!propertyOrBrand.tenantUser) {
      throw new Error('Tenant not found'); // Note: Brand can have tenant undefinded
    }
    if (propertyOrBrand.tenantUser.id !== context.tenantUserId) {
      throw new Error('This is not your brand');
    }
    let targetProperties = await context.prisma.property.findMany({
      where: {
        propertyId,
      },
    });
    if (targetProperties.length) {
      throw new Error('Property already exist please reload your search');
    }
  }

  let pendingConversationData = {
    matchScore,
    header,
    messageInput,
  };

  let pendingConversation = await context.prisma.pendingConversation.create({
    data: {
      brandId,
      propertyId,
      receiverEmail,
      senderRole,
      pendingConversationData: JSON.stringify(pendingConversationData),
    },
  });

  let emailPendingConvCode = Base64.encodeURI(pendingConversation.id);
  if (NODE_ENV === 'production') {
    senderRole === 'LANDLORD'
      ? sendLandlordMessageEmail(
          {
            email: `${receiverEmail}`,
            name: `Property Landlord`,
          },
          `${HOST}/register-landlord-via-invitation-verification/${emailPendingConvCode}`,
          {
            email: `${userSender.email}`,
            name: `${userSender.firstName} ${userSender.lastName}`,
          },
        )
      : sendTenantMessageEmail(
          {
            email: `${receiverEmail}`,
            name: `Product owner`,
          },
          `${HOST}/register-tenant-via-invitation-verification/${emailPendingConvCode}`,
          {
            email: `${userSender.email}`,
            name: `${userSender.firstName} ${userSender.lastName}`,
          },
        );
  } else {
    // console the verification id so we could still test it on dev environment
    // eslint-disable-next-line no-console
    console.log('Sender:', senderRole, ' Code: ', emailPendingConvCode);
  }

  return 'Email has been sent';
};

export let createPendingConversation = mutationField(
  'createPendingConversation',
  {
    type: 'String',
    args: {
      brandId: stringArg({ required: true }),
      propertyId: stringArg({ required: true }),
      receiverEmail: stringArg({ required: true }),
      matchScore: intArg({ required: true }),
      messageInput: arg({ type: 'MessageInput', required: true }),
      header: stringArg({ required: true }),
    },
    resolve: createPendingConversationResolver,
  },
);
