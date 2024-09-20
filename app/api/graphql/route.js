import { PrismaClient } from '@prisma/client';
import { DateResolver, JSONObjectResolver } from 'graphql-scalars';
import { createSchema, createYoga } from 'graphql-yoga';

const prisma = new PrismaClient();
 
const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
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
            updateUser(
                id: ID!
                groupIds: JSON
                username: String!
                password: String!
                name: String!
                image: String
                email: String
                birthdate: Date
            ): User!
            deleteUser(
                id: ID!
            ): User!
        }
    `,
    resolvers: {
        Date: DateResolver,
    
        JSON: JSONObjectResolver,
    
        Query: {
            users: async () => await prisma.user.findMany(),
            user: async (_, { id }) => await prisma.user.findUnique({ where: { id: Number(id) } }),
        },
    
        Mutation: {
            createUser: async (_, args) => {
                return await prisma.user.create({
                    data: {
                        groupIds: args?.groupIds, 
                        username: args.username, 
                        password: args.password,
                        name: args.name, 
                        image: args?.image, 
                        email: args?.email, 
                        birthdate: args?.birthdate
                    },
                });
            },
            updateUser: async (_, args) => {
                return await prisma.user.update({
                    where: {
                        id: +args.id
                    },
                    data: {
                        groupIds: args?.groupIds, 
                        username: args.username, 
                        password: args.password,
                        name: args.name, 
                        image: args?.image, 
                        email: args?.email, 
                        birthdate: args?.birthdate
                    },
                });
            },
            deleteUser: async (_, args) => {
                return await prisma.user.delete({
                    where: {
                        id: +args.id
                    }
                })
            },
        },
    }
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response }
});
 
export { 
    handleRequest as GET, 
    handleRequest as POST, 
    handleRequest as PATCH, 
    handleRequest as DELETE, 
    handleRequest as OPTIONS 
}