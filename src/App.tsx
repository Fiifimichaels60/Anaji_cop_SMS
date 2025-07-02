import React, { useState } from 'react';
import Header from './components/Header';
import ComposeSMS from './components/ComposeSMS';
import MembersManagement from './components/MembersManagement';
import MessageHistory from './components/MessageHistory';
import AuthWrapper from './components/AuthWrapper';

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
    <AuthWrapper>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderActiveTab()}
      </main>
    </AuthWrapper>
  );
}

export default App;