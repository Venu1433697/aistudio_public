
import React, { useState, useEffect, useRef } from 'react';
import { Users, Globe, Activity, Pencil, Loader2 } from 'lucide-react';
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

const GalleryItem: React.FC<GalleryItemProps> = ({ image, title, subtitle, onUpdate }) => {
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

            {/* Edit Button */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
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
        const formData = new FormData();
        formData.append('image', file);
        
        // Maintain existing title/description if updating logic allows, 
        // or just upload the image as a new item depending on how backend treats POST.
        // The API spec says POST creates a new object. But here we are "updating" an image in the UI grid.
        // If the backend doesn't support updating the image of an existing ID via PUT, 
        // we might have to create a new one and replace in state, or better:
        // Since the UI implies updating a specific slot, but the API is generic list,
        // We will just upload the new image and update the UI state with the returned URL.
        
        // Optionally we could add title/description to FormData if we had inputs for them.
        formData.append('title', galleryItems[index].title || 'Updated Image');
        if (galleryItems[index].subtitle) {
            formData.append('description', galleryItems[index].subtitle);
        }

        const toastId = toast.loading('Uploading image...');
        
        try {
            const newItem = await api.uploadGalleryImage(formData);
            
            setGalleryItems(prev => {
                const newItems = [...prev];
                newItems[index] = {
                    ...newItems[index], // Keep UI properties
                    image: api.getImageUrl(newItem.url), // Update Image URL
                    id: newItem._id
                };
                return newItems;
            });
            toast.success('Image uploaded successfully', { id: toastId });
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

        </div>
    );
};
