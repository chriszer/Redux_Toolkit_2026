import PostsAuthor from "./PostsAuthor";
import ReactionsButtons from "./ReactionsButtons";
import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";

const PostsExcerpt = ({ postId }: { postId: string }) => {
  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return null;
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostsAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionsButtons post={post} />
    </article>
  );
};

export default PostsExcerpt;
