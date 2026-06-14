import type { Post, ReactionName } from "../../types/types";
import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionsButtons = ({ post }: { post: Post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = (
    Object.entries(reactionEmoji) as [ReactionName, string][]
  ).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => {
          const newValue = post.reactions[name] + 1;
          addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [name]: newValue },
          });
        }}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionsButtons;
