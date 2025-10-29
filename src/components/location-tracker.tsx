'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, History, Plus, Waypoints, Mountain, Download } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { groups } from "@/lib/groups-data";
import { useAppContext } from "./app-provider";


const difficultyStyles = {
  'Легко': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Средне': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Сложно': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Очень сложно': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const parseCoords = (coords?: string): [number, number] | null => {
  if (!coords) {
    return null;
  }
  const parts = coords.replace(/° с\.ш\.,?|° в\.д\./g, '').split(/,?\s+/);
  if (parts.length === 2) {
    const [lat, lon] = parts.map(parseFloat);
    if (!isNaN(lat) && !isNaN(lon)) {
      return [lat, lon];
    }
  }
  return null;
};


export default function LocationTracker() {
  const { setView } = useAppContext();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const hikers = selectedGroup.hikers;

  const handleShowOnMap = (coords?: string) => {
    const parsed = parseCoords(coords);
    if (parsed) {
        setView('map', { centerOn: parsed });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-full">
      <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-foreground">Трекер группы</h2>
             <div className="text-sm text-muted-foreground mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>{selectedGroup.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Waypoints className="size-4" />
                  <span>{selectedGroup.distance}</span>
                </div>
                 <div className="flex items-center gap-2">
                  <Mountain className="size-4" />
                  <span className={cn('font-medium', difficultyStyles[selectedGroup.difficulty].replace('bg-', 'text-').split(' ')[0])}>{selectedGroup.difficulty}</span>
                </div>
              </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Выберите группу" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Button variant="outline" className="w-full sm:w-auto">
            <Plus className="mr-2 size-4"/>
            Создать группу
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {hikers.map(hiker => (
          <Card key={hiker.id} className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <Image
                      src={hiker.avatar}
                      alt={hiker.name}
                      width={40}
                      height={40}
                    />
                    <AvatarFallback>{hiker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-card-foreground">{hiker.name}</p>
                    <p className="text-xs text-muted-foreground">Батарея: {hiker.battery}%</p>
                  </div>
                </div>
                <Badge variant={hiker.status === 'В лагере' ? 'secondary' : 'default'} className={cn('shrink-0', hiker.status === 'На тропе' ? 'bg-primary/20 text-primary border-primary/30' : hiker.status === 'На воде' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : '')}>
                  {hiker.status}
                </Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span>{hiker.coords}</span>
                </div>
                <div className="flex items-center gap-2">
                  <History className="size-4" />
                  <span>{hiker.lastUpdate}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleShowOnMap(hiker.coords)}>На карте</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Офлайн-карты</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Скачайте карты для использования в офлайн-режиме, когда нет связи.</p>
            <Button className="w-full">
                <Download className="mr-2" />
                Скачать карту перевала
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
