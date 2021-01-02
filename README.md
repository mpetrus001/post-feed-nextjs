# Post-Feed Frontend

The frontend for a fullstack post feed built with React, Typescript, and GraphQL. A running example can be seen at [Post-Feed](https://post-feed.petrusprojects.com).

## Description

The project is a feed of posts with a GraphQL API. A user can sign in using a username and password which generates a secure token. With that token/cookie, the home page will show the user's current upvotes and downvotes; votes can be changed by selecting the alternate arrow. A user can edit or delete their own posts by clicking the post title, and selecting edit post. The changes are reflected on the home page. The home page can be "infintely" scrolled by clicking load more on the bottom; this is achieved with cursor-pagination.

The frontend is a NextJS app written in typescript using the URQL Graphql library. Some pages are rendered on the server to improve response times. The ui is based on the Chakra-UI library. Some features, including user registration and password reset have been disabled for security reasons.

A backend using Express with Apollo has been built; see [Post-Feed Backend](https://github.com/mpetrus001/post-feed-express) for more details.

The project started by completing the Fullstack React GraphQL TypeScript Tutorial by Ben Awad. Completion of the tutorial resulted in an API server about 90% ready. Additional features were added to the server and the project was "dockerized" for deployment.

The project includes the follow technologies: TypeScript, NodeJS, PostgreSQL, TypeORM, GraphQL, TypeGraphQL, Redis, React, Next.js, Chakra, URQL, Docker, and Docker-Compose.

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
