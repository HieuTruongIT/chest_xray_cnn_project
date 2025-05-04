import React from 'react';

const tabs = [
  'Upload',
  'Classification',
  'Bounding Box',
  'Severity',
  'Recommendation',
  'Report'
];

export default function TabNavigation({ currentTab, setCurrentTab }) {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrentTab(tab)}
          className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
            currentTab === tab
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}