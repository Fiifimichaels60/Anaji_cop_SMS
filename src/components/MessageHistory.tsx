import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

const MessageHistory: React.FC = () => {
  const { messages, loading, error, clearError } = useSupabase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.recipients || []).some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || message.status === statusFilter;
    const matchesDate = !dateFilter || new Date(message.created_at).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryRate = (delivered: number, total: number) => {
    return total > 0 ? Math.round((delivered / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={clearError}
            className="text-red-700 underline text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Message History</h2>
            <p className="text-gray-600 mt-1">View and manage your sent SMS messages</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filter results</span>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {messages.reduce((sum, msg) => sum + msg.delivered_count, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {messages.length > 0 ? Math.round((messages.reduce((sum, msg) => sum + msg.delivered_count, 0) / 
                           messages.reduce((sum, msg) => sum + msg.total_recipients, 0)) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600">
                {messages.filter(msg => 
                  new Date(msg.created_at).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div key={message.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(message.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.sent_at || message.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-900 font-medium mb-2">{message.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {(message.groups || []).map((group, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{message.total_recipients} recipients</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{message.delivered_count} delivered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600 font-medium">
                      {getDeliveryRate(message.delivered_count, message.total_recipients)}% success rate
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <div className="flex flex-col items-end space-y-2">
                  <div className={`w-16 h-2 rounded-full overflow-hidden ${
                    message.status === 'sent' ? 'bg-gray-200' : 'bg-yellow-200'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-300 ${
                        message.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${getDeliveryRate(message.delivered_count, message.total_recipients)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getDeliveryRate(message.delivered_count, message.total_recipients)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Try adjusting your search filters or send your first message.</p>
        </div>
      )}
    </div>
  );
};

export default MessageHistory;