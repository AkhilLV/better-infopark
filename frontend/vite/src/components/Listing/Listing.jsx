import "./Listing.css";
import starIcon from "@assets/star.svg";

import { useQuery } from "@tanstack/react-query";

import { useAppliedStore, useSavedStore } from "../../state/store";

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  // Function to get ordinal suffix
  const getOrdinal = (day) => {
    if (day % 10 === 1 && day !== 11) return "st";
    if (day % 10 === 2 && day !== 12) return "nd";
    if (day % 10 === 3 && day !== 13) return "rd";
    return "th";
  };

  return `${day}${getOrdinal(day)} ${month}`;
}

export default function Listing({ activeTab }) {
  const savedIds = useSavedStore((state) => state.savedIds);
  const addSavedId = useSavedStore((state) => state.addSavedId);
  const removeSavedId = useSavedStore((state) => state.removeSavedId);

  const appliedIds = useAppliedStore((state) => state.appliedIds);
  const addAppliedId = useAppliedStore((state) => state.addAppliedId);

  const { isPending, error, data } = useQuery({
    queryKey: ["jobListings"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api");
      return await response.json();
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const filteredData = data.filter((listing) => {
    if (activeTab === "all") return !appliedIds.includes(listing.job_id);
    if (activeTab === "saved") return savedIds.includes(listing.job_id);
    if (activeTab === "applied") return appliedIds.includes(listing.job_id);
    return true;
  });

  const handleAppliedClick = (jobId) => {
    addAppliedId(jobId);
    removeSavedId(jobId);
  };

  return (
    <div className="listings">
      {/* <p className="total-jobs">Showing {filteredData.length} job listings</p> */}

      {filteredData.map((listing) => (
        <div key={listing.job_id} className="listing">
          {" "}
          <span className="posted">
            Posted {formatDate(listing.date_added)}
          </span>
          <a href={listing.company_link} className="job-company">
            {listing.company_name}
          </a>
          {/* <p>Apply before {formatDate(listing.last_date)}</p>  */}
          <a href={listing.job_link} className="job-title">
            {listing.job_title}
            {savedIds.includes(listing.job_id) && (
              <img
                width={15}
                src={starIcon}
                alt="icon of a star"
                className="star-icon"
              />
            )}
          </a>
          {/* not correct. a jobs can be both saved and applied */}
          <div className="actions">
            {activeTab !== "saved" ? (
              <button
                className="save"
                type="button"
                onClick={() => addSavedId(listing.job_id)}
              >
                Save for later
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeSavedId(listing.job_id)}
              >
                Remove from saved
              </button>
            )}

            <button
              type="button"
              className="applied"
              onClick={(e) => handleAppliedClick(listing.job_id)}
            >
              Mark applied
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
