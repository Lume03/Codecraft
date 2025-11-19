'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import 'prism-themes/themes/prism-vsc-dark-plus.css';


interface Message {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

interface TheoryChatWidgetProps {
  lessonId: string;
  lessonTitle: string;
  lessonContent: string; // The full markdown text of the lesson
}

export function TheoryChatWidget({ lessonId, lessonTitle, lessonContent }: TheoryChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const user = useUser();
  const userName = user?.displayName?.split(' ')[0] || 'Estudiante';
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  // 1. Reset logic on lesson change
  useEffect(() => {
    setMessages([]);
    setHasGreeted(false);
    setIsOpen(false);
    setInput('');
    setIsLoading(false);
  }, [lessonId]);

  // 2. Automatic greeting logic
  useEffect(() => {
    if (isOpen && !hasGreeted && !isLoading) {
      const greeting: Message = {
        role: 'model',
        content: `¡Hola ${userName}! 👋 Soy Raven AI. Veo que estás estudiando "${lessonTitle}". ¿Tienes alguna duda sobre este tema?`
      };
      setMessages([greeting]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, userName, lessonTitle, isLoading]);
  
  // 3. Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMsg: Message = { role: 'user', content: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Memory optimization: send only the last 4 messages
    const recentHistory = messages.slice(-4);

    try {
      const res = await fetch('/api/chat/theory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: recentHistory,
          lessonContext: lessonContent,
          userQuery: trimmedInput,
          userName: userName
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || 'El tutor no está disponible ahora mismo.');
      }
      
      const data = await res.json();
      const aiMsg: Message = { role: 'model', content: data.text };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
          role: 'model',
          content: '⚠️ Lo siento, tuve un problema de conexión. ¿Podrías intentarlo de nuevo?',
          isError: true,
      }
      setMessages(prev => [...prev, errorMsg]);
      // Restore input for user convenience
      setInput(trimmedInput);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* CHAT WINDOW (Floats on top of everything) */}
      <div className={cn(
        "fixed bottom-24 right-4 z-50 flex flex-col gap-2 transition-all duration-300 ease-in-out sm:bottom-28 sm:right-6 md:bottom-24",
        isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      )}>
        <Card className="flex h-[clamp(400px,70vh,500px)] w-[350px] flex-col overflow-hidden rounded-2xl border-primary/20 shadow-2xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Raven AI</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 bg-secondary/30" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : msg.isError
                        ? "bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-bl-none"
                        : "bg-card border text-foreground rounded-bl-none"
                  )}>
                     {msg.role === 'model' ? (
                       <div className="prose prose-sm dark:prose-invert max-w-full leading-snug prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-ul:my-2 prose-li:my-0.5 prose-pre:my-2">
                          <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypePrism]}
                            >
                              {msg.content}
                          </ReactMarkdown>
                       </div>
                    ) : (
                      msg.content // User messages are plain text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="animate-pulse rounded-2xl rounded-bl-none border bg-card px-4 py-2 text-sm text-muted-foreground">
                     Escribiendo...
                   </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 border-t bg-background p-3">
            <Input 
              placeholder="Escribe tu duda..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>

       {/* DESKTOP FAB (Icon only) */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-10 right-8 z-50 hidden h-14 w-14 rounded-full shadow-lg shadow-primary/25 transition-transform duration-300 ease-in-out hover:scale-110 md:flex",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Bot className="h-7 w-7" />
      </Button>
      
      {/* MOBILE FAB (Icon only) */}
       <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg shadow-primary/25 transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </>
  );
}
