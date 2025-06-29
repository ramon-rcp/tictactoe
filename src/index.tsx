import React from 'react';
import { createRoot, Root } from 'react-dom/client';


const main: HTMLElement|null = document.getElementById('root');
if (main === null)
  throw new Error("Uh oh! HTML is missing 'main' element");

const root: Root = createRoot(main);
root.render(<div></div>);