import { prisma } from '../../src/prisma';
import axios from 'axios';
import { LEGACY_API_URI } from '../../src/constants/host';

const testUserEmail = ['DELETED_EMAIL', 'DELETED_EMAIL'];
async function deleteTestUser() {
  let tenantUser = await prisma.tenantUser.findMany({
    where: { email: { in: testUserEmail } },
    include: { brands: true },
  });
  let landlordUser = await prisma.landlordUser.findMany({
    where: { email: { in: testUserEmail } },
    include: {
      properties: { include: { space: true } },
    },
  });
  for (let tUser of tenantUser) {
    for (let brand of tUser.brands) {
      await prisma.location.deleteMany({
        where: { brand: { id: brand.id } },
      });
      await prisma.conversation.deleteMany({
        where: { brand: { id: brand.id } },
      });
      await prisma.brand.delete({
        where: {
          id: brand.id,
        },
      });
    }
    await prisma.subscriptionTenantHistory.deleteMany({
      where: {
        tenantUser: { id: tUser.id },
      },
    });
    await prisma.tenantSession.deleteMany({
      where: {
        user: { id: tUser.id },
      },
    });
    await prisma.tenantEmailVerification.deleteMany({
      where: {
        user: { id: tUser.id },
      },
    });
    await prisma.tenantResetPasswordVerification.deleteMany({
      where: {
        user: { id: tUser.id },
      },
    });
    await prisma.tenantUser.delete({
      where: { id: tUser.id },
    });
  }
  for (let lUser of landlordUser) {
    for (let property of lUser.properties) {
      let pyPropertyId = property.propertyId;

      if (pyPropertyId) {
        let resultStatus = (
          await axios.delete(
            `${LEGACY_API_URI}/api/propertyTenants/${pyPropertyId}`,
          )
        ).status;
        if (resultStatus !== 304 && resultStatus !== 200) {
          throw new Error('Cannot delete property!');
        }
      }
      let spaces = property.space;
      for (let space of spaces) {
        await prisma.conversation.deleteMany({
          where: { space: { id: space.id } },
        });
        await prisma.space.delete({
          where: {
            id: space.id,
          },
        });
      }

      await prisma.property.delete({
        where: {
          id: property.id,
        },
      });
    }
    await prisma.subscriptionLandlordHistory.deleteMany({
      where: {
        landlordUser: { id: lUser.id },
      },
    });
    await prisma.landlordEmailVerification.deleteMany({
      where: {
        user: { id: lUser.id },
      },
    });
    await prisma.landlordResetPasswordVerification.deleteMany({
      where: {
        user: { id: lUser.id },
      },
    });
    await prisma.landlordSession.deleteMany({
      where: {
        user: { id: lUser.id },
      },
    });
    await prisma.landlordUser.delete({
      where: {
        id: lUser.id,
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log('finished');
}

deleteTestUser().then(() => {
  process.exit(0);
});
