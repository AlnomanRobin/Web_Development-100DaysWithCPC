import React from 'react';

const About = () => {
    return (
        <section id="about" className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-10">About Me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-2">Academic Achievements</h3>
                        <p className="text-gray-400">Details about academic results, honors, and recognitions.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-2">Skills</h3>
                        <p className="text-gray-400">List of skills and technologies I am proficient in.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-2">Certifications</h3>
                        <p className="text-gray-400">Information about relevant certifications and courses completed.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold mb-2">Interests</h3>
                        <p className="text-gray-400">A brief overview of personal interests and hobbies.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;