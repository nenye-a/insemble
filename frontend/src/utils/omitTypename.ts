export default function omitTypename<T extends ObjectKey>(data: Array<T>) {
  return data.map((item) => {
    if (item.hasOwnProperty('__typename')) {
      let { __typename, ...otherEntries } = item;
      return { ...otherEntries };
    }
    return item;
  });
}
