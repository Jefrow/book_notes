import { useState } from "react";

type ReadStatusDropdownProps = {
  bookId: number;
  initialStatus: string | null;
  onStatusChange: (bookId: number, status: string) => Promise<void>;
};

function ReadStatusDropdown({
  bookId,
  initialStatus,
  onStatusChange,
}: ReadStatusDropdownProps) {
  const [status, setStatus] = useState(initialStatus || "");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    setLoading(true);
    try {
      await onStatusChange(bookId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="p-2 border rounded text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <option value="">Set status...</option>
      <option value="want_to_read">Want to Read</option>
      <option value="reading">Reading</option>
      <option value="read">Read</option>
    </select>
  );
}

export default ReadStatusDropdown;
