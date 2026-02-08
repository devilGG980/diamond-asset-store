import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import PageSEO from '../components/SEO/PageSEO';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <PageSEO
                title="404 Page Not Found - EditorVault"
                description="The page you are looking for does not exist."
                noIndex={true}
            />
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
                <p className="text-gray-400 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all"
                >
                    <HomeIcon className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
