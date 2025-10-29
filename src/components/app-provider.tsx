'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

export type View =
  | 'map'
  | 'tracker'
  | 'chat'
  | 'weather'
  | 'routes'
  | 'search'
  | 'emergency'
  | 'profile';

type MapOverlay = {
  id: string;
  type: 'searchArea';
  polygon: [number, number][];
};

type AppContextType = {
  activeView: View;
  setActiveView: (view: View) => void;
  viewProps: any;
  setView: (view: View, props?: any) => void;
  activeGroupId?: string;
  setActiveGroupId: (id: string | undefined) => void;
  mapOverlays: MapOverlay[];
  setMapOverlays: React.Dispatch<React.SetStateAction<MapOverlay[]>>;
  removeMapOverlay: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState<View>('map');
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>();
  const [viewProps, setViewProps] = useState<any>({});
  const [mapOverlays, setMapOverlays] = useState<MapOverlay[]>([]);

  const setView = (view: View, props: any = {}) => {
    setActiveView(view);
    setViewProps(props);
    if (props.groupId) {
      setActiveGroupId(props.groupId);
    }
  };
  
  const removeMapOverlay = (id: string) => {
    setMapOverlays(overlays => overlays.filter(o => o.id !== id));
  }

  const contextValue = {
    activeView,
    setActiveView,
    viewProps,
    setView,
    activeGroupId,
    setActiveGroupId,
    mapOverlays,
    setMapOverlays,
    removeMapOverlay
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
