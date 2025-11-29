import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, Pencil, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { SuccessModal } from '../SuccessModal';

export const ProfilePage: React.FC = () => {
    const [bannerImage, setBannerImage] = useState<string | null>(() =>
        localStorage.getItem('os_banner')
    );

    const [avatarImage, setAvatarImage] = useState(() =>
        localStorage.getItem('os_avatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    );

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        gender: 'Male',
        email: ''
    });

    const [originalData, setOriginalData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        gender: 'Male',
        email: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [changedFields, setChangedFields] = useState<string[]>([]);

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await api.getProfile();
                const profileData = {
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    mobile: profile.mobile || '',
                    gender: profile.gender || 'Male',
                    email: profile.email || ''
                };
                setFormData(profileData);
                setOriginalData(profileData);

                // Set images from profile
                if (profile.bannerImage) {
                    setBannerImage(api.getImageUrl(profile.bannerImage));
                }
                if (profile.profileImage) {
                    setAvatarImage(api.getImageUrl(profile.profileImage));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Could not load profile data from server.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Track changes
    useEffect(() => {
        const changed: string[] = [];
        if (formData.firstName !== originalData.firstName) changed.push('first name');
        if (formData.lastName !== originalData.lastName) changed.push('last name');
        if (formData.mobile !== originalData.mobile) changed.push('mobile');
        if (formData.gender !== originalData.gender) changed.push('gender');
        if (formData.email !== originalData.email) changed.push('email');

        setChangedFields(changed);
        setHasChanges(changed.length > 0);
    }, [formData, originalData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading(`Uploading ${type === 'banner' ? 'banner' : 'profile'} image...`);

        try {
            const updatedProfile = type === 'banner'
                ? await api.uploadBannerImage(formData)
                : await api.uploadProfileImage(formData);

            if (type === 'banner') {
                setBannerImage(api.getImageUrl(updatedProfile.bannerImage));
            } else {
                setAvatarImage(api.getImageUrl(updatedProfile.profileImage));
            }

            // Dispatch event to update profile image across all components
            window.dispatchEvent(new Event('profileUpdated'));

            toast.success(`${type === 'banner' ? 'Banner' : 'Profile'} image updated successfully!`, { id: toastId });
        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error(`Failed to upload ${type} image`, { id: toastId });
        }
    };

    const handleSave = async () => {
        if (!hasChanges) {
            toast.error('No changes to save');
            return;
        }

        setIsSaving(true);
        setActiveField(null);

        try {
            const updatedProfile = await api.updateProfile(formData);

            setOriginalData(formData);
            localStorage.setItem('os_profile', JSON.stringify(updatedProfile));
            window.dispatchEvent(new Event('profileUpdated'));

            // Show success modal
            setShowSuccessModal(true);
            setChangedFields([]);
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile changes');
        } finally {
            setIsSaving(false);
        }
    };

    const enableEdit = (fieldName: string, inputRef?: React.RefObject<HTMLInputElement>) => {
        setActiveField(fieldName);
        setTimeout(() => inputRef?.current?.focus(), 100);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10">

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Profile updated successfully."
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Welcome, {formData.firstName || 'Admin'}</h2>
                    <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {hasChanges && (
                    <div className="flex items-center gap-4 self-end md:self-auto">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">

                <div
                    className="relative h-48 bg-cover bg-center group"
                    style={{
                        backgroundImage: bannerImage
                            ? `url(${bannerImage})`
                            : 'linear-gradient(to right, #e5e7eb, #d1d5db, #9ca3af)'
                    }}
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black p-2 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-medium shadow-sm"
                    >
                        <ImageIcon size={16} /> Change Cover
                    </button>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'banner')}
                    />
                </div>

                <div className="px-6 md:px-10 pb-10">

                    <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-10">

                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                <img src={avatarImage} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity border-4 border-transparent"
                            >
                                <Camera className="text-white" size={24} />
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'avatar')}
                            />
                        </div>

                        <div className="flex-1 mb-2">
                            <h3 className="text-3xl font-bold text-gray-900">
                                {formData.firstName} {formData.lastName}
                                {(!formData.firstName && !formData.lastName) && <span className="text-gray-400 text-2xl font-normal italic">Complete your profile</span>}
                            </h3>
                            <p className="text-gray-500 font-medium">Administrator</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                        <EditableInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            activeField={activeField}
                            onEdit={() => enableEdit('firstName')}
                            onBlur={() => setActiveField(null)}
                        />

                        <EditableInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            activeField={activeField}
                            onEdit={() => enableEdit('lastName')}
                            onBlur={() => setActiveField(null)}
                        />

                        <EditableInput
                            label="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            activeField={activeField}
                            onEdit={() => enableEdit('mobile')}
                            onBlur={() => setActiveField(null)}
                            prefix="+91"
                        />

                        <EditableInput
                            label="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            activeField={activeField}
                            onEdit={() => enableEdit('email')}
                            onBlur={() => setActiveField(null)}
                        />

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500 font-medium ml-1">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    disabled={activeField !== 'gender'}
                                    onBlur={() => setActiveField(null)}
                                    className={`w-full bg-gray-50 border ${activeField === 'gender' ? 'border-black ring-1 ring-black' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:outline-none transition-all appearance-none disabled:opacity-100 disabled:cursor-default`}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                                <button
                                    onClick={() => { setActiveField('gender'); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                                >
                                    <Pencil size={16} />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

interface EditableInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeField: string | null;
    onEdit: () => void;
    onBlur: () => void;
    prefix?: string;
}

const EditableInput: React.FC<EditableInputProps> = ({ label, name, value, onChange, activeField, onEdit, onBlur, prefix }) => {
    const isEditing = activeField === name;
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePencilClick = () => {
        onEdit();
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm text-gray-500 font-medium ml-1">{label}</label>
            <div className="relative group">
                {prefix && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10 pointer-events-none select-none">
                        {prefix}
                    </span>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    readOnly={!isEditing}
                    onBlur={onBlur}
                    className={`w-full bg-gray-50 border ${isEditing ? 'border-black ring-1 ring-black' : 'border-gray-300'} rounded-lg ${prefix ? 'pl-14' : 'px-4'} pr-10 py-3 text-gray-900 focus:outline-none transition-all placeholder-gray-400 ${!isEditing ? 'cursor-default' : ''}`}
                    placeholder={`Enter ${label}`}
                />
                <button
                    onClick={handlePencilClick}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${isEditing ? 'text-black bg-gray-200' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                    title="Edit"
                >
                    <Pencil size={16} />
                </button>
            </div>
        </div>
    );
};
