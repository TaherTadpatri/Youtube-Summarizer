import React from 'react';

function SummaryComponent({ summary }) {
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Summary</h5>
          <p className="card-text">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryComponent;
