import { defineConfig } from 'sanity';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
    name: 'default',
    title: 'RSL/A',
    projectId: 'yz25oyux',
    dataset: 'production',
    plugins: [codeInput()],
    schema: {
        types: schemaTypes,
    },
});
