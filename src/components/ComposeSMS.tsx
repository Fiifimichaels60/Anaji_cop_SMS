import React, { useState } from 'react';
import { Send, Users, MessageSquare, Eye, Clock, CheckCircle } from 'lucide-react';
import { mockMembers, mockGroups, mockTemplates } from '../data/mockData';

const ComposeSMS: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const getTotalRecipients = () => {
    const groupMembers = mockMembers.filter(member => 
      selectedGroups.includes(mockGroups.find(g => g.name === member.group)?.id || '')
    );
    const individualMembers = mockMembers.filter(member => 
      selectedMembers.includes(member.id)
    );
    
    const allRecipients = new Set([...groupMembers, ...individualMembers]);
    return allRecipients.size;
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Members</p>
              <p className="text-2xl font-bold">{mockMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Groups</p>
              <p className="text-2xl font-bold">{mockGroups.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Recipients Selected</p>
              <p className="text-2xl font-bold">{getTotalRecipients()}</p>
            </div>
            <Send className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {template.content.substring(0, 80)}...
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{template.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {message.length}/160 characters
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.ceil(message.length / 160)} SMS
                  </span>
                </div>
              </div>

              {showPreview && message && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                    {message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="space-y-6">
          {/* Groups */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Groups</h3>
            <div className="space-y-3">
              {mockGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className={`w-3 h-3 rounded-full ${group.color}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{group.name}</div>
                    <div className="text-sm text-gray-500">{group.memberCount} members</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Individual Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Members</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {mockMembers.filter(member => member.active).map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleMemberToggle(member.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.phone}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ready to Send</h3>
            <p className="text-gray-600">
              Message will be sent to {getTotalRecipients()} recipient(s)
            </p>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message || getTotalRecipients() === 0 || isSending}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !message || getTotalRecipients() === 0 || isSending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : sent
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isSending ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : sent ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Sent!</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send SMS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeSMS;