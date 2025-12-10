import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <header className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-lg p-4">
                {/* Header component will be rendered here */}
            </header>
            <main className="flex flex-col items-center">
                {children}
            </main>
            <footer className="py-4 text-center">
                {/* Footer component will be rendered here */}
            </footer>
        </div>
    );
};

export default MainLayout;