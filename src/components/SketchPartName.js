import React from 'react';

export default function SketchPartName({onChange, partName}) {
  return (
    <input type="text"
           onChange={onChange}
           value={partName}
           placeholder="My Part"
           style={{border: 0, background: 'none'}}/>
  );
}
