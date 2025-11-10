'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { groups, groupChats as initialGroupChats } from '@/lib/groups-data';
import { useAppContext } from './app-provider';
import { useToast } from '@/hooks/use-toast';

export default function GroupChat() {
  const { activeGroupId, setActiveGroupId } = useAppContext();
  const [selectedGroupId, setSelectedGroupId] = useState(
    activeGroupId || groups[0].id
  );
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [, setForceUpdate] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeGroupId && activeGroupId !== selectedGroupId) {
      setSelectedGroupId(activeGroupId);
    }
  }, [activeGroupId, selectedGroupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedGroupId, initialGroupChats[selectedGroupId]?.messages.length]);
  
  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    if (setActiveGroupId) {
      setActiveGroupId(groupId);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: `g${selectedGroupId}m${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      name: 'Вы',
      avatar: 'https://picsum.photos/seed/user/40/40',
      text: newMessage,
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSender: true,
    };

    if (!initialGroupChats[selectedGroupId]) {
      initialGroupChats[selectedGroupId] = { messages: [] };
    }
    initialGroupChats[selectedGroupId].messages.push(message);

    setNewMessage('');
    setForceUpdate((v) => v + 1);

    toast({
      title: 'Сообщение отправлено!',
    });
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <Card className="flex flex-col flex-1 h-full">
        <CardHeader className="border-b p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="truncate">{selectedGroup?.name}</CardTitle>
            <Select value={selectedGroupId} onValueChange={handleGroupChange}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {initialGroupChats[selectedGroupId] &&
              initialGroupChats[selectedGroupId].messages.map((message, index) => {
                const isLastMessage = index === initialGroupChats[selectedGroupId].messages.length - 1;
                return (
                <div
                  key={message.id}
                  ref={isLastMessage ? messagesEndRef : null}
                  className={cn(
                    'flex items-end gap-2',
                    message.isSender ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!message.isSender && (
                    <Avatar className="size-8">
                      <Image
                        src={message.avatar}
                        alt={message.name}
                        width={40}
                        height={40}
                      />
                      <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-xl p-3',
                      message.isSender
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-muted-foreground rounded-bl-none'
                    )}
                  >
                    <p className="text-sm font-medium mb-1">{message.name}</p>
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        'text-xs mt-1 text-right',
                        message.isSender
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground/70'
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              )})}
          </div>
        </CardContent>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Напишите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              variant="default"
              size="icon"
              className="shrink-0"
              onClick={handleSendMessage}
            >
              <Send />
              <span className="sr-only">Отправить</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
