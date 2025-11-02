import React, { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import MapView from "./MapView";


function App() {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reports, setReports] = useState([]);
  const [latitude, setLatitude] = useState("");
const [longitude, setLongitude] = useState("");


  // check backend connection
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, imageUrl }),
    });
    const data = await res.json();
    alert(data.message);
    setDescription("");
    setImageUrl("");
    fetchReports();
  };

  // get all reports
  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/reports");
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🌍 Disaster Alert System</h1>
      <p>{message}</p>

      <h3>📝 Report a Disaster</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Describe the disaster..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "300px", padding: "5px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Image URL (for now)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: "300px", padding: "5px", marginTop: "10px" }}
        />
        <br />
        <input
  type="number"
  placeholder="Latitude"
  value={latitude}
  onChange={(e) => setLatitude(e.target.value)}
  required
  style={{ width: "300px", padding: "5px", marginTop: "10px" }}
/>
<br />
<input
  type="number"
  placeholder="Longitude"
  value={longitude}
  onChange={(e) => setLongitude(e.target.value)}
  required
  style={{ width: "300px", padding: "5px", marginTop: "10px" }}
/>
<br />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "5px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit Report
        </button>
      </form>

      <h3 style={{ marginTop: "40px" }}>📋 All Reports</h3>
      {reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        reports.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid gray",
              margin: "10px auto",
              width: "400px",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <p><strong>ID:</strong> {r.id}</p>
            <p><strong>Description:</strong> {r.description}</p>
            <p><strong>Time:</strong> {r.time}</p>
            {r.imageUrl && <img src={r.imageUrl} alt="" width="200" />}
          </div>
        ))
      )}
      <h3 style={{ marginTop: "40px" }}>🗺️ Disaster Locations Map</h3>
<MapView reports={reports} />

    </div>
  );
}


export default App;
