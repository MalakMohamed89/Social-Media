export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username?: string;
  photo: string;
}

export interface CommentType {
  _id: string;
  content: string;
  image:string,
  commentCreator: CommentCreator;
  post: string;                  // post id
  parentComment: string | null;  // null for a top-level comment
  createdAt?: string;
  likes:string[];
  repliesCount: number;
}


export interface PostType {
  _id: string;
  id: string;
  body: string;
  bookmarked: boolean;
  image:"";
  commentsCount: number;
  createdAt: string;             // ISO date string
  isShare: boolean;
  likes: string[];               // probably user ids
  likesCount: number;
  privacy: "public" | "private" | "following"; // adjust to your API
  sharedPost: PostType | null;       // a shared post is itself a post
  sharesCount: number;
  topComment: CommentType | null; // null when the post has no comments
  user: PostUser;
}


