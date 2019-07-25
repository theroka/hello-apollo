# hello-apollo

Small example for setting up an GraphQL server with Apollo unsing TypeScript, Gulp, GraphQL und Apollo Server.

To install dependencies
```
yarn install
```

To build project
```
yarn gulp
```
Runs gulp default task through node_modules/.bin/gulp.
Output is written to ./build

Run server with
```
node build/index.js
```
Runs webserver on localhost:4000.
Open your browser to access Apollos GraphQL playground.

# Queries and Mutations

+ getBooks
+ getAuthors
+ getAuthorByName (name: string)
+ addBook (title: string, author: string)
