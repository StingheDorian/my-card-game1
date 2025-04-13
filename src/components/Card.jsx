// src/components/Card.jsx
import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="border rounded shadow p-4">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div>{children}</div>;
};
