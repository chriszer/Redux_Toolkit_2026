import { useAppSelector } from "../../app/hooks";
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
  const orderedPostIds = useAppSelector(selectPostIds);
  const postStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostsError);

  let content;

  if (postStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (postStatus === "succeeded") {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
