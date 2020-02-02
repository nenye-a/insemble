import convertSnakeCaseToCamelCase from './convertSnakeCaseToCamelCase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function camelizeJSON<T extends any>(data: T): T {
    if (
        typeof data === 'string' ||
        typeof data === 'boolean' ||
        typeof data === 'number' ||
        !data
    ) {
        return data;
    } else if (Array.isArray(data)) {
        return data.map((value: T) => camelizeJSON(value));
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newObj: any = {};

        for (let key of Object.keys(data)) {
            let oldKey = key as keyof T;
            let newKey = convertSnakeCaseToCamelCase(key);

            let oldValue = data[oldKey];
            let newValue;

            if (typeof oldValue === 'object') {
                newValue = camelizeJSON(oldValue);
            } else {
                newValue = oldValue;
            }

            newObj = { ...newObj, [newKey]: newValue };
        }
        return newObj;
    }
}
