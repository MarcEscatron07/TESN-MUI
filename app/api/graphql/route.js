import { PrismaClient } from '@prisma/client';
import { gql } from 'graphql-tag';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-micro';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

const prisma = new PrismaClient();

// Define GraphQL schema
const typeDefs = gql`
  scalar Date
  scalar JSON

  type User {
    id: ID!
    groupIds: JSON
    username: String!
    password: String!
    name: String!
    image: String
    email: String
    birthdate: Date
    createdAt: Date
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(
        groupIds: JSON
        username: String!
        password: String!
        name: String!
        image: String
        email: String
        birthdate: Date
    ): User!
  }
`;

function parseObject(ast) {
    const value = Object.create(null);
    ast.fields.forEach(field => {
      value[field.name.value] = parseLiteral(field.value);
    });
    return value;
}

// Define GraphQL resolvers
const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Custom scalar type for Date',
        serialize(value) {
            return value.toISOString(); // Convert outgoing Date to ISO string
        },
        parseValue(value) {
            return new Date(value); // Convert incoming ISO string to Date
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
            return new Date(ast.value); // Convert hard-coded AST string to Date
            }
            return null;
        },
    }),

    JSON: new GraphQLScalarType({
        name: 'JSON',
        description: 'Custom scalar type for JSON',
        serialize(value) {
            return value; // Assume value is already a JSON object
        },
        parseValue(value) {
            return value; // Parse the incoming value as JSON
        },
        parseLiteral(ast) {
            switch (ast.kind) {
            case Kind.OBJECT:
                return parseObject(ast);
            default:
                return null;
            }
        },
    }),

    Query: {
        users: async () => await prisma.user.findMany(),
        user: async (_, { id }) => await prisma.user.findUnique({ where: { id: Number(id) } }),
    },

    Mutation: {
        createUser: async (_, { 
            groupIds, 
            username, 
            password, 
            name, 
            image, 
            email, 
            birthdate 
        }) => {
            return await prisma.user.create({
                data: {
                    groupIds, 
                    username, 
                    password, 
                    name, 
                    image, 
                    email, 
                    birthdate
                },
            });
        },
    },
};

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(request) {
    return handler(request);
}

export async function POST(request) {
    return handler(request);
}

export async function PATCH(request) {
    return handler(request);
}

export async function DELETE(request) {
    return handler(request);
}

export const config = {
    api: {
        bodyParser: false,
    },
};