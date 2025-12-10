import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.message) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            // Handle form submission (e.g., send to email backend)
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <section className="py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-6">Contact Me</h2>
            {submitted && <p className="text-green-500 text-center">Thank you for your message!</p>}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="message">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full p-2 rounded ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {errors.message && <p className="text-red-500">{errors.message}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Send Message</button>
            </form>
        </section>
    );
};

export default Contact;