import React from 'react';
import {Input} from "@/components/Input";
import {InputContextProvider} from "@/contexts/Input/Input";

export const App: React.FC = () => {
  return (
    <div className="App">
        <InputContextProvider>
            <Input />
        </InputContextProvider>
    </div>
  );
};

