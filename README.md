# Post-Feed Frontend

A fullstack post feed built with React, Typescript, and GraphQL.

## Description

Following along with Ben Awad on a fullstack project course that teaches you how to build a backend and frontend from scratch then deploy it.

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
- URQL/Apollo

A link to the 14 hour video is here [Fullstack React GraphQL TypeScript Tutorial](https://youtu.be/I6ypD7qv3Z8).

## Getting Started

### Developing

<!-- 1. Start the database

```bash
$ docker-compose up
```

1. Run typescript in watch mode

```bash
$ yarn watch
``` -->

1. Run the server with auto-reload on file save

```bash
$ yarn dev
```

1. Navigate to http://localhost:3000 to reach the app

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
