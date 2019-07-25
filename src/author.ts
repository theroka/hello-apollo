import { GraphQLArgument } from "graphql";
import { books } from "./data";

interface getAuthorByNameArgs {
  name: string;
}

export const queryResolvers = {
  getAuthors: () => {
    return books.map(b => {
      return {
        name: b.author,
        books: books.filter(f => f.author === b.author)
      };
    });
  },

  getAuthorByName: (parent: GraphQLArgument, args: getAuthorByNameArgs) => {
    let r = books.filter(b => b.author === args.name);
    return !r || r.length === 0 ? null : { name: r[0].author, books: r };
  }
};
