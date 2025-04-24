// src/components/Card.jsx
import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="border rounded shadow p-4 bg-gray-800 text-white">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};
