'use client';

import { useEffect, useState } from 'react';

export default function FormInput({ label, type = 'text', name, value, onChange, ...props }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="input-group">
      <label>{label}</label>
      {isMounted && (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );
}
