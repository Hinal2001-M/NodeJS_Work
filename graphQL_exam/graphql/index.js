const fs = require('fs');
const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const directives = require('./directives/index');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const resolversArray = loadFilesSync(path.join(__dirname, 'resolvers'));
const resolvers = mergeResolvers(resolversArray);

let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

Object.keys(directives).forEach((name) => {
    schema = directives[name](schema, name);
});

module.exports = schema;