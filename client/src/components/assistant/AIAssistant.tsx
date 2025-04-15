import { useState, useEffect } from 'react';
import { MessageSquare, X, ChevronUp, Send, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock response generation - this would be replaced with actual AI integration
const getAssistantResponse = async (message: string): Promise<string> => {
  // This is a placeholder - eventually you'd connect to OpenAI or another service
  if (message.toLowerCase().includes('template')) {
    return "I can help you create a template for your business plan. Just specify what kind of business you're planning for, and what sections you'd like to include.";
  } else if (message.toLowerCase().includes('loan') || message.toLowerCase().includes('bank')) {
    return "When preparing a business plan for a loan application, be sure to focus on your financial projections, market analysis, and competitive advantage. Lenders look for clear repayment strategies and realistic revenue forecasts.";
  } else if (message.toLowerCase().includes('financial') || message.toLowerCase().includes('projection')) {
    return "Financial projections should include cash flow statements, balance sheets, and income statements for at least 3-5 years. Be conservative in your revenue estimates and comprehensive about expenses.";
  } else {
    return "I'm here to help with any aspect of your business plan. You can ask me about templates, financial projections, market analysis, or any other section you're working on.";
  }
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const { toast } = useToast();

  // Add initial greeting when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hi, I'm Bill, your AI business blueprinter. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsWaitingForResponse(true);
    
    try {
      const response = await getAssistantResponse(message);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive"
      });
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="rounded-full h-14 w-14 fixed bottom-6 right-6 shadow-lg z-50 p-0 bg-primary-600 hover:bg-primary-700"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-[350px] shadow-xl z-50 transition-all duration-200 ease-in-out",
      isMinimized ? "h-12" : "h-[500px]",
    )}>
      <CardHeader 
        className="px-4 py-2 border-b flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary-600" />
          <CardTitle className="text-sm font-medium">Business Plan Assistant</CardTitle>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { 
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}>
            <ChevronUp className={cn("h-4 w-4", isMinimized && "rotate-180")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { 
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto flex-1 h-[380px]">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}
                >
                  <div 
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%] break-words",
                      msg.isUser 
                        ? "bg-primary-600 text-white" 
                        : "bg-neutral-100 text-neutral-800"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isWaitingForResponse && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 text-neutral-800 rounded-lg px-3 py-2">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0">
            <div className="relative w-full flex items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about business plans..."
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 h-8 w-8 text-primary-600"
                onClick={sendMessage}
                disabled={isWaitingForResponse || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}