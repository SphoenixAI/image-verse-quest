
import { SVGProps } from 'react';

export function ChipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="9" width="6" height="6" />
      <path d="M20 4v4a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4Z" />
      <path d="M12 16v8" />
      <path d="M16 12h8" />
      <path d="M8 12H0" />
      <path d="M12 0v8" />
    </svg>
  );
}
