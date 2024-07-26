import React, {createContext, FC, ReactNode, useContext} from 'react';
import useFirebaseDataService, {
  FirebaseDataServiceProps,
} from '../services/useDatabase';

const FirebaseDataContext = createContext<FirebaseDataServiceProps | undefined>(
  undefined,
);

export const useFirebaseData = (): FirebaseDataServiceProps => {
  const context = useContext(FirebaseDataContext);
  if (context === undefined) {
    throw new Error(
      'useFirebaseData must be used within an FirebaseDataProvider',
    );
  }
  return context;
};

export const DatabaseProvider: FC<{children: ReactNode}> = ({children}) => {
  const firebaseDataService = useFirebaseDataService();

  return (
    <FirebaseDataContext.Provider value={firebaseDataService}>
      {children}
    </FirebaseDataContext.Provider>
  );
};
