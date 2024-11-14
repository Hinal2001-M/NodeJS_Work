const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver, GraphQLError } = require('graphql');
const { getGraphQLRateLimiter } = require('graphql-rate-limit');
const rateLimiter = getGraphQLRateLimiter({ identifyContext: (ctx) => ctx.req.ip });

function rateLimiterDirective(schema, directiveName) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const limitDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
            if (limitDirective) {
                const { resolve = defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    const error = await rateLimiter({
                        parent: null, args, context, info,
                    }, {
                        max: 2, window: '5s',
                    });
                    if (error) {
                        const error = new GraphQLError('so many Requests', {
                            extensions: {
                                http: {
                                    status: 401,
                                },
                            },
                        });
                        return error;
                    }
                    return resolve(source, args, context, info);
                };
            }
        },
    });
}

module.exports = rateLimiterDirective;