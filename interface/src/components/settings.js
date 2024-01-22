import React, { useState } from 'react';

const SettingsPage = () => {
  // State for settings
  const [settings, setSettings] = useState({
    columns: 10,
    rows: 10,
    tileHeight: '0px',
    tileWidth: '0px',
    password: '*****',
    fontSize: '0px',
    fontColor: 'Black',
    backgroundColor: 'Gray',
    fontFamily: 'Eras ITC',
  });

  // Update state function
  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">My New Taskboard</h1>
          <button className="text-sm">
            <i className="fas fa-times"></i> Close
          </button>
        </div>
        <div className="bg-gray-600 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">Settings</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Settings fields */}
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  className="w-full px-3 py-1 bg-blue-600 rounded"
                  value={value}
                  onChange={(e) => updateSetting(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
