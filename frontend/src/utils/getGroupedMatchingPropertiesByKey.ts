import { TenantMatches_tenantMatches_matchingProperties as MatchingProperties } from '../generated/TenantMatches';

export default function getGroupedMatchingPropertiesByKey(
  data: Array<MatchingProperties>,
  key: keyof MatchingProperties
) {
  let mappedKey = new Map();
  data.forEach((item) => {
    let { spaceId, ...otherProperties } = item;
    let existingData = mappedKey.get(item[key]);
    if (existingData) {
      existingData = {
        ...existingData,
        spaceIds: [...existingData.spaceIds, spaceId],
      };
    } else {
      existingData = {
        ...otherProperties,
        spaceIds: [spaceId],
      };
    }
    mappedKey.set(existingData[key], existingData);
  });
  return [...mappedKey.values()];
}
