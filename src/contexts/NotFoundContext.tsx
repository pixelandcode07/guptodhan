'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NotFoundContextType {
  isNotFound: boolean;
  setIsNotFound: (value: boolean) => void;
}

const NotFoundContext = createContext<NotFoundContextType>({
  isNotFound: false,
  setIsNotFound: () => {},
});

export const NotFoundProvider = ({ children }: { children: ReactNode }) => {
  const [isNotFound, setIsNotFound] = useState(false);

  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
      {children}
    </NotFoundContext.Provider>
  );
};

export const useNotFound = () => useContext(NotFoundContext);
