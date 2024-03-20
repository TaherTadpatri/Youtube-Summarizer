import React, { useState } from "react";

function QueryComponent() {
  const [query, setQuery] = useState("");
  const [queryResponses, setQueryResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(false)
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/QandA/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: query })
      });
      if (response.ok) {
        const data = await response.json();
        
        const newResponse = { query: query, response: data.solustion.text };
        setQueryResponses([newResponse, ...queryResponses]); 
        setQuery(""); 
      } else {
        setError('Failed to fetch response');
      }
    } catch (error) {
      setError('An error occurred'); 
    } finally {
      setLoading(false); 
      setErro
    }
  };
   
   console.log(query);
  return (
    <div>
      <h1>Query</h1>
      <div style={{ display: "flex", alignItems: "center", width: "100%", marginBlockStart: "20px" }}>
        <input
          type="text"
          placeholder="Type your query here..."
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "5px 0 0 5px",
            border: "1px solid #ccc",
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0 5px 5px 0",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div className="accordion" id="queryResponses">
        {queryResponses.map((item, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                Query: {item.query}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#queryResponses"
            >
              <div className="accordion-body">{item.response}</div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
            <div className="spinner-border text-primary" role="status">
            </div>
          )}
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default QueryComponent;
