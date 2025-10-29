'use client';

import dynamic from 'next/dynamic';
import {
  Map,
  MessageSquare,
  Siren,
} from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from './ui/skeleton';
import DesktopSidebar from './desktop-sidebar';
import MobileBottomNav from './mobile-bottom-nav';
import { useAppContext, type View } from './app-provider';


const MapViewLoader = dynamic(() => import('./map-view-loader'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

const LocationTracker = dynamic(() => import('./location-tracker'), { loading: () => <Skeleton className="h-full w-full" /> });
const GroupChat = dynamic(() => import('./group-chat'), { loading: () => <Skeleton className="h-full w-full" /> });
const WeatherForecast = dynamic(() => import('./weather-forecast'), { loading: () => <Skeleton className="h-full w-full" /> });
const RoutePlanner = dynamic(() => import('./route-planner'), { loading: () => <Skeleton className="h-full w-full" /> });
const LostHikerTool = dynamic(() => import('./lost-hiker-tool'), { loading: () => <Skeleton className="h-full w-full" /> });
const EmergencyServices = dynamic(() => import('./emergency-services'), { loading: () => <Skeleton className="h-full w-full" /> });
const ProfilePage = dynamic(() => import('./profile-page'), { loading: () => <Skeleton className="h-full w-full" /> });


export default function AppLayout() {
  const { activeView, viewProps } = useAppContext();
  const isMobile = useIsMobile();

  const renderMainContent = () => {
    switch (activeView) {
      case 'map':
        return <MapViewLoader {...viewProps} />;
      case 'tracker':
        return <LocationTracker />;
      case 'chat':
        return <GroupChat />;
      case 'weather':
        return <WeatherForecast />;
      case 'routes':
        return <RoutePlanner />;
      case 'search':
        return <LostHikerTool />;
      case 'emergency':
        return <EmergencyServices />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <MapViewLoader {...viewProps}/>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        {!isMobile && (
          <DesktopSidebar />
        )}
        <main className="w-full pb-20 md:pb-0">
          {renderMainContent()}
        </main>
        {isMobile && (
          <MobileBottomNav />
        )}
      </div>
    </SidebarProvider>
  );
}
