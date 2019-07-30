import { GraphQLArgument } from "graphql";
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

export const queryResolvers = {
  getBooks: () =>
    new Promise(resolve => {
      const call = books.getAll();
      let result: Array<IBook> = [];
      call.on("data", (d: IBook) => result.push(d));
      call.on("end", () => resolve(result));
    })
};

export const mutationResolvers = {
  addBook: async (_: GraphQLArgument, args: addBookArgs) =>
    new Promise(resolve => {
      const { title, author } = args;
      const { call, res } = books.addBooks();
      res.then((addedBooks: any) => {
        pubsub.publish(BOOK_ADDED, { bookAdded: addedBooks[0] })
        resolve(addedBooks[0])
      });
      call.write({ title, author });
      call.end();
    })
};

export const subscriptionResolvers = {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
  }
};
