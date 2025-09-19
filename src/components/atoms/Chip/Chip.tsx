import { FaTimesCircle } from 'react-icons/fa';
import { type ReactNode } from 'react';

interface ChipProps {
  label: string | ReactNode;
  onDelete: () => void;
}

const Chip = ({ label, onDelete }: ChipProps) => {
  return (
    <div className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
      <span>{label}</span>
      <button
        type="button"
        onClick={onDelete}
        className="ml-2 text-gray-500 hover:text-gray-900 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <FaTimesCircle className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Chip;