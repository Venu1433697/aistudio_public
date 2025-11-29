
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Loader2, Plus, X, Edit2, DollarSign, Check } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../ConfirmDialog';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [modalFormData, setModalFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: ''
  });
  const [enablingBillingFor, setEnablingBillingFor] = useState<string | null>(null);
  const [billingConfirmUser, setBillingConfirmUser] = useState<any>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user functionality removed per requirement 13

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setModalFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        age: user.age || ''
      });
    } else {
      setEditingUser(null);
      setModalFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        age: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updated = await api.updateUser(editingUser._id || editingUser.id, modalFormData);
        setUsers(prev => prev.map(u => (u._id === updated._id || u.id === updated._id) ? updated : u));
        toast.success('User updated successfully');
      } else {
        const created = await api.createUser(modalFormData);
        setUsers(prev => [created, ...prev]);
        toast.success('User created successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleEnableBilling = async (user: any) => {
    const adminProfile = localStorage.getItem('os_profile');
    let adminEmail = '';

    if (adminProfile) {
      try {
        const parsed = JSON.parse(adminProfile);
        adminEmail = parsed.email || '';
      } catch (e) {
        console.error('Error parsing admin profile', e);
      }
    }

    if (!adminEmail) {
      toast.error('Admin email not found. Please update your profile.');
      return;
    }

    // Show billing confirmation modal
    setBillingConfirmUser(user);
  };

  const handleBillingConfirm = async () => {
    if (!billingConfirmUser) return;

    const user = billingConfirmUser;
    const adminProfile = localStorage.getItem('os_profile');
    let adminEmail = '';

    if (adminProfile) {
      try {
        const parsed = JSON.parse(adminProfile);
        adminEmail = parsed.email || '';
      } catch (e) {
        console.error('Error parsing admin profile', e);
      }
    }

    try {
      setEnablingBillingFor(user._id || user.id);
      await api.enableUserBilling(user._id || user.id, adminEmail);
      // Refresh users list to ensure UI is in sync
      const updatedUsers = await api.getUsers();
      setUsers(updatedUsers);
      toast.success(`Billing enabled for ${user.firstName} ${user.lastName}`);
      setBillingConfirmUser(null);
    } catch (error: any) {
      console.error('Error enabling billing:', error);
      toast.error(error.message || 'Failed to enable billing');
    } finally {
      setEnablingBillingFor(null);
    }
  };

  const handleBillingCancel = () => {
    setBillingConfirmUser(null);
  };

  // Reset to first page whenever search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // --- Filtering Logic ---
  const filteredUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();
    if (!lowerTerm) return users;

    return users.filter(user => {
      const searchableText = `${user.firstName} ${user.lastName} ${user.mobile} ${user.email}`.toLowerCase();
      return searchableText.includes(lowerTerm);
    });
  }, [searchTerm, users]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-black" />
        <p>Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Listing of registered users with basic attributes. Use search to filter. [web:{filteredUsers.length}]
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by name, email or mobile"
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">First name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">Last name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/12">Age</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/4">Mobile number</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/4">Email</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-500 w-1/6">Billing</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-500 w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">{user.firstName}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{user.lastName}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.age || '-'}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-mono">{user.mobile || '-'}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 text-sm text-center">
                    {user.billingEnabled ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200" title={`Enabled by ${user.billingEnabledBy} on ${new Date(user.billingEnabledAt).toLocaleDateString()}`}>
                        <Check size={14} />
                        <span className="text-xs font-medium">Enabled</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnableBilling(user)}
                        disabled={enablingBillingFor === (user._id || user.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enable billing for this user (irreversible)"
                      >
                        {enablingBillingFor === (user._id || user.id) ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <DollarSign size={14} />
                        )}
                        <span className="text-xs font-medium">Enable Billing</span>
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-gray-400 hover:text-black transition-colors p-1"
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No users found matching "{searchTerm}"
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

          {/* Pagination Controls (Symbols) */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={modalFormData.firstName}
                    onChange={e => setModalFormData({ ...modalFormData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={modalFormData.lastName}
                    onChange={e => setModalFormData({ ...modalFormData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={modalFormData.email}
                  onChange={e => setModalFormData({ ...modalFormData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={modalFormData.mobile}
                    onChange={e => setModalFormData({ ...modalFormData, mobile: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={modalFormData.age}
                    onChange={e => setModalFormData({ ...modalFormData, age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Billing Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!billingConfirmUser}
        title="Enable Billing"
        message={`Are you sure you want to enable billing for ${billingConfirmUser?.firstName} ${billingConfirmUser?.lastName}?\n\n⚠️ WARNING: This action is IRREVERSIBLE. Once enabled, billing cannot be disabled by anyone.`}
        confirmText="Yes, Enable Billing"
        cancelText="No, Cancel"
        onConfirm={handleBillingConfirm}
        onCancel={handleBillingCancel}
        type="warning"
      />
    </div>
  );
};
