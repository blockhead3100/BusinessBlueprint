import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Shield,
  Globe,
  Building,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: "document" | "guide" | "form" | "checklist";
  category: string;
}

export default function LegalResources() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample resource data
  const resources: ResourceItem[] = [
    {
      id: "bp-1",
      title: "Business Plan Template",
      description: "A comprehensive template for creating a detailed business plan.",
      type: "document",
      category: "business-formation",
    },
    {
      id: "llc-1",
      title: "LLC Formation Checklist",
      description: "Step-by-step guide for forming a Limited Liability Company.",
      type: "checklist",
      category: "business-formation",
    },
    {
      id: "priv-1",
      title: "Privacy Policy Generator",
      description: "Create a customized privacy policy for your website or app.",
      type: "form",
      category: "compliance",
    },
    {
      id: "tos-1",
      title: "Terms of Service Template",
      description: "Standard terms of service agreement template.",
      type: "document",
      category: "compliance",
    },
    {
      id: "tax-1",
      title: "Tax Filing Guide for Small Businesses",
      description: "Comprehensive guide to business tax obligations and filing procedures.",
      type: "guide",
      category: "taxes",
    },
    {
      id: "ip-1",
      title: "Intellectual Property Protection Guide",
      description: "How to protect your business's intellectual property assets.",
      type: "guide",
      category: "intellectual-property",
    },
    {
      id: "emp-1",
      title: "Employee Handbook Template",
      description: "Customizable employee handbook for small to medium businesses.",
      type: "document",
      category: "employment",
    },
    {
      id: "cont-1",
      title: "Service Agreement Template",
      description: "Standard contract for providing services to clients.",
      type: "document",
      category: "contracts",
    },
  ];

  // Filter resources based on search term
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get resources for a specific category
  const getResourcesByCategory = (category: string) =>
    resources.filter((resource) => resource.category === category);

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "document":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Document
          </Badge>
        );
      case "guide":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Guide
          </Badge>
        );
      case "form":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Form
          </Badge>
        );
      case "checklist":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Checklist
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Legal Resources</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        <Input
          className="pl-10"
          placeholder="Search legal resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="business-formation">Business Formation</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchTerm
              ? filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    badge={getTypeBadge(resource.type)}
                  />
                ))
              : resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    badge={getTypeBadge(resource.type)}
                  />
                ))}
          </div>
        </TabsContent>

        <TabsContent value="business-formation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Formation Guide</CardTitle>
                <CardDescription>
                  Learn about different business structures and choose the right one for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Sole Proprietorship</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-neutral-600 mb-3">
                        A sole proprietorship is the simplest business structure where you are the sole owner and personally liable for your business.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Easy to form with minimal paperwork</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Complete control over your business</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-red-500">✗</div>
                          <p className="ml-2 text-sm text-neutral-600">Unlimited personal liability</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Limited Liability Company (LLC)</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-neutral-600 mb-3">
                        An LLC is a business structure that combines the pass-through taxation of a sole proprietorship with the limited liability of a corporation.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Limited personal liability protection</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Flexible management structure</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-red-500">✗</div>
                          <p className="ml-2 text-sm text-neutral-600">More paperwork and fees than sole proprietorship</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Corporation</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-neutral-600 mb-3">
                        A corporation is a legal entity separate from its owners, offering the strongest protection from personal liability.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Maximum personal liability protection</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                          <p className="ml-2 text-sm text-neutral-600">Easier to raise capital and transfer ownership</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-red-500">✗</div>
                          <p className="ml-2 text-sm text-neutral-600">Double taxation (corporate and personal income)</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-red-500">✗</div>
                          <p className="ml-2 text-sm text-neutral-600">More complex reporting requirements</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getResourcesByCategory("business-formation").map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  badge={getTypeBadge(resource.type)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getResourcesByCategory("compliance").map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                badge={getTypeBadge(resource.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="taxes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getResourcesByCategory("taxes").map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                badge={getTypeBadge(resource.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getResourcesByCategory("contracts").map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                badge={getTypeBadge(resource.type)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Legal Resources Directory</CardTitle>
          <CardDescription>
            Explore these trusted external resources for more legal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Small Business Administration (SBA)</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Government resources for starting and growing small businesses
                  </p>
                  <div className="flex items-center text-primary-600 text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>sba.gov</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-md mr-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">SCORE</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Free small business advice and mentoring
                  </p>
                  <div className="flex items-center text-primary-600 text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>score.org</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-md mr-4">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">FindLaw Small Business</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Legal articles and resources for small business owners
                  </p>
                  <div className="flex items-center text-primary-600 text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>findlaw.com/smallbusiness</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-md mr-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Nolo</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    DIY legal guides and forms for business owners
                  </p>
                  <div className="flex items-center text-primary-600 text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>nolo.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ResourceCardProps {
  resource: ResourceItem;
  badge: React.ReactNode;
}

function ResourceCard({ resource, badge }: ResourceCardProps) {
  return (
    <Card className="hover:border-primary-300 transition-colors cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          {badge}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 mb-4">{resource.description}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
