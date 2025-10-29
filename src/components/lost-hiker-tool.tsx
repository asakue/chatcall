'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { suggestSearchAreas, type SuggestSearchAreasOutput } from '@/ai/flows/suggest-search-areas-for-lost-hiker';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { useAppContext } from './app-provider';

const formSchema = z.object({
  lastKnownLocation: z.string().min(1, 'Требуется указать последнее известное местоположение.'),
  weatherConditions: z.string().min(1, 'Требуется указать погодные условия.'),
  plannedRoute: z.string().min(1, 'Требуется указать планируемый маршрут.'),
});

export default function LostHikerTool() {
  const [result, setResult] = useState<SuggestSearchAreasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setView } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastKnownLocation: '44.2704° с.ш., 7.6946° в.д.',
      weatherConditions: 'Переменная облачность, 5°C, ветер 10 км/ч',
      plannedRoute: 'Намеревался взойти на пик, затем вернуться в базовый лагерь по северному хребту.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await suggestSearchAreas(values);
      setResult(response);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось получить предложения. Пожалуйста, попробуйте еще раз.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-full">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Инструмент поиска SOS</h2>
        <p className="text-sm text-muted-foreground">Предложения по поисковым зонам на основе ИИ.</p>
      </div>
      
      <Card className="bg-card border-border">
          <CardContent className="p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="lastKnownLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-card-foreground">Последнее известное местоположение (GPS)</FormLabel>
                        <FormControl>
                          <Input placeholder="например, 40.7128° с.ш., 74.0060° з.д." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weatherConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-card-foreground">Текущая погода</FormLabel>
                        <FormControl>
                          <Input placeholder="например, Ясно, 15°C, легкий ветер" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plannedRoute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-card-foreground">Описание планируемого маршрута</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Опишите предполагаемый путь туриста..." {...field} className="h-24" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Анализ...
                      </>
                    ) : (
                      'Предложить зоны поиска'
                    )}
                  </Button>
                </form>
              </Form>
          </CardContent>
      </Card>

      {isLoading && (
        <Card className="bg-card border-border text-center">
            <CardContent className="p-6">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-foreground" />
                <p className="mt-2 text-muted-foreground/80">ИИ анализирует данные...</p>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-accent bg-accent/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                    <Lightbulb />
                    Предложение ИИ по поиску
                </CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-card-foreground">Предлагаемые зоны</h4>
              <p className="text-sm text-card-foreground/80 whitespace-pre-wrap">{result.suggestedSearchAreas}</p>
            </div>
             <div className="!mt-6">
              <h4 className="font-semibold text-card-foreground">Уровень уверенности</h4>
              <p className="text-sm text-card-foreground/80">{result.confidenceLevel}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
