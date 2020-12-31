# Post-Feed Frontend

This is the frontend for a fullstack post feed built with React, Typescript, and GraphQL. See the backend for the project at [Post-Feed Backend](https://github.com/mpetrus001/post-feed-express).

## Description

Following along with Ben Awad on a fullstack project course that teaches how to build a backend and frontend from scratch then deploy it.

Includes the follow technologies:

- TypeScript
- NodeJS
- PostgreSQL
- MikroORM/TypeORM
- GraphQL
- TypeGraphQL
- Redis
- React
- Next.js
- Chakra
- URQL

A link to the 14 hour video is here [Fullstack React GraphQL TypeScript Tutorial](https://youtu.be/I6ypD7qv3Z8).

## Getting Started

### Developing

1. Make sure that your backend project is running
1. Run the server with auto-reload on file save

```bash
$ yarn dev
```

1. Navigate to http://localhost:4040 to reach the app

### Deploying

1. Make sure that your backend project is running
1. Make sure the env variables are set up in .env.local
1. Build the project into the .next folder

```bash
$ yarn build
```

1. Run the app

```bash
$ yarn start
```

1. Navigate to http://localhost:4040 to reach the app

For me personally, I build the app on my local machine, then use rsync to send the files to my virtual server. Once there, I ssh into the server and run the app.

```bash
$ rsync -avzh ./.next <user>@<host>:<target-directory>
```

### GraphQL

The workflow for creating a new GraphQL Query/Mutation goes like this:

1. Use the Playground to layout the operation
1. Add the operation to a \*.graphql file in the graphql directory
1. run the generator

```bash
$ yarn gen
```

1. Use the operation hook (with types) in the generated directory

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
