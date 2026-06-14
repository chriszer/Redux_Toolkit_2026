import { useState, type ChangeEvent } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";
import type { User } from "../../types/types";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useAppSelector(selectAllUsers);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const onSavePostClicked = async () => {
    if (!canSave) return;

    try {
      await addNewPost({ title, body: content, userId }).unwrap();
      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to save the post", err);
    }
  };

  const usersOptions = users.map((user: User) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onSavePostClicked} type="button" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;
