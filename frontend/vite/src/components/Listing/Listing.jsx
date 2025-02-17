import { useEffect } from "react";
import "./Listing.css";

import { useQuery } from "@tanstack/react-query";

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

export default function Listing({ setTotalJobs }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["jobListings"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/jobs");
      return await response.json();
    },
  });

  useEffect(() => {
    setTotalJobs(data?.length);
  }, [data, setTotalJobs]);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="listings">
      {data.map((listing) => (
        <div
          key={listing.job_id}
          className={`listing ${
            new Date(listing.date_added).toISOString().split("T")[0] === today
              ? "new"
              : ""
          }`}
        >
          <span className="posted">
            Posted {formatDate(listing.date_added)}
          </span>
          <span className="last-date">
            Apply before {formatDate(listing.last_date)}
          </span>
          <a href={listing.company_link} className="job-company">
            {listing.company_name}
          </a>
          <a href={listing.job_link} className="job-title">
            {listing.job_title}
          </a>
        </div>
      ))}
    </div>
  );
}
