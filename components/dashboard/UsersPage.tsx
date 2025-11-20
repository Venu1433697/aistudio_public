
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Users</h2>
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 w-1/3">Email</th>
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
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
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
    </div>
  );
};
