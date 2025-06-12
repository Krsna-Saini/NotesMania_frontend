import React from "react";


const SolidTriangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <polygon points="12,4 4,20 20,20" />
    </svg>
  );
};

export default SolidTriangle;
