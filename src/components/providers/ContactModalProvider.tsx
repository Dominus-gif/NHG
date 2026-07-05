"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import ContactModal from "@/components/forms/ContactModal";

type ContactModalContext = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const Ctx = createContext<ContactModalContext | null>(null);

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

export default function ContactModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}
