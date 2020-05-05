import { mutationField, FieldResolver, stringArg, floatArg, arg } from 'nexus';

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
  {
    brandId,
    spaceId,
    matchScore,
    messageInput,
    header,
    receiverContact,
    brandInfo,
  },
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

  let spaceOrBrand = context.tenantUserId
    ? await context.prisma.brand.findOne({
        where: { id: brandId },
        include: { tenantUser: true },
      })
    : context.landlordUserId
    ? await context.prisma.space.findOne({
        where: { id: spaceId },
        include: { property: { include: { landlordUser: true } } },
      })
    : null;

  if (!spaceOrBrand) {
    throw new Error('Space or brand not found!');
  }
  if ('tenantUser' in spaceOrBrand) {
    if (!spaceOrBrand.tenantUser) {
      throw new Error('Tenant not found'); // Note: Brand can have tenant undefinded
    }
    if (spaceOrBrand.tenantUser.id !== context.tenantUserId) {
      throw new Error('This is not your brand');
    }
    let targetSpace = await context.prisma.space.findOne({
      where: {
        spaceId,
      },
    });
    if (targetSpace) {
      throw new Error('Space already exist please reload your search');
    }
  } else {
    if (!spaceOrBrand.property) {
      throw new Error('Property not found or delete or disconected from space');
    }
    if (spaceOrBrand.property.landlordUser.id !== context.landlordUserId) {
      throw new Error('This is not your property');
    }
  }

  let pendingConversationData = {
    matchScore,
    header,
    messageInput,
    brandInfo,
  };

  let pendingConversation = await context.prisma.pendingConversation.create({
    data: {
      brandId,
      spaceId,
      receiverContact: JSON.stringify(receiverContact),
      senderRole,
      pendingConversationData: JSON.stringify(pendingConversationData),
    },
  });

  let emailPendingConvCode = Base64.encodeURI(pendingConversation.id);
  if (NODE_ENV === 'production') {
    senderRole === 'LANDLORD'
      ? sendLandlordMessageEmail(
          {
            email: `${receiverContact.email}`,
            name: `${receiverContact.name}`,
          },
          `${HOST}/register-landlord-via-invitation-verification/${emailPendingConvCode}`,
          {
            email: `${userSender.email}`,
            name: `${userSender.firstName} ${userSender.lastName}`,
          },
        )
      : sendTenantMessageEmail(
          {
            email: `${receiverContact.email}`,
            name: `${receiverContact.name}`,
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
      spaceId: stringArg({ required: true }),
      brandInfo: arg({ type: 'BrandInfoInput' }),
      receiverContact: arg({ type: 'ReceiverContactInput', required: true }),
      matchScore: floatArg({ required: true }),
      messageInput: arg({ type: 'MessageInput', required: true }),
      header: stringArg({ required: true }),
    },
    resolve: createPendingConversationResolver,
  },
);
