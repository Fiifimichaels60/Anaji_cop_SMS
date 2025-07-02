import React, { useState } from 'react';
import Header from './components/Header';
import ComposeSMS from './components/ComposeSMS';
import MembersManagement from './components/MembersManagement';
import MessageHistory from './components/MessageHistory';

function App() {
  const [activeTab, setActiveTab] = useState('compose');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'compose':
        return <ComposeSMS />;
      case 'members':
        return <MembersManagement />;
      case 'history':
        return <MessageHistory />;
      default:
        return <ComposeSMS />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;