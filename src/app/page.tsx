'use client';

import AppLayout from '@/components/app-layout';
import { AppProvider } from '@/components/app-provider';

export default function Page() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
