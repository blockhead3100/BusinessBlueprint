import { useState } from 'react';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';

export default function Clients() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  
  const handleAddClient = () => {
    setIsAddingClient(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingClient(false);
  };

  if (isAddingClient) {
    return <ClientForm onCancel={handleCancelAdd} />;
  }

  return (
    <div className="space-y-6">
      {/* Section heading and actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Client Management</h1>
        <div className="flex space-x-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input 
              type="text" 
              className="pl-8" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="clients" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-neutral-200">
          <TabsList className="bg-transparent -mb-px">
            <TabsTrigger 
              value="clients" 
              className="px-1 py-4 text-sm font-medium data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300 rounded-none border-b-2 border-transparent"
            >
              All Clients
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="px-1 py-4 text-sm font-medium data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300 rounded-none border-b-2 border-transparent"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="px-1 py-4 text-sm font-medium data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700 data-[state=inactive]:hover:border-neutral-300 rounded-none border-b-2 border-transparent"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="clients">
          <ClientList status="all" searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="active">
          <ClientList status="active" searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="archived">
          <ClientList status="archived" searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
