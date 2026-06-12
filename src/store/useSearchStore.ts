import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
  searchQuery: string;
  setIsOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleOpen: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  searchQuery: "",
  setIsOpen: (isOpen) => set({ isOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
