
import React, { useState, useEffect, useRef } from 'react';
import { Users, Globe, Activity, Pencil, Loader2, Trash2, Plus, X, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

// --- Types & Interfaces ---
interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtext?: string;
}

interface GalleryItemProps {
    image: string;
    title: string;
    subtitle?: string;
    onUpdate: (file: File) => void;
    onDelete: () => void;
    onEditText: () => void;
}

// --- Sub-components ---

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtext }) => {
    return (
        <div className="rounded-xl p-6 shadow-sm bg-white text-gray-900 border border-gray-100 flex flex-col justify-between h-full transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`p-3 rounded-xl bg-gray-100 text-black`}>
                    {icon}
                </div>
            </div>
            {subtext && (
                <div className="text-xs text-gray-400 mt-auto">
                    {subtext}
                </div>
            )}
        </div>
    );
};

const GalleryItem: React.FC<GalleryItemProps> = ({ image, title, subtitle, onUpdate, onDelete, onEditText }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpdate(e.target.files[0]);
        }
    };

    return (
        <div className="group relative h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-90 group-hover:brightness-75"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
            />
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 drop-shadow-md">{title}</h3>
                {subtitle && <p className="text-gray-200 text-xs md:text-sm font-medium tracking-wider">{subtitle}</p>}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditText();
                    }}
                    className="bg-white/90 text-blue-600 p-2 rounded-full hover:bg-white shadow-lg transition-colors backdrop-blur-sm"
                    title="Edit Text"
                >
                    <Edit3 size={16} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                    className="bg-white/90 text-black p-2 rounded-full hover:bg-white shadow-lg transition-colors backdrop-blur-sm"
                    title="Change Image"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white shadow-lg transition-colors backdrop-blur-sm"
                    title="Delete Image"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

