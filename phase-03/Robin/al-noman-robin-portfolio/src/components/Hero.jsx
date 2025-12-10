import React from 'react';

const Hero = () => {
    return (
        <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <div className="glass-card p-8 rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold mb-4">AL Noman Robin</h1>
                <p className="text-xl mb-6">Welcome to my portfolio! Explore my projects and get to know me.</p>
                <div className="flex space-x-4">
                    <a href="#projects" className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-gray-200 transition">View Projects</a>
                    <a href="#contact" className="bg-transparent border-2 border-white px-4 py-2 rounded hover:bg-white hover:text-purple-500 transition">Contact Me</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;