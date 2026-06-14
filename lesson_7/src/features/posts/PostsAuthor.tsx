import { useAppSelector } from "../../app/hooks";
import type { User } from "../../types/types";
import { selectAllUsers } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: string }) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user: User) => user.id === userId);

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author?.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

export default PostAuthor;
