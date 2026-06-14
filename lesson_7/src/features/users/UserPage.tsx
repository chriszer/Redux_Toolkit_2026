import type { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./usersSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state: RootState) =>
    selectUserById(state, userId as string),
  );

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId as string);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error as string}</p>;
  }

  return (
    <div>
      <h2>{user?.name}</h2>
      <ul>{content}</ul>
    </div>
  );
};

export default UserPage;
