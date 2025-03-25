import React from 'react';
import ResultsList from './SearchResults';

function ItemList({ items, onDeleteItem, onToggleWsLive }) {
  return (
    <div>
      {Object.values(items).map((item) => (
        <div
          key={item.searchId}
          style={{
            border: '1px solid #333',
            padding: '10px',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            backgroundColor: '#1e1e1e', // Темный фон для карточки
            borderRadius: 0, // Убираем скругления
          }}
        >
          <div style={{ flex: '0 0 200px' }}>
            <p><strong>ID:</strong> {item.searchId}</p>
            <p><strong>League:</strong> {item.leagueName}</p>
            <p style={{ 
              display: "inline-block", 
              maxWidth: "200px", 
              wordWrap: "break-word",
              maxHeight: '100px',
              overflowY: 'auto'
            }}><strong>Description:</strong> {item.description}</p>
            <button
              onClick={() => onToggleWsLive(item.searchId)}
              style={{
                backgroundColor: item.wsLive ? 'green' : item.disabled ? 'orange' : 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
              disabled={item.disabled}
            >
              {item.wsLive ? 'Выключить' : 'Включить'}
            </button>
            <button
              onClick={() => onDeleteItem(item.searchId)}
              style={{
                marginLeft: '10px',
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Удалить
            </button>
          </div>
          <ResultsList results={item.results} />
        </div>
      ))}
    </div>
  );
}

export default ItemList;