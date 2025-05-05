import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  BarChart2,
  Users,
  TrendingUp,
  DollarSign,
  Layers,
  Target,
  Award,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PitchDeck() {
  const [activeSlide, setActiveSlide] = useState('company');
  const [slideOptions, setSlideOptions] = useState([
    { id: 'company', label: 'Company Overview', icon: <FileText className="mr-2 h-4 w-4" /> },
    { id: 'problem', label: 'Problem', icon: <Target className="mr-2 h-4 w-4" /> },
    { id: 'solution', label: 'Solution', icon: <Award className="mr-2 h-4 w-4" /> },
    { id: 'market', label: 'Market Size', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
    { id: 'competition', label: 'Competition', icon: <Users className="mr-2 h-4 w-4" /> },
    { id: 'business-model', label: 'Business Model', icon: <Layers className="mr-2 h-4 w-4" /> },
    { id: 'traction', label: 'Traction', icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { id: 'financials', label: 'Financials', icon: <DollarSign className="mr-2 h-4 w-4" /> },
  ]);

  const handleSaveSlide = (slideId, formData) => {
    console.log(`Saving slide ${slideId} with data:`, formData);
    // Add logic to persist the form data, e.g., API call or state update
  };

  const handleTemplateSelection = (templateId) => {
    console.log(`Template ${templateId} selected.`);
    setActiveSlide(templateId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Pitch Deck Generator</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="editor">Deck Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:border-primary-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle>Startup Pitch</CardTitle>
                <CardDescription>
                  Perfect for early-stage startups seeking investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-neutral-50 flex items-center justify-center rounded-md mb-4">
                  <FileText className="h-16 w-16 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500">
                  Includes slides for problem statement, solution, market size, competition, business model, team, and financials.
                </p>
                <Button className="w-full mt-4" onClick={() => handleTemplateSelection('company')}>Use Template</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle>Investor Deck</CardTitle>
                <CardDescription>
                  Detailed presentation for sophisticated investors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-neutral-50 flex items-center justify-center rounded-md mb-4">
                  <DollarSign className="h-16 w-16 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500">
                  Focuses on growth metrics, financial projections, market validation, and return on investment potential.
                </p>
                <Button className="w-full mt-4" onClick={() => handleTemplateSelection('financials')}>Use Template</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle>Product Launch</CardTitle>
                <CardDescription>
                  Showcase your new product or service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-neutral-50 flex items-center justify-center rounded-md mb-4">
                  <Layers className="h-16 w-16 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500">
                  Highlights product features, benefits, target audience, pricing strategy, and go-to-market plan.
                </p>
                <Button className="w-full mt-4" onClick={() => handleTemplateSelection('solution')}>Use Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Slides</CardTitle>
                <CardDescription>
                  Edit or rearrange your slides
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {slideOptions.map(slide => (
                    <Button
                      key={slide.id}
                      variant={activeSlide === slide.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSlide(slide.id)}
                    >
                      {slide.icon}
                      {slide.label}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-primary-600"
                    onClick={() => {
                      const newSlide = { id: `new-slide-${Date.now()}`, label: 'New Slide', icon: <FileText className="mr-2 h-4 w-4" /> };
                      setSlideOptions((prev) => [...prev, newSlide]);
                      setActiveSlide(newSlide.id);
                    }}
                  >
                    + Add New Slide
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {slideOptions.find(s => s.id === activeSlide)?.label || 'Slide Editor'}
                    </CardTitle>
                    <CardDescription>
                      Edit the content of this slide
                    </CardDescription>
                  </div>
                  <Select defaultValue="corporate">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSlide === 'company' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input placeholder="Enter your company name" />
                    </div>
                    <div>
                      <Label>Tagline</Label>
                      <Input placeholder="A short, memorable description" />
                    </div>
                    <div>
                      <Label>Company Description</Label>
                      <Textarea 
                        placeholder="Describe what your company does in 2-3 sentences..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label>Founded</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Logo Upload</Label>
                      <div className="mt-1 flex items-center">
                        <div className="border border-dashed border-neutral-300 rounded-md p-6 w-full text-center cursor-pointer hover:bg-neutral-50">
                          <p className="text-neutral-500 text-sm">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-neutral-400 text-xs mt-1">
                            SVG, PNG, JPG (max. 2MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide === 'problem' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Problem Statement</Label>
                      <Textarea 
                        placeholder="Describe the problem your product or service solves..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label>Who Experiences This Problem?</Label>
                      <Textarea 
                        placeholder="Describe your target audience..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label>Current Alternatives</Label>
                      <Textarea 
                        placeholder="How do people currently solve this problem?" 
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {activeSlide === 'market' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Total Addressable Market (TAM)</Label>
                      <Input placeholder="e.g. $50 billion" />
                    </div>
                    <div>
                      <Label>Serviceable Available Market (SAM)</Label>
                      <Input placeholder="e.g. $10 billion" />
                    </div>
                    <div>
                      <Label>Serviceable Obtainable Market (SOM)</Label>
                      <Input placeholder="e.g. $1 billion" />
                    </div>
                    <div>
                      <Label>Market Growth Rate</Label>
                      <Input placeholder="e.g. 15% annually" />
                    </div>
                    <div>
                      <Label>Market Analysis</Label>
                      <Textarea 
                        placeholder="Include key market trends and insights..." 
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {activeSlide === 'business-model' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Business Model</Label>
                      <Textarea 
                        placeholder="Describe your business model..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label>Revenue Streams</Label>
                      <Textarea 
                        placeholder="Describe your revenue streams..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label>Upload Supporting Documents</Label>
                      <div className="mt-1 flex items-center justify-center border border-dashed border-neutral-300 rounded-md p-6 w-full text-center cursor-pointer hover:bg-neutral-50">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log(`File uploaded: ${file.name}`);
                              // Add logic to handle the uploaded file
                            }
                          }}
                        />
                        <div>
                          <p className="text-neutral-500 text-sm">Click to upload or drag and drop</p>
                          <p className="text-neutral-400 text-xs mt-1">SVG, PNG, JPG (max. 2MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Displays when any other slide is selected */}
                {!['company', 'problem', 'market', 'business-model'].includes(activeSlide) && (
                  <div className="space-y-4">
                    <div>
                      <Label>Slide Title</Label>
                      <Input placeholder={`Enter ${slideOptions.find(s => s.id === activeSlide)?.label} title`} />
                    </div>
                    <div>
                      <Label>Slide Content</Label>
                      <Textarea 
                        placeholder={`Enter content for ${slideOptions.find(s => s.id === activeSlide)?.label} slide...`} 
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label>Add Image (Optional)</Label>
                      <div className="mt-1 flex items-center">
                        <div className="border border-dashed border-neutral-300 rounded-md p-6 w-full text-center cursor-pointer hover:bg-neutral-50">
                          <p className="text-neutral-500 text-sm">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-neutral-400 text-xs mt-1">
                            SVG, PNG, JPG (max. 2MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Reset Slide</Button>
                  <Button onClick={() => handleSaveSlide(activeSlide, {})}>Save Slide</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Pitch Deck Preview</CardTitle>
              <CardDescription>
                Review how your pitch deck will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-neutral-50 rounded-lg h-[400px] flex items-center justify-center">
                <div className="bg-white shadow-xl aspect-[16/9] w-full max-w-2xl overflow-hidden">
                  <div className="p-8 h-full flex flex-col">
                    <h1 className="text-2xl font-bold text-neutral-800 mb-2">Company Name</h1>
                    <p className="text-neutral-500 italic mb-6">A short, memorable tagline</p>
                    
                    <div className="flex-grow flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-neutral-300 mb-4 mx-auto" />
                        <p className="text-neutral-400">Deck content will appear here</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-2 mt-6">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export to PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
