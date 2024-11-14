const { ApolloServer } = require('@apollo/server');
const schema = require('./graphql/index');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { models, sequelizeInstance } = require('./models/index');
require('./process/index')

const server = new ApolloServer({ schema });

(async () => {
    await sequelizeInstance.sync({});
})();

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: ({ req }) => ({
            req,
            models,
            sequelizeInstance,
        }),
    });

    console.log(`server is ready at:${url}`);
})();

