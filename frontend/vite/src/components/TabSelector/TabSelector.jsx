import "./TabSelector.css";

export default function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <div
        className={`tab ${activeTab === "all" && "active"}`}
        onClick={() => setActiveTab("all")}
      >
        All jobs
      </div>
      <div
        className={`tab ${activeTab === "applied" && "active"}`}
        onClick={() => setActiveTab("applied")}
      >
        Applied
      </div>
      <div
        className={`tab ${activeTab === "saved" && "active"}`}
        onClick={() => setActiveTab("saved")}
      >
        Saved
      </div>
    </div>
  );
}
