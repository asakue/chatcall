'use client';

import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, LogOut, Edit, TrendingUp, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: 'Выход из системы',
      description: 'Вы успешно вышли из своего аккаунта.',
    });
  };
  return (
    <div className="space-y-6 p-4 md:p-6 min-h-full">
      <h2 className="text-2xl font-bold text-foreground">Профиль</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="size-24 mb-2">
              <Image
                src="https://picsum.photos/seed/user/100/100"
                width={100}
                height={100}
                alt="Аватар пользователя"
              />
              <AvatarFallback>Д</AvatarFallback>
            </Avatar>
            <CardTitle>Даниил</CardTitle>
            <CardDescription>daniil@example.com</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full" variant="outline">
                <Edit className="mr-2" />
                Редактировать
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4">
              <User className="text-muted-foreground" />
              <div className="text-sm">
                <p className="text-muted-foreground">Имя</p>
                <p className='font-medium'>Даниил</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <Mail className="text-muted-foreground" />
              <div className="text-sm">
                <p className="text-muted-foreground">Email</p>
                <p className='font-medium'>daniil@example.com</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <Calendar className="text-muted-foreground" />
              <div className="text-sm">
                <p className="text-muted-foreground">Участник с</p>
                <p className='font-medium'>Января 2023</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2" />
              Выйти
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Статистика походов</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                <TrendingUp className="text-primary size-8"/>
                <div>
                    <p className="text-muted-foreground">Пройдено маршрутов</p>
                    <p className="text-2xl font-bold">12</p>
                </div>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                <MapPin className="text-accent size-8"/>
                <div>
                    <p className="text-muted-foreground">Общее расстояние</p>
                    <p className="text-2xl font-bold">158 км</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
