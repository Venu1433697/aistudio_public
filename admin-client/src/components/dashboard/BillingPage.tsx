import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Loader2, DollarSign, TrendingUp, TrendingDown, Edit3, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface BillingPageProps {
    onNavigateToBillingDetails?: (userId: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ onNavigateToBillingDetails }) => {
    const [billingUsers, setBillingUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch billing-enabled users from API
    useEffect(() => {
        const fetchBillingUsers = async () => {
            try {
                const data = await api.getBillingUsers();
                setBillingUsers(data);
            } catch (error) {
                console.error('Error fetching billing users:', error);
                toast.error('Failed to load billing data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBillingUsers();
    }, []);

    // Reset to first page whenever search or items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    // Filtering Logic
    const filteredUsers = useMemo(() => {
        const lowerTerm = searchTerm.toLowerCase().trim();
        if (!lowerTerm) return billingUsers;

        return billingUsers.filter(user => {
            const searchableText = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
            return searchableText.includes(lowerTerm);
        });
    }, [searchTerm, billingUsers]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleUserClick = (userId: string) => {
        if (onNavigateToBillingDetails) {
            onNavigateToBillingDetails(userId);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await api.deleteUser(userId);
            setBillingUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-black" />
                <p>Loading Billing Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Billing</h2>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                        <DollarSign size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {filteredUsers.length} Active Billing {filteredUsers.length === 1 ? 'User' : 'Users'}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    Manage billing and payment details for users with billing enabled
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-gray-400"
                        />
                        <Search className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/4">User Name</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/4">Email</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">Total Cost</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">Paid</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">Remaining</th>
                                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-500 w-1/12">Status</th>
                                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-500 w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentUsers.map((user) => {
                                const totalCost = user.billingDetails?.totalCost || 0;
                                const paidAmount = user.billingDetails?.paidAmount || 0;
                                const remainingAmount = user.billingDetails?.remainingAmount || 0;
                                const isPaid = remainingAmount <= 0 && totalCost > 0;
                                const isPartiallyPaid = paidAmount > 0 && remainingAmount > 0;

                                return (
                                    <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors group">
                                        <td
                                            className="py-4 px-6 text-sm text-gray-900 font-medium cursor-pointer hover:text-black hover:underline"
                                            onClick={() => handleUserClick(user._id || user.id)}
                                            title="Click to view billing details"
                                        >
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-4 px-6 text-sm text-gray-900 font-semibold text-right">
                                            {formatCurrency(totalCost)}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-green-600 font-medium text-right">
                                            {formatCurrency(paidAmount)}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-right">
                                            <span className={`font-semibold ${remainingAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {formatCurrency(remainingAmount)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {isPaid ? (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
                                                    <TrendingUp size={12} />
                                                    <span className="text-xs font-medium">Paid</span>
                                                </div>
                                            ) : isPartiallyPaid ? (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                                                    <TrendingDown size={12} />
                                                    <span className="text-xs font-medium">Partial</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-200">
                                                    <span className="text-xs font-medium">Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUserClick(user._id || user.id);
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteUser(user._id || user.id);
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">
                                        {searchTerm ? `No billing users found matching "${searchTerm}"` : 'No users with billing enabled yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">

                    {/* Rows per page selector */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Show</span>
                        <div className="relative">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 rounded px-3 py-1 pr-8 focus:outline-none focus:border-black cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                        </div>
                        <span>entries</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1 || totalPages === 0}
                            className="px-3 py-1.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[32px]"
                            title="First Page"
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || totalPages === 0}
                            className="px-3 py-1.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[32px]"
                            title="Previous Page"
                        >
                            &lt;
                        </button>

                        <span className="text-xs text-gray-500 px-2">
                            Page <span className="text-black font-semibold">{totalPages === 0 ? 0 : currentPage}</span> of <span className="text-black font-semibold">{totalPages}</span>
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[32px]"
                            title="Next Page"
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[32px]"
                            title="Last Page"
                        >
                            &gt;&gt;
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};
