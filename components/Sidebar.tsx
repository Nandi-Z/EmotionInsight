
import React from 'react';

interface SidebarProps {
  activeTab: 'single' | 'batch' | 'history';
  onTabChange: (tab: 'single' | 'batch' | 'history') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'single', label: 'Single Analysis', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { id: 'batch', label: 'Batch Processing', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { id: 'history', label: 'Analysis History', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center font-bold text-white">E</div>
        <h1 className="text-xl font-bold tracking-tight text-[#1F2937]">EmotionInsight</h1>
      </div>

      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-[#1E40AF] border border-blue-100 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1F2937]'
            }`}
          >
            {tab.icon}
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto absolute bottom-8 left-6 right-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Engine Status</p>
          <p className="text-sm font-bold text-[#1E40AF]">Gemini 3 Flash</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">● Operational</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
