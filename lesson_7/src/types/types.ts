export type Post = {
  id: string;
  title: string;
  body: string;
  date: string;
  userId: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
};

export type Reactions = {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
};

export type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type NewPost = {
  title: string;
  body: string;
  userId: number;
};

export type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
};

export type ReactionName = keyof Reactions;
