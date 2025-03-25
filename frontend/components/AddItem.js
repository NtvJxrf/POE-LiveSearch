import React, { useState } from 'react';
import { backendWs } from './App';

function AddItem({ onAddItem, isConnected }) {
  const [searchItem, setSearchItem] = useState({ searchId: '', description: '', wsLive: false, disabled: false, results: [] });
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {poeSessionId: '', leagueName: ''})

  const addItem = (e) => {
    e.preventDefault();
    if (!searchItem.searchId) return;
    onAddItem({ ...searchItem, leagueName: settings.leagueName});
    setSearchItem({ searchId: '', description: '', wsLive: false });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        placeholder='Poe session id'
        value={settings.poeSessionId}
        onChange={(e) => {
          setSettings((oldSettings) => {
            backendWs.send(JSON.stringify({poeSessionId: e.target.value, type: 'changePoeSessId'}))
            const newSettings = {...oldSettings, poeSessionId: e.target.value}
            localStorage.setItem('settings', JSON.stringify(newSettings))
            return newSettings
          })
        }}
      />
      <input
        placeholder='Poe league name'
        value={settings.leagueName}
        onChange={(e) => {
          setSettings((oldSettings) => {
            const newSettings = {...oldSettings, leagueName: e.target.value}
            localStorage.setItem('settings', JSON.stringify(newSettings))
            return newSettings
          })
        }}
      />
      <form onSubmit={addItem}>
        <input
          placeholder='Item search id'
          value={searchItem.searchId}
          onChange={(e) => setSearchItem({ ...searchItem, searchId: e.target.value })}
        />
        <input
          placeholder='description'
          value={searchItem.description}
          onChange={(e) => setSearchItem({ ...searchItem, description: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>
      <div>
        <p style={{color: isConnected ? 'green' : 'red'}}>backendserver connection
        </p>
        
      </div>
    </div>
  );
}

export default AddItem;