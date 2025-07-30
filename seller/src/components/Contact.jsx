import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to manage auth state

const Contact = () => {
  const { user } = useSelector((state) => state.auth); // Get user email from auth state
  const [formData, setFormData] = useState({
    name: '',
    emailPrefix: user?.email?.split('@')[0] || '',  // Extracting prefix from email if available
    query: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.emailPrefix || !formData.query) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Your query has been sent successfully!');
  };

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-50 -mt-5">
      <div className="overflow-auto w-screen max-w-4xl px-4 py-12">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">Contact Us</h2>
          <p className="text-sm text-center text-gray-600 mt-2">
            We'd love to hear from you. Feel free to drop us a query below!
          </p>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="emailPrefix"
                  name="emailPrefix"
                  value={formData.emailPrefix}
                  onChange={handleInputChange}
                  placeholder="Enter your name prefix"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                <span className="text-gray-700">@midnightSeller.com</span>
              </div>
            </div>

            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Query
              </label>
              <textarea
                id="query"
                name="query"
                value={formData.query}
                onChange={handleInputChange}
                placeholder="Enter your query"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Query
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Or email us directly at:</p>
          <a
            href="mailto:team.innovation1224@gmail.com"
            className="text-indigo-600 font-medium hover:underline"
          >
            team.innovation1224@gmail.com
          </a>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
