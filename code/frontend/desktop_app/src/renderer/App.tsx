// App.tsx
import React from 'react';
import Home from './pages/home';
import SwipeRight from './components/onboarding/swipeRight';

const App: React.FC = () => {
    const hasUsedApp = localStorage.getItem('hasUsedApp');

    return (
        <>
            <Home></Home>
            {hasUsedApp ? null : <SwipeRight></SwipeRight>}
        </>
    );
};

export default App;
