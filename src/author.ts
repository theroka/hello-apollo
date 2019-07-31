import { GraphQLArgument } from "graphql";
import { concat, mergeDeepWith } from "ramda";
import { books } from "./grpc";

export const fieldResolvers = {
  Author: {
    books: async (author: {
      name: string;
      books: Array<{ title: string; author: string }>;
    }) =>
      new Promise(resolve => {
        const call = books.getByAuthor({ author: author.name });
        let result: Array<{ title: string; author: string }> = [];
        call.on("data", (d: any) => result.push(d));
        call.on("end", () => {
          console.log(result);
          resolve(result);
        });
      })
  }
};

export const queryResolvers = {
  Query: {
    authors: async () =>
      new Promise(resolve => {
        const call = books.getAll();
        let result = new Set();
        call.on("data", (d: any) => result.add(d.author));
        call.on("end", () => {
          console.log(Array.from(result));
          resolve(Array.from(result).map(name => ({ name })));
        });
      }),

    author: (parent: GraphQLArgument, args: any) => ({ name: args.name })
  }
};

export default mergeDeepWith(concat, fieldResolvers, queryResolvers);
