import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";
import { Link, useParams } from "react-router-dom";
import type { RootState } from "../../app/store";

const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state: RootState) =>
    selectUserById(state, userId as string),
  );

  const postsForUser = useAppSelector((state: RootState) =>
    selectPostsByUser(state, userId as string),
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <div>
      <h2>{user?.name}</h2>
      <ul>{postTitles}</ul>
    </div>
  );
};

export default UserPage;
