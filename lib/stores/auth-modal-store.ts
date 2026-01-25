import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  message: string | null;
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  message: null,
  openAuthModal: (message?: string) => set({ isOpen: true, message: message || null }),
  closeAuthModal: () => set({ isOpen: false, message: null }),
}));