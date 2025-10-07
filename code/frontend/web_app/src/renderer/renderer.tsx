import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';


window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } else {
        console.error("Root container 'root' not found in index.html");
    }
});
