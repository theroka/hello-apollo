import { GraphQLArgument } from "graphql";
import { books } from "./grpc";
import { IBook } from "./book";

interface getAuthorByNameArgs {
  name: string;
}

export const queryResolvers = {
  getAuthors: () =>
    new Promise(resolve => {
      const call = books.getAll();
      let result: Array<IBook> = [];
      call.on("data", (d: IBook) => result.push(d));
      call.on("end", () => {
        resolve(
          result.map(r => ({
            name: r.author,
            books: result.filter(f => f.author === r.author)
          }))
        );
      });
    }),

  getAuthorByName: (parent: GraphQLArgument, args: getAuthorByNameArgs) =>
    new Promise(resolve => {
      const call = books.getByAuthor({ author: args.name });
      let result: Array<IBook> = [];
      call.on("data", (d: IBook) => result.push(d));
      call.on("end", () => {
        resolve({
          name: args.name,
          books: result
            .filter(f => f.author === args.name)
            .map(b => ({ title: b.title, author: b.author }))
        });
      });
    })
};
