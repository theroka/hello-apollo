import caller from "grpc-caller";

export const books = caller(
  "localhost:50001",
  __dirname + "/Books.proto",
  "Books"
);
