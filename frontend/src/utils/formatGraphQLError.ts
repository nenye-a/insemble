let graphqlHeader = 'GraphQL error: ';

export default function(message: string) {
  return message.replace(graphqlHeader, '');
}
