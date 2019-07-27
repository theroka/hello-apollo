import { GraphQLArgument } from "graphql";
import { pubsub } from "./events"
import { books } from "./data";

interface addBookArgs {
  title: string;
  author: string;
}

const BOOK_ADDED = "BOOK_ADDED"

export const queryResolvers = {
  getBooks: () => books
};

export const mutationResolvers = {
  addBook: async (_: GraphQLArgument, args: addBookArgs) => {
    const { title, author } = args;
    let book = { title, author };
    books.push(book);
    pubsub.publish(BOOK_ADDED, { bookAdded: book })
    return book;
  }
};

export const subscriptionResolvers = {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator([ BOOK_ADDED ])
  }
}
