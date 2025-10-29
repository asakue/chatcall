import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Waypoints,
  Clock,
  Mountain,
  Footprints,
  MapPin,
  LocateFixed,
  Waves,
  Bike,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { savedRoutes } from '@/lib/routes-data';

const difficultyStyles = {
  'Легко': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Средне': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Сложно': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Очень сложно': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const typeIcons: { [key: string]: React.ElementType } = {
  'Горный': Mountain,
  'Равнинный': Footprints,
  'Сплав': Waves,
  'Велосипедный': Bike,
};


export default function RoutePlanner() {
  return (
    <div className="space-y-6 p-4 md:p-6 min-h-full">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Планировщик маршрутов
        </h2>
        <p className="text-sm text-muted-foreground">
          Планируйте и управляйте своими маршрутами.
        </p>
      </div>

      <Button className="w-full" variant="default">
        <Plus className="mr-2" />
        Планировать новый маршрут
      </Button>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">
          Сохраненные маршруты
        </h3>
        <div className="space-y-4">
          {savedRoutes.map((route) => {
            const TypeIcon = typeIcons[route.type] || Footprints;
            return (
              <Card
                key={route.id}
                className="bg-card border-border hover:border-primary/50 cursor-pointer transition-colors shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(difficultyStyles[route.difficulty])}
                    >
                      {route.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                    <MapPin className="size-3" />
                    {route.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Waypoints className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Расстояние</p>
                      <p className="font-medium">{route.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Время</p>
                      <p className="font-medium">{route.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Высота</p>
                      <p className="font-medium">{route.altitude}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Тип</p>
                      <p className="font-medium">{route.type}</p>
                    </div>
                  </div>
                </CardContent>
                <Separator className='mb-4 w-[95%] mx-auto' />
                <CardContent className='pt-0'>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LocateFixed className="size-4" />
                      <span>{route.coordinates}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
