import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Hero from "@components/Hero/Hero";
import Listing from "@components/Listing/Listing";

import { BASE_URL } from "./api";

function App() {
  const [totalJobs, setTotalJobs] = useState(0);

  const { isPending, error, data } = useQuery({
    queryKey: ["jobStats"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/jobs/stats`);
      return await response.json();
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Hero />
      <p className="new-jobs">
        {totalJobs} total jobs, {data[data.length - 1].newJobs} posted today
      </p>
      <Listing setTotalJobs={setTotalJobs} />
    </>
  );
}

export default App;

