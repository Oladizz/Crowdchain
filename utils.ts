
import React from 'react';

export const getDynamicFontSize = (value: number): React.CSSProperties => {
  const length = value.toString().length;
  let fontSize = '1rem'; // default size
  if (length > 10) {
    fontSize = '0.8rem';
  } else if (length > 7) {
    fontSize = '0.9rem';
  }
  return { fontSize };
};
