import React from 'react';

function LearningContent() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
      <div className="card" style={{ flex: '1 1 0', maxWidth: 'calc(50% - 10px)' ,backgroundColor : '#cef2d8' }}>
        <div className="card-body">
          <h5>Video Summaries:</h5>
          <ul>
            <li>Explanation of the importance of video summaries for effective learning.</li>
            <li>Tips for creating concise and informative video summaries.</li>
            <li>Examples of different types of video summaries (e.g., key points, highlights, summaries of longer videos).</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ flex: '1 1 0', maxWidth: 'calc(50% - 10px)' ,backgroundColor : '#cef2d8'}}>
        <div className="card-body">
          <h5>User-Generated Questions:</h5>
          <ul>
            <li>Benefits of user-generated questions for active learning and retention.</li>
            <li>Guidelines for creating effective questions (e.g., clarity, relevance, difficulty level).</li>
            <li>Examples of different types of questions (e.g., multiple choice, true/false, short answer).</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ flex: '1 1 0', maxWidth: 'calc(50% - 10px)',backgroundColor : '#cef2d8' }}>
        <div className="card-body">
          <h5>Assessments:</h5>
          <ul>
            <li>Importance of assessments for evaluating understanding and knowledge retention.</li>
            <li>Overview of different types of assessments (e.g., quizzes, tests, exams).</li>
            <li>Tips for designing fair and effective assessments.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LearningContent;
