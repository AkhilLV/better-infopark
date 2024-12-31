import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import Hero from "@components/Hero/Hero";
import Listing from "@components/Listing/Listing";
import TabSelector from "@components/TabSelector/TabSelector";

import { useSavedStore, useAppliedStore } from "./state/store"; // Import zustand stores

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState("all");

  const clearSaved = useSavedStore((state) => state.clear);
  const clearApplied = useAppliedStore((state) => state.clear);

  const handleClearLocalData = () => {
    clearSaved();
    clearApplied();
    alert("Local data cleared!");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Hero />

      {/* <button onClick={handleClearLocalData}>Clear local data</button> */}

      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <Listing activeTab={activeTab} />
    </QueryClientProvider>
  );
}

export default App;

