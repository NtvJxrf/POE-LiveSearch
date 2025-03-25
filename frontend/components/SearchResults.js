import React, { useState } from 'react';

function ResultsList({ results }) {
  const [selectedResult, setSelectedResult] = useState(null);

  if (!results || results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="results-container">
      <strong className="results-header">Результаты:</strong>
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className="result-row" onClick={() => setSelectedResult(result)}>
            <span>ID: {result.id}</span>
            <span>Цена: {result.listing.price.amount} {result.listing.price.currency}</span>
          </div>
        ))}
      </div>
      {selectedResult && (
        <>
          {/* Оверлей для закрытия модального окна */}
          <div className="modal-overlay" onClick={() => setSelectedResult(null)} />

          {/* Модальное окно */}
          <div className="modal">
            <div className="modal-content">
              {/* Левая колонка: информация о предмете (выровнена по центру) */}
              <div className="modal-column">
                <div className="modal-header">{selectedResult.item.name}</div>
                <div className="modal-section with-border">
                  <strong>{selectedResult.item.baseType}</strong>
                </div>
                {selectedResult.item.properties && (
                  <div className="modal-section with-border">
                    {selectedResult.item.properties.map((el, index) => (
                      <strong key={index}>
                        {el.name}
                        {el.values.length > 0 && el.values[0].length > 0 ? `: ${el.values[0][0]}` : ''}
                      </strong>
                    ))}
                  </div>
                  )
                }
                {selectedResult.item.requirements && 
                 ( <>
                    <strong>Requires: </strong>
                    <div className="modal-section with-border">
                      {selectedResult.item.requirements.map((el, index) => (<strong key={index}>{el.name}: {el.values[0][0]}</strong>))}
                    </div>
                  </>)
                }
                {selectedResult.item.implicitMods && (
                  <div className="modal-section with-border">
                    {selectedResult.item.implicitMods.map((el, index) => (<strong key={index}>{el}</strong>))}
                  </div>
                  )
                }
                
                {selectedResult.item.explicitMods && (
                  <div className="modal-section">
                    {selectedResult.item.explicitMods.map((el, index) => (<strong key={index}>{el}</strong>))}
                  </div>
                  )
                }
              </div>

              {/* Правая колонка: информация о продавце (выровнена по центру вертикально) */}
              <div className="modal-column">
                <div className="modal-section">
                  <strong>price: {selectedResult.listing.price.amount} {selectedResult.listing.price.currency}</strong>
                </div>
                <div className="modal-section">
                  <strong>seller: {selectedResult.listing.account.name}</strong>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultsList;