import React from 'react';
import projectsData from '../data/projects';

const Projects = () => {
    return (
        <section id="projects" className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-10">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project) => (
                        <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <p className="text-gray-400">{project.description}</p>
                                <div className="mt-4">
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mr-4">Live Demo</a>
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;