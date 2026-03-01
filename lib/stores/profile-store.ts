import { create } from "zustand";

interface ProfilePreview {
  name: string | null;
  username: string;
  image: string | null;
}

interface ProfileStore {
  preview: ProfilePreview | null;
  setPreview: (data: ProfilePreview) => void;
  clearPreview: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  preview: null,
  setPreview: (data) => set({ preview: data }),
  clearPreview: () => set({ preview: null }),
}));
