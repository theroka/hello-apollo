import { readFileSync } from "fs";
import { ApolloServer } from "apollo-server";
import { mergeAll } from "ramda";
import * as Book from "./book";
import * as Author from "./author";

const typeDefs = readFileSync(__dirname + "/schema.gql").toString();

const resolvers = {
  Query: mergeAll([Book.queryResolvers, Author.queryResolvers]),
  Mutation: mergeAll([Book.mutationResolvers]),
  Subscription: mergeAll([Book.subscriptionResolvers])
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(s => {
  console.log(`Server ready at ${s.url}`)
  console.log(`Subscriptions ready at ${s.subscriptionsUrl}`)
});
