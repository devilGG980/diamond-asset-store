
export const categoryGradients: Record<string, string> = {
    'YouTube Growth': 'from-red-600 to-red-900',
    'Video Editing': 'from-purple-600 to-blue-900',
    'VFX': 'from-green-600 to-emerald-900',
    'Hardware': 'from-gray-700 to-black',
    'Software': 'from-blue-600 to-cyan-800',
    'Career': 'from-yellow-600 to-orange-900',
    'Social Media': 'from-pink-600 to-rose-900',
    'Design': 'from-indigo-600 to-violet-900',
    'Audio': 'from-teal-600 to-cyan-900',
    'Other': 'from-gray-600 to-gray-900'
};

export const getCategoryGradient = (category: string): string => {
    return categoryGradients[category] || categoryGradients['Other'];
};
