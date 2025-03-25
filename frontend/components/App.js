import React, { useState, useEffect} from 'react';
import AddItem from './AddItem';
import ItemList from './ItemList';

export const backendWs = new WebSocket(`ws://localhost:5000?poesessid=${JSON.parse(localStorage.getItem('settings'))?.poeSessionId || ''}`)

function App() {
  const [items, setItems] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    backendWs.onmessage = (message) => {
      const data = JSON.parse(message.data)
      console.log(data)
      if(data.auth)
        toggleWs(data.searchId, data.auth, false)
      else if(data.error){
        toggleWs(data.searchId, false, false)
      }
      else{
        setItems((prevItems) => {
          const updatedItems = { ...prevItems}
          for(const item of Object.keys(updatedItems)){
            updatedItems[item].results = []
          }
          for(const item in data){
            if(!items[data[item].searchId]) break
            updatedItems[data[item].searchId].results.push(data[item].item)
          }
          return updatedItems
        })
      }
    }
    backendWs.onopen = () => {
      setIsConnected(true)
    };
    backendWs.onclose = () => {
      setIsConnected(false)
    }
  },[items])
  const handleAddItem = (newItem) => {
    if(!items[newItem.searchId])
      setItems((prevItems) => ({
        ...prevItems,
        [newItem.searchId]: newItem
      }))

  }

  const handleDeleteItem = (searchId) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems }
      delete updatedItems[searchId]
      backendWs.send(JSON.stringify({searchId, type: 'toggleWs', wsLive: true}))
      return updatedItems
    })
  }

  const handleToggleWsLive = (searchId) => {
    if(!items[searchId].wsLive) toggleWs(searchId, false, true)
      else toggleWs(searchId, false, false)
    backendWs.send(JSON.stringify({...items[searchId], type: 'toggleWs'}))
  }

  const toggleWs = (searchId, wsLive, disabled) => {
    setItems((prevItems) => ({
      ...prevItems,
      [searchId]: { ...prevItems[searchId], wsLive, disabled}
    }))
  }
  return (
    <div>
      <AddItem onAddItem={handleAddItem} isConnected={isConnected}/>
      <ItemList items={items} onDeleteItem={handleDeleteItem} onToggleWsLive={handleToggleWsLive}/>
      <button onClick={() => console.log(items)}>test </button>
    </div>
  );
}

export default App;
