import { GraphQLUpload } from 'graphql-upload';
import { asNexusMethod } from 'nexus/dist';

export let File = asNexusMethod(GraphQLUpload, 'File');
