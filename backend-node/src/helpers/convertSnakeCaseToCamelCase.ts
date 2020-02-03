export default function convertSnakeCaseToCamelCase(text: string) {
    return text.replace(/([-_][a-z])/gi, (groupMatched) => {
        return groupMatched
            .toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
}
