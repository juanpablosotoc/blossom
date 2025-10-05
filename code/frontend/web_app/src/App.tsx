import './renderer/styles/index.scss';
import React from 'react';
import Home from './renderer/pages/home';
import SwipeRight from './renderer/components/onboarding/swipeRight';
const App: React.FC = () => {
    // compute if its the first time the user is using the app
    const hasUsedApp = localStorage.getItem('hasUsedApp');

    return (
        <>
            <Home></Home>
            {hasUsedApp ? null : <SwipeRight></SwipeRight>}
        </>
    );
};

export default App;
