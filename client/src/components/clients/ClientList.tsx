import { useQuery } from '@tanstack/react-query';
import { Client } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ClientListProps {
  status: 'all' | 'active' | 'archived';
  searchTerm: string;
}

export default function ClientList({ status, searchTerm }: ClientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  // Filter clients based on status and search term
  const filteredClients = clients?.filter(client => {
    // Filter by status
    if (status !== 'all' && client.status !== status) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.industry.toLowerCase().includes(searchLower) ||
        client.contactName.toLowerCase().includes(searchLower) ||
        client.contactEmail.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients?.slice(indexOfFirstItem, indexOfLastItem);
  
  // Total pages
  const totalPages = filteredClients ? Math.ceil(filteredClients.length / itemsPerPage) : 0;
  
  // Generate initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Get badge for client status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
            Inactive
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
            Archived
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    
    // Start page
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(startPage + 4, totalPages);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(itemsPerPage)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : currentItems && currentItems.length > 0 ? (
              currentItems.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getInitials(client.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{client.name}</div>
                        <div className="text-sm text-neutral-500">{client.industry}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-neutral-900">{client.contactName}</div>
                    <div className="text-sm text-neutral-500">{client.contactEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-neutral-900">{client.projectsActive} Active</div>
                    <div className="text-sm text-neutral-500">{client.projectsCompleted} Completed</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    <Button variant="ghost" className="text-primary-600 hover:text-primary-900">
                      Edit
                    </Button>
                    <span className="mx-1 text-neutral-300">|</span>
                    <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-neutral-500">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredClients && filteredClients.length > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredClients.length)}
                </span>{" "}
                of <span className="font-medium">{filteredClients.length}</span> clients
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {generatePaginationItems()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
