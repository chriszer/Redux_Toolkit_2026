import { useAppDispatch } from "../../app/hooks";
import { reactionAdded } from "./postsSlice";
import type { Post, ReactionName } from "../../types/types";

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionsButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = (
    Object.entries(reactionEmoji) as [ReactionName, string][]
  ).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionsButtons;
