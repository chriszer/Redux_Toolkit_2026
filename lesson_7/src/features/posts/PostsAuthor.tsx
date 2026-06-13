import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";

const PostsAuthor = ({ userId }: { userId: string }) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user) => user.id === userId);
  return <span>by {author?.name ?? "Unknown author"} </span>;
};

export default PostsAuthor;
