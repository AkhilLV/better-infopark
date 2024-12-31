import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSavedStore = create(
  persist(
    (set) => ({
      savedIds: [],
      addSavedId: (savedId) =>
        set((state) => {
          if (!state.savedIds.includes(savedId)) {
            return { savedIds: [...state.savedIds, savedId] };
          }
          return state;
        }),
      removeSavedId: (savedId) =>
        set((state) => ({
          savedIds: state.savedIds.filter((id) => id !== savedId),
        })),
      clear: () => set({ savedIds: [] }), // Clear saved IDs
    }),
    {
      name: "saved-ids-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export const useAppliedStore = create(
  persist(
    (set) => ({
      appliedIds: [],
      addAppliedId: (appliedId) =>
        set((state) => {
          if (!state.appliedIds.includes(appliedId)) {
            return { appliedIds: [...state.appliedIds, appliedId] };
          }
          return state;
        }),
      clear: () => set({ appliedIds: [] }), // Clear applied IDs
    }),
    {
      name: "applied-ids-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);
