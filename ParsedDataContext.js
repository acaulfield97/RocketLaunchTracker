import React, {createContext, useState} from 'react';

export const ParsedDataContext = createContext();

export const ParsedDataProvider = ({children}) => {
  const [parsedData, setParsedData] = useState([]);

  return (
    <ParsedDataContext.Provider value={{parsedData, setParsedData}}>
      {children}
    </ParsedDataContext.Provider>
  );
};
