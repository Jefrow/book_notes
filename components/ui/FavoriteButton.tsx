import { useState } from "react";

type FavoriteButtonProps = {
  bookId: number;
  initialFavorite: boolean;
  onToggle: (bookId: number) => Promise<void>;
};

function FavoriteButton({
  bookId,
  initialFavorite,
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await onToggle(bookId);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 hover:scale-110 transition-transform"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <span className="text-red-500 text-2xl">❤️</span>
      ) : (
        <span className="text-gray-400 text-2xl">🤍</span>
      )}
    </button>
  );
}

export default FavoriteButton;