// --- Main Component ---
export const DashboardHome: React.FC = () => {
    // State for metrics
    const [uniqueVisitors, setUniqueVisitors] = useState(12450);
    const [liveUsers, setLiveUsers] = useState(84);
    const [registeredUsers, setRegisteredUsers] = useState(0);

    // State for gallery items
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(true);
    const [editingGalleryItem, setEditingGalleryItem] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '' });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFormData, setUploadFormData] = useState({ title: '', description: '', file: null as File | null });

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users Count
                const users = await api.getUsers();
                setRegisteredUsers(users.length);

                // Fetch Gallery
                const gallery = await api.getGallery();
                const mappedGallery = gallery.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    subtitle: item.description,
                    image: api.getImageUrl(item.url)
                }));
                setGalleryItems(mappedGallery);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoadingGallery(false);
            }
        };
        fetchData();
    }, []);

    // Simulate live traffic updates
    useEffect(() => {
        // Interval for Unique Visitors (slowly increasing)
        const visitorInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 3);
            setUniqueVisitors(prev => prev + increment);
        }, 5000);

        // Interval for Live Users (fluctuating up and down)
        const liveInterval = setInterval(() => {
            setLiveUsers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newValue = prev + change;
                return newValue > 20 ? newValue : 20; // Minimum floor
            });
        }, 2000);

        return () => {
            clearInterval(visitorInterval);
            clearInterval(liveInterval);
        };
    }, []);

    const handleImageUpdate = async (index: number, file: File) => {
        const item = galleryItems[index];
        if (!item.id) {
            toast.error('Cannot update image: No ID found');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', item.title || 'Updated Image');
        formData.append('description', item.subtitle || '');

        const toastId = toast.loading('Updating image...');

        try {
            // Upload new image
            const newItem = await api.uploadGalleryImage(formData);

            // Update the existing gallery item with the new image URL
            const updated = await api.updateGalleryImage(item.id, {
                url: newItem.url,
                title: item.title,
                description: item.subtitle
            });

            // Delete the newly created item (we only needed its uploaded file)
            await api.deleteGalleryImage(newItem._id);

            // Update UI with the new image URL
            setGalleryItems(prev => {
                const newItems = [...prev];
                newItems[index] = {
                    ...newItems[index],
                    image: api.getImageUrl(updated.url)
                };
                return newItems;
            });

            toast.success('Image updated successfully', { id: toastId });
        } catch (error) {
            console.error('Update failed', error);
            toast.error('Failed to update image', { id: toastId });
        }
    };

    const handleDeleteImage = async (index: number) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const item = galleryItems[index];
        const toastId = toast.loading('Deleting image...');

        try {
            if (item.id) {
                await api.deleteGalleryImage(item.id);
            }

            setGalleryItems(prev => prev.filter((_, i) => i !== index));
            toast.success('Image deleted successfully', { id: toastId });
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Failed to delete image', { id: toastId });
        }
    };

    const handleOpenEditModal = (index: number) => {
        const item = galleryItems[index];
        setEditingGalleryItem({ ...item, index });
        setEditFormData({
            title: item.title || '',
            description: item.subtitle || ''
        });
    };

    const handleCloseEditModal = () => {
        setEditingGalleryItem(null);
        setEditFormData({ title: '', description: '' });
    };

    const handleSaveTextEdit = async () => {
        if (!editingGalleryItem) return;

        const toastId = toast.loading('Updating text...');
        try {
            const updated = await api.updateGalleryImage(editingGalleryItem.id, editFormData);

            setGalleryItems(prev => {
                const newItems = [...prev];
                newItems[editingGalleryItem.index] = {
                    ...newItems[editingGalleryItem.index],
                    title: updated.title,
                    subtitle: updated.description
                };
                return newItems;
            });

            toast.success('Text updated successfully', { id: toastId });
            handleCloseEditModal();
        } catch (error) {
            console.error('Update failed', error);
            toast.error('Failed to update text', { id: toastId });
        }
    };

    const handleOpenUploadModal = () => {
        setUploadFormData({ title: '', description: '', file: null });
        setIsUploadModalOpen(true);
    };

    const handleCloseUploadModal = () => {
        setIsUploadModalOpen(false);
        setUploadFormData({ title: '', description: '', file: null });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFormData({ ...uploadFormData, file: e.target.files[0] });
        }
    };

    const handleUploadSubmit = async () => {
        if (!uploadFormData.file) {
            toast.error('Please select an image file');
            return;
        }

        const formData = new FormData();
        formData.append('image', uploadFormData.file);
        formData.append('title', uploadFormData.title || '');
        formData.append('description', uploadFormData.description || '');

        const toastId = toast.loading('Uploading image...');
        try {
            const newItem = await api.uploadGalleryImage(formData);
            setGalleryItems(prev => [...prev, {
                image: api.getImageUrl(newItem.url),
                title: newItem.title,
                subtitle: newItem.description,
                id: newItem._id
            }]);
            toast.success('Image uploaded successfully', { id: toastId });
            handleCloseUploadModal();
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload image', { id: toastId });
        }
    };

    return (
        <div className="space-y-8 pb-8 animate-fade-in-up">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500 text-sm mt-1">Welcome back, Admin!</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Live Users */}
                <StatCard
                    icon={<Activity size={22} strokeWidth={2.5} />}
                    title="Live Users"
                    value={liveUsers}
                    subtext="Active now on platform"
                />

                {/* Unique Visitors */}
                <StatCard
                    icon={<Globe size={22} strokeWidth={2.5} />}
                    title="Unique Visitors"
                    value={uniqueVisitors.toLocaleString()}
                    subtext="Total visits this month"
                />

                {/* Registered Users */}
                <StatCard
                    icon={<Users size={22} strokeWidth={2.5} />}
                    title="Registered Users"
                    value={registeredUsers}
                    subtext="Users registered in database"
                />
            </div>

            {/* Business Image Gallery Section */}
            <div className="pt-4">
                <div className="mb-4 flex justify-between items-end">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Business image gallery</h3>
                        <p className="text-sm text-gray-500">Use focused visuals to anchor ideas.</p>
                    </div>
                    <button
                        onClick={handleOpenUploadModal}
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Image</span>
                    </button>
                </div>

                {isLoadingGallery ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin w-8 h-8 text-gray-300" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryItems.length > 0 ? galleryItems.map((item: any, index: number) => (
                            <GalleryItem
                                key={item.id || index}
                                title={item.title}
                                image={item.image}
                                subtitle={item.subtitle}
                                onUpdate={(file) => handleImageUpdate(index, file)}
                                onDelete={() => handleDeleteImage(index)}
                                onEditText={() => handleOpenEditModal(index)}
                            />
                        )) : (
                            <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                                No images found in gallery. Upload one to get started.
                            </div>
                        )}

                        {/* If you want to force display default placeholders when empty, we could conditionally render them, 
                            but integrating with the real backend implies showing real data. */}
                    </div>
                )}
            </div>

            {/* Edit Text Modal */}
            {editingGalleryItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Edit Gallery Text</h3>
                            <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                                    placeholder="Enter image title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                                    placeholder="Enter image description"
                                    rows={3}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTextEdit}
                                    className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Image Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Upload New Image</h3>
                            <button onClick={handleCloseUploadModal} className="text-gray-400 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image File *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                                />
                                {uploadFormData.file && (
                                    <p className="text-sm text-gray-500 mt-1">Selected: {uploadFormData.file.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={uploadFormData.title}
                                    onChange={e => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                                    placeholder="Enter image title (optional)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={uploadFormData.description}
                                    onChange={e => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                                    placeholder="Enter image description (optional)"
                                    rows={3}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={handleCloseUploadModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUploadSubmit}
                                    className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                                    disabled={!uploadFormData.file}
                                >
                                    Upload Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
