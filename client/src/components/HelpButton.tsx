import { IoIosHelpCircleOutline } from 'react-icons/io'

export default function HelpButton() {
  const isDevelopment = import.meta.env.MODE === 'development';
  const downloadUrl = isDevelopment ? '/api/help' : '/help'

  return (
    <a href={downloadUrl} rel="noopener noreferrer">
      <button>
        <IoIosHelpCircleOutline size="2em" />
      </button>
    </a>
  );
}
