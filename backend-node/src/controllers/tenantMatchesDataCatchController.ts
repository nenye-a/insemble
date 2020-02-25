import { Request, Response } from 'express';

import { prisma } from '../prisma';
import { TenantMatchesType } from 'dataTypes';

export let tenantMatchesDataHandler = async (req: Request, res: Response) => {
  let {
    brand_id: brandId,
    matching_locations: newMatchingLocations,
    matching_properties: rawMatchingProperties,
  }: TenantMatchesType & { brand_id: string } = req.body;
  let newMatchingProperties = rawMatchingProperties?.map(
    ({ property_id: propertyId, ...other }) => {
      return { propertyId, ...other };
    },
  );
  let brand = await prisma.brand.update({
    data: {
      matchingLocations: JSON.stringify(newMatchingLocations),
      matchingProperties: { create: newMatchingProperties },
    },
    where: {
      id: brandId,
    },
  });
  if (brand) {
    res.status(200).json({
      message: 'Brand has been updated',
    });
  } else {
    res.status(500).json({
      message: 'Update brand failed',
    });
  }
};
