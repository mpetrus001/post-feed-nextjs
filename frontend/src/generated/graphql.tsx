import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  me?: Maybe<User>;
  users: Array<User>;
  user?: Maybe<User>;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Float'];
  vote?: Maybe<UpVote>;
  creatorId: Scalars['Float'];
  creator: User;
  textSnippet: Scalars['String'];
};

export type UpVote = {
  __typename?: 'UpVote';
  user: User;
  post: Post;
  value: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  createPost: Post;
  registerUser: User;
  loginUser: User;
  logoutUser: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  changePassword: User;
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  postInput: PostInput;
};


export type MutationRegisterUserArgs = {
  userInput: UserInput;
};


export type MutationLoginUserArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  username: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type DefaultPostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'textSnippet' | 'points' | 'creatorId'>
);

export type DefaultUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'User' }
    & DefaultUserFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  postInput: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & DefaultPostFragment
  ) }
);

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'User' }
    & DefaultUserFragment
  ) }
);

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logoutUser'>
);

export type RegisterUserMutationVariables = Exact<{
  userInput: UserInput;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'User' }
    & DefaultUserFragment
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type VoteMutationVariables = Exact<{
  postId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & DefaultUserFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ), vote?: Maybe<(
        { __typename?: 'UpVote' }
        & Pick<UpVote, 'value'>
      )> }
      & DefaultPostFragment
    )> }
  ) }
);

export const DefaultPostFragmentDoc = gql`
    fragment DefaultPost on Post {
  id
  createdAt
  updatedAt
  title
  textSnippet
  points
  creatorId
}
    `;
export const DefaultUserFragmentDoc = gql`
    fragment DefaultUser on User {
  id
  username
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($password: String!, $token: String!) {
  changePassword(password: $password, token: $token) {
    ...DefaultUser
  }
}
    ${DefaultUserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($postInput: PostInput!) {
  createPost(postInput: $postInput) {
    ...DefaultPost
  }
}
    ${DefaultPostFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const LoginUserDocument = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    ...DefaultUser
  }
}
    ${DefaultUserFragmentDoc}`;

export function useLoginUserMutation() {
  return Urql.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
};
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;

export function useLogoutUserMutation() {
  return Urql.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument);
};
export const RegisterUserDocument = gql`
    mutation RegisterUser($userInput: UserInput!) {
  registerUser(userInput: $userInput) {
    ...DefaultUser
  }
}
    ${DefaultUserFragmentDoc}`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($username: String!) {
  resetPassword(username: $username)
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: Int!, $value: Int!) {
  vote(postId: $postId, value: $value)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...DefaultUser
  }
}
    ${DefaultUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...DefaultPost
      creator {
        id
        username
      }
      vote {
        value
      }
    }
  }
}
    ${DefaultPostFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};