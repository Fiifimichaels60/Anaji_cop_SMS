import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar, UserCheck, UserX } from 'lucide-react';
import { mockMembers, mockGroups } from '../data/mockData';
import { Member } from '../types';

const MembersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || member.group === selectedGroup;
    const matchesActive = !showActiveOnly || member.active;
    
    return matchesSearch && matchesGroup && matchesActive;
  });

  const AddEditMemberModal = ({ member, onClose }: { member?: Member; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: member?.name || '',
      phone: member?.phone || '',
      email: member?.email || '',
      group: member?.group || mockGroups[0].name,
      active: member?.active ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would typically save to your backend
      console.log('Saving member:', formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {member ? 'Edit Member' : 'Add New Member'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockGroups.map(group => (
                  <option key={group.id} value={group.name}>{group.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Active Member
              </label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {member ? 'Update' : 'Add'} Member
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Members Management</h2>
            <p className="text-gray-600 mt-1">Manage your church members and their contact information</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Groups</option>
            {mockGroups.map(group => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </select>
          
          <label className="flex items-center space-x-3 p-2">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active members only</span>
          </label>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.group}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingMember(member)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              {member.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                member.active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {member.active ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                <span>{member.active ? 'Active' : 'Inactive'}</span>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${
                mockGroups.find(g => g.name === member.group)?.color || 'bg-gray-400'
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add new members.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddEditMemberModal onClose={() => setShowAddModal(false)} />
      )}
      
      {editingMember && (
        <AddEditMemberModal 
          member={editingMember} 
          onClose={() => setEditingMember(null)} 
        />
      )}
    </div>
  );
};

export default MembersManagement;