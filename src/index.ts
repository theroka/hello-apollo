import { readFileSync } from "fs";
import { ApolloServer } from "apollo-server";
import { GraphQLArgument } from "graphql";
import { concat, mergeDeepWith } from "ramda";
import { books } from "./grpc";
import BookResolvers from "./book"
import AuthorResolvers from "./author"

const typeDefs = readFileSync(__dirname + "/schema.gql").toString();

const resolvers = mergeDeepWith(concat, BookResolvers, AuthorResolvers);

console.log(resolvers);

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(s => {
  console.log(`Server ready at ${s.url}`);
  console.log(`Subscriptions ready at ${s.subscriptionsUrl}`);
});
