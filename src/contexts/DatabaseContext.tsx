import React, {createContext, FC, ReactNode, useContext} from 'react';
import useFirebaseDataService, {
  FirebaseDataServiceProps,
} from '../services/useDatabase';

// allows sharing of state across a component tree without prop drilling (passing props through every level of the tree).
const FirebaseDataContext = createContext<FirebaseDataServiceProps | undefined>(
  undefined,
);

// custom hook that wraps useContext to access the Firebase context safely.
export const useFirebaseData = (): FirebaseDataServiceProps => {
  const context = useContext(FirebaseDataContext); // hook that allows any component within the context provider to access the context value.
  if (context === undefined) {
    throw new Error(
      // if hook is used outside of the FirebaseDataProvider, throw an error
      'useFirebaseData must be used within an FirebaseDataProvider',
    );
  }
  return context;
};

// component that provides the Firebase context value to its child components.
export const DatabaseProvider: FC<{children: ReactNode}> = ({children}) => {
  const firebaseDataService = useFirebaseDataService();

  return (
    <FirebaseDataContext.Provider value={firebaseDataService}>
      {children}
    </FirebaseDataContext.Provider>
  );
};
