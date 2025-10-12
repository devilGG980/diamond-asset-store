import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockAssets, Asset, categories } from '../data/assets';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminPanel: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<Asset>>({
    title: '',
    description: '',
    price: 0,
    category: 'Transitions',
    thumbnail: '🎬',
    frameRate: '30fps',
    previewVideo: '/videos/',
    downloadUrl: '/videos/',
    tags: [],
    featured: false,
    fileSize: 'Video File',
    format: 'MP4 Video'
  });


  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      ...asset,
      tags: asset.tags
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingAsset(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: 'Transitions',
      thumbnail: '🎬',
      frameRate: '30fps',
      previewVideo: '/videos/',
      downloadUrl: '/videos/',
      tags: [],
      featured: false,
      fileSize: 'Video File',
      format: 'MP4 Video'
    });
  };


  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isAddingNew) {
        // Add new asset
        const newAsset: Asset = {
          id: Math.max(...assets.map(a => a.id), 0) + 1,
          title: formData.title!,
          description: formData.description!,
          price: formData.price!,
          category: formData.category!,
          thumbnail: formData.thumbnail!,
          frameRate: formData.frameRate,
          previewVideo: formData.previewVideo,
          downloadUrl: formData.downloadUrl!,
          tags: formData.tags!,
          createdAt: new Date(),
          downloads: 0,
          featured: formData.featured!,
          fileSize: formData.fileSize!,
          format: formData.format!
        };
        const updatedAssets = [...assets, newAsset];
        setAssets(updatedAssets);
        
        // Save to localStorage for persistence
        localStorage.setItem('videoForgeAssets', JSON.stringify(updatedAssets));
        toast.success('New asset added successfully!');
      } else if (editingAsset) {
        // Update existing asset
        const updatedAssets = assets.map(asset => 
          asset.id === editingAsset.id 
            ? { ...asset, ...formData, id: asset.id, createdAt: asset.createdAt, downloads: asset.downloads }
            : asset
        );
        setAssets(updatedAssets);
        
        // Save to localStorage for persistence
        localStorage.setItem('videoForgeAssets', JSON.stringify(updatedAssets));
        toast.success('Asset updated successfully!');
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error('Failed to save asset');
    }

    setEditingAsset(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(asset => asset.id !== id));
      toast.success('Asset deleted!');
    }
  };

  const handleCancel = () => {
    setEditingAsset(null);
    setIsAddingNew(false);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage Video Forge Assets</p>
          </div>
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Asset</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Asset List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Assets ({assets.length})</h2>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {asset.thumbnail && (asset.thumbnail.startsWith('data:') || asset.thumbnail.startsWith('/')) ? (
                          <img 
                            src={asset.thumbnail} 
                            alt={asset.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">🎬</span>';
                            }}
                          />
                        ) : (
                          <span className="text-2xl">{asset.thumbnail}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{asset.title}</h3>
                        <p className="text-gray-400 text-sm">{asset.category} • 💎{asset.price}</p>
                      </div>
                      {asset.featured && (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {(editingAsset || isAddingNew) && (
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {isAddingNew ? 'Add New Asset' : 'Edit Asset'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Asset title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 h-20 resize-none"
                      placeholder="Asset description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Price (💎)</label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Frame Rate</label>
                      <select
                        value={formData.frameRate || '30fps'}
                        onChange={(e) => setFormData({ ...formData, frameRate: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="24fps">24fps</option>
                        <option value="30fps">30fps</option>
                        <option value="60fps">60fps</option>
                        <option value="120fps">120fps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category || 'Transitions'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {categories.filter(c => c !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Thumbnail (Emoji or Image Path)</label>
                    <input
                      type="text"
                      value={formData.thumbnail || '🎬'}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="🎬 or /thumbnail/image.png"
                    />
                    <p className="text-xs text-gray-400 mt-1">Use emoji or path like /thumbnail/your-image.png (files in public/thumbnail/ folder)</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Video Path</label>
                    <input
                      type="text"
                      value={formData.previewVideo || '/videos/'}
                      onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value, downloadUrl: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="/videos/your-video.mp4"
                    />
                    <p className="text-xs text-gray-400 mt-1">Path to video file in public/videos folder</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="smooth, professional, dynamic"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded bg-gray-800 border-gray-700 text-yellow-400 focus:ring-yellow-400"
                    />
                    <label htmlFor="featured" className="text-gray-300 text-sm">Featured Asset</label>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>{isAddingNew ? 'Add Asset' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400">{assets.length}</div>
            <div className="text-gray-400">Total Assets</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400">{assets.filter(a => a.featured).length}</div>
            <div className="text-gray-400">Featured Assets</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">{assets.filter(a => a.category === 'Transitions').length}</div>
            <div className="text-gray-400">Transitions</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-400">💎{assets.reduce((sum, a) => sum + a.price, 0)}</div>
            <div className="text-gray-400">Total Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;