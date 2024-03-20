import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import QueryComponent from "./Query";
import SummaryComponent from "./Summary";
import Assessmentcomponent from "./Assessment";
import "./mainpage.css";
import { Button, Offcanvas } from "react-bootstrap";

function MainPage() {
  const [videoLink, setVideoLink] = useState(null);
  const [summary, setVideoSummary] = useState("");
  const [chaptersloading, setLoading] = useState(true);
  const [chapterserror, setError] = useState(null);
  const [summaryLoading, setloadingsummary] = useState(false);
  const [summaryError, setsummaryerror] = useState(false);
  const videoUrl = localStorage.getItem("Link");
  const [chapters, setChapters] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    setVideoLink(videoUrl);
    fetchSummary();
  }, [localStorage.getItem("Link")]);

  const handleShow = (buttonContent) => {
    setSelectedButton(buttonContent);
    setShowOffcanvas(true);
  };

  const handleClose = () => setShowOffcanvas(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/home/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtube_url: videoUrl }),
      });
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
        setError(null);
      } else {
        setError("Failed to fetch summary data");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Failed to fetch summary data");
    } finally {
      setLoading(false);
    }
  };
  function extractVideoId(url) {
    const pattern =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
  const videoId = extractVideoId(videoUrl);

  const handleclick = async (title) => {
    try {
      setloadingsummary(true);

      const response = await fetch("http://127.0.0.1:8000/summary/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title, videoId: videoId }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const summary = data.summary.response.message.content;
        setVideoSummary(summary);
        setsummaryerror(null);
      } else {
        setError("Failed to fetch summary data");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Failed to fetch summary data");
    } finally {
      setloadingsummary(false);
    }
  };
  const handlequeryclick = () => {
    console.log("query pressed");
  };
  console.log(videoId);
  const handleQueryClick = () => {
    setSelectedButton("query");
    setShowOffcanvas(true);
  };

  const handleAssessmentClick = () => {
    setSelectedButton("assessment");
    setShowOffcanvas(true);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="containervideo">
              {videoLink && <VideoPlayer src={videoId} />}{" "}
              <button className="btn btn-danger">summary</button>
              <button
                className="btn btn-danger"
                onClick={() => handleQueryClick()}
              >
                query
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleAssessmentClick()}
              >
                assessment
              </button>
              {summary && <SummaryComponent summary={summary} />}
              {summaryLoading && <p>Loading summary...</p>}
              {summaryError && <p>Error: {summaryError}</p>}
              <div>
                <Offcanvas
                  show={showOffcanvas}
                  onHide={handleClose}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Offcanvas.Header closeButton>
                    <h1> <Offcanvas.Title>{selectedButton}</Offcanvas.Title>  </h1>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    {selectedButton === "query" && <QueryComponent />}
                    {selectedButton === "assessment" && <Assessmentcomponent />}
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="chapterhead">
              <div className="card">
                <div>
                  <h1>Chapters</h1>
                  <ul className="list-group list-group-flush">
                    {Object.entries(chapters).map(([time, title]) => (
                      <li className="listitems" key={time}>
                        {`${title}`}
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleclick(title)}
                        >
                          learn
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
