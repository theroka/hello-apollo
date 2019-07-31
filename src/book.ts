import { GraphQLArgument } from "graphql";
import { concat, mergeDeepWith } from "ramda";
import { books } from "./grpc";
import { pubsub } from "./events";

interface addBookArgs {
  title: string;
  author: string;
}

export interface IBook {
  title: string;
  author: string;
}

const BOOK_ADDED = "BOOK_ADDED";

export const fieldResolvers = {
  Book: {
    author: (book: any) => ({ name: book.author })
  }
};

export const queryResolvers = {
  Query: {
    books: async () =>
      new Promise(resolve => {
        const call = books.getAll();
        let result: Array<IBook> = [];
        call.on("data", (d: IBook) => result.push(d));
        call.on("end", () => {
          console.log(result);
          resolve(result);
        });
      }),
    book: async (_: GraphQLArgument, args: any) =>
      new Promise(resolve => {
        const call = books.getByTitle({ title: args.title });
        let result: Array<IBook> = [];
        call.on("data", (d: IBook) => result.push(d));
        call.on("end", () => {
          console.log(result);
          resolve(result);
        });
      })
  }
};

export const mutationResolvers = {
  Mutation: {
    addBook: async (_: GraphQLArgument, args: any) =>
      new Promise(resolve => {
        const { title, author } = args;
        const { call, res } = books.addBooks();
        res.then((addedBooks: any) => {
          console.log(addedBooks)
          pubsub.publish(BOOK_ADDED, { bookAdded: addedBooks.books[0] })
          resolve(addedBooks.books[0]);
        });
        call.write({ title, author });
        call.end();
      })
  }
};

export const subscriptionResolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    }
  }
};

export default mergeDeepWith(
  concat,
  mergeDeepWith(concat, fieldResolvers, queryResolvers),
  mergeDeepWith(concat, mutationResolvers, subscriptionResolvers)
);
