import { GraphQLArgument } from "graphql";
import { books } from "./data";

interface addBookArgs {
  title: string;
  author: string;
}

export const queryResolvers = {
  getBooks: () => books
};

export const mutationResolvers = {
  addBook: async (_: GraphQLArgument, args: addBookArgs) => {
    const { title, author } = args;
    let book = { title, author };
    books.push(book);
    return { title, author };
  }
};
