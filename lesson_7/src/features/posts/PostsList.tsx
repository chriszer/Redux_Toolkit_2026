import { useAppSelector } from "../../app/hooks";
import { selectPostIds } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "./postsSlice";

const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const orderedPostIds = useAppSelector(selectPostIds);

  let content;

  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = (
      <p>
        {error ? String("status" in error ? error.status : error) : "Error"}
      </p>
    );
  }

  return <section>{content}</section>;
};

export default PostsList;
