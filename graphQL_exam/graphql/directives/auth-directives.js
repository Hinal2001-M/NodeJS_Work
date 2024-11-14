const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver, GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { Error } = require('sequelize');
require('dotenv').config();

function authenticationDirective(schema, directiveName) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

            
            if (authDirective) {
                const { resolve = defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async function (source, args, context) {
                    const token = context.req.headers?.authorization;
                    if (!token) {
                        const error = new GraphQLError('authentication failed', {
                            extensions: {
                                code: 'AUTH_FAILED',
                                http: {
                                    status: 401,
                                },
                            },
                        });
                        return error;
                    }
                    const decoded = jwt.verify(token, process.env.jwt_key);
                    context.user = decoded;
                    return resolve(source, args, context);
                };
            }
        },
    });
}

module.exports = authenticationDirective;