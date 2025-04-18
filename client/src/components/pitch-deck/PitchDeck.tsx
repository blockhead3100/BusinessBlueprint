import { useState, useEffect } from "react";
import axios from 'axios';
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
  Trash,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



interface SlideContent {
  [key: string]: {
    [key: string]: string;
  };
}

interface Slide {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Template {
  [key: string]: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface PromptObject {
  pitchDeckData: {
    company: {
      companyName: string;
      tagline: string;
      description: string;
      founded: string;
    };
    problem: {
      problemStatement: string;
      targetAudience: string;
      currentAlternatives: string;
    };
    market: {
      TAM: string;
      SAM: string;
      SOM: string;
      marketGrowthRate: string;
      marketAnalysis: string;
    };
    otherSlides: {
      slideName: string;
      slideTitle: string;
      slideContent: string;
    }[];
    prompt: string;
  };
}

interface ActiveSlide {
  id: string;
  label: string;
  icon: React.ReactNode;
}


export default function PitchDeck() {
  const [slideContent, setSlideContent] = useState<SlideContent>({});
  const [activeSlide, setActiveSlide] = useState<string>('company');
  const [slides, setSlides] = useState<Slide[]>([
    { id: 'company', label: 'Company Overview', icon: <FileText className="mr-2 h-4 w-4" /> },
    { id: 'problem', label: 'Problem', icon: <Target className="mr-2 h-4 w-4" /> },
    { id: 'market', label: 'Market Size', icon: <BarChart2 className="mr-2 h-4 w-4" /> },

    { id: 'solution', label: 'Solution', icon: <Award className="mr-2 h-4 w-4" /> },
    { id: 'market', label: 'Market Size', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
    { id: 'competition', label: 'Competition', icon: <Users className="mr-2 h-4 w-4" /> },
    { id: 'business-model', label: 'Business Model', icon: <Layers className="mr-2 h-4 w-4" /> },
    { id: 'traction', label: 'Traction', icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { id: 'financials', label: 'Financials', icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { id: 'delete', label: 'Delete Slide', icon: <Trash className="mr-2 h-4 w-4" /> },
  ]);


  const templates: Template = {
    "startup": {
      company: {
        "Company Name": "Tech Innovators Inc.",
        Tagline: "Disrupting the future, today.",
        "Company Description":
          "Tech Innovators Inc. is a cutting-edge technology company focused on developing innovative solutions for the modern world. We strive to create products that enhance user experience and push the boundaries of what's possible.",
        Founded: "2018-07-15",
      },
      problem: {
        "Problem Statement":
          "Many individuals and businesses face challenges in managing their digital presence effectively. Existing solutions are often complex, expensive, or lack the necessary features.",
        "Who Experiences This Problem?":
          "Small to medium-sized businesses (SMBs), entrepreneurs, and individuals who need to establish and maintain a strong online presence.",
        "Current Alternatives":
          "Current alternatives include expensive marketing agencies, complex DIY tools, or a combination of both, which can be time-consuming and costly.",
      },
      market: {
        "Total Addressable Market (TAM)": "$100 billion",
        "Serviceable Available Market (SAM)": "$20 billion",
        "Serviceable Obtainable Market (SOM)": "$2 billion",
        "Market Growth Rate": "12% annually",
        "Market Analysis":
          "The market for digital presence management is rapidly expanding due to increasing internet penetration and the growing importance of online marketing.",
      },
    },
    "investor": {
      company: {
        "Company Name": "Visionary Investments LLC",
        Tagline: "Investing in tomorrow's visionaries.",
        "Company Description":
          "Visionary Investments LLC specializes in identifying and supporting high-potential startups across various sectors. We provide capital, mentorship, and strategic guidance to help our portfolio companies succeed.",
        Founded: "2015-03-20",
      },
      problem: {
        "Problem Statement":
          "Investors often struggle to identify promising startups with strong growth potential and sound business models. Traditional due diligence processes can be lengthy and inefficient.",
        "Who Experiences This Problem?":
          "Venture capitalists, angel investors, and private equity firms looking for investment opportunities in early to mid-stage companies.",
        "Current Alternatives":
          "Existing methods include attending pitch events, networking, and conducting manual research, which can be time-consuming and may not always yield the best opportunities.",
      },
      market: {
        "Total Addressable Market (TAM)": "$500 billion",
        "Serviceable Available Market (SAM)": "$100 billion",
        "Serviceable Obtainable Market (SOM)": "$10 billion",
        "Market Growth Rate": "8% annually",
        "Market Analysis":
          "The venture capital and private equity markets continue to grow, driven by innovation and the desire for high returns. Investors are increasingly seeking efficient ways to find and evaluate investment opportunities.",
      },
    },
    "product": {
      company: {
        "Company Name": "LaunchPad Solutions",
        Tagline: "Innovating product launches for success.",
        "Company Description":
          "LaunchPad Solutions offers comprehensive services to help companies launch new products effectively. Our expertise spans from market research to go-to-market strategy and execution.",
        Founded: "2019-11-10",
      },
      problem: {
        "Problem Statement":
          "Launching a new product can be challenging, with many companies facing issues such as poor market fit, ineffective marketing, and operational bottlenecks.",
        "Who Experiences This Problem?":
          "Companies of all sizes launching new products or services, particularly in competitive markets.",
        "Current Alternatives":
          "Many companies rely on in-house teams, external consultants, or a combination of both. These approaches can lack specialized expertise and may not be optimized for product launches.",
      },
      market: {
        "Total Addressable Market (TAM)": "$200 billion",
        "Serviceable Available Market (SAM)": "$40 billion",
        "Serviceable Obtainable Market (SOM)": "$4 billion",
        "Market Growth Rate": "10% annually",
        "Market Analysis":
          "The market for product launch services is expanding as companies recognize the importance of a well-executed launch for long-term success.",
      },
    },
  };
  const slideOptions: Slide[] = [
    { id: 'company', label: 'Company Overview', icon: <FileText className="mr-2 h-4 w-4" /> },
    { id: 'problem', label: 'Problem', icon: <Target className="mr-2 h-4 w-4" /> },
    { id: 'market', label: 'Market Size', icon: <BarChart2 className="mr-2 h-4 w-4" /> },

    { id: 'solution', label: 'Solution', icon: <Award className="mr-2 h-4 w-4" /> },
    { id: 'market', label: 'Market Size', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
    { id: 'competition', label: 'Competition', icon: <Users className="mr-2 h-4 w-4" /> },
    { id: 'business-model', label: 'Business Model', icon: <Layers className="mr-2 h-4 w-4" /> },
    { id: 'traction', label: 'Traction', icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { id: 'financials', label: 'Financials', icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { id: 'delete', label: 'Delete Slide', icon: <Trash className="mr-2 h-4 w-4" /> },
  ];

  useEffect(() => {
    const storedContent = localStorage.getItem("pitchDeckContent");
    if (storedContent) {
      setSlideContent(JSON.parse(storedContent));
    }
  }, []);
  useEffect(() => {
    const storedSlide = localStorage.getItem("activeSlide");
    if (typeof storedSlide === 'string') {
      setActiveSlide(storedSlide);
    }
  }, []);
  const handleSaveDraft = () => {
    localStorage.setItem("pitchDeckContent", JSON.stringify(slideContent));
    alert("Draft saved!");
  };

  const handleDeleteSlide = (slideId) => {
    if (slideId === 'delete') {
      const updatedSlides = slides.filter(slide => slide.id !== activeSlide);
      setSlides(updatedSlides);
      const newSlideContent = { ...slideContent };
      delete newSlideContent[activeSlide];
      setSlideContent(newSlideContent);
      setActiveSlide(updatedSlides.length > 0 ? updatedSlides[0].id : '');
      localStorage.setItem("pitchDeckContent", JSON.stringify(newSlideContent));
      localStorage.setItem("activeSlide", updatedSlides.length > 0 ? updatedSlides[0].id : '');
    }
  };

  const handleInputChange = (slide: string, field: string, value: string) => {
    setSlideContent({ ...slideContent, [slide]: { ...slideContent[slide], [field]: value } });
  };

  const validateInputs = (): string[] => {
    let errors = [];
    switch (activeSlide) {
      case 'company':
        if (!slideContent.company || !slideContent.company["Company Name"]) errors.push("Company Name is required.");
        if (!slideContent.company || !slideContent.company.Tagline) errors.push("Tagline is required.");
        if (!slideContent.company || !slideContent.company["Company Description"]) errors.push("Company Description is required.");
        break;
      case 'problem':
        if (!slideContent.problem || !slideContent.problem["Problem Statement"]) errors.push("Problem Statement is required.");
        if (!slideContent.problem || !slideContent.problem["Who Experiences This Problem?"]) errors.push("Target Audience description is required.");
        break;
      case 'market':
        if (!slideContent.market || !slideContent.market["Total Addressable Market (TAM)"]) errors.push("TAM is required.");
        break;
    }
    return errors;
  };

  const handleSaveSlide = () => {
    const errors = validateInputs();
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    localStorage.setItem("pitchDeckContent", JSON.stringify(slideContent));
    alert("Slide saved!");
  }

  const handleAssignToAI = async () => {
    try {
      // Extract data for "otherSlides"
      const otherSlidesData = slides
        .filter(slide => !['company', 'problem', 'market', 'delete'].includes(slide.id))
        .map(slide => ({
          slideName: slide.id,
          slideTitle: slide.label,
          slideContent: slideContent[slide.id] ? Object.values(slideContent[slide.id]).join('\n') : ""
        })) as { slideName: string; slideTitle: string; slideContent: string; }[];
  
      // Create the prompt object matching the required format
      const promptObject = {
        pitchDeckData: {
          company: slideContent.company || {
            companyName: "",
            tagline: "",
            description: "",
            founded: "",
          },
          problem: slideContent.problem || {
            problemStatement: "",
            targetAudience: "",
            currentAlternatives: "",
          },
          market: slideContent.market || {
            TAM: "",
            SAM: "",
            SOM: "",
            marketGrowthRate: "",
            marketAnalysis: "",
          },
          otherSlides: otherSlidesData,
          prompt: "Continue creating the rest of the pitch deck based off of the information provided, including financials and solution.",
        },
      };
  
      // Send the prompt to the n8n webhook
      await axios.post(
        "http://localhost:5678/webhook-test/459b0044-4cbe-4f3c-bfff-1a0ec0a6ebe2",
        promptObject
      );
  
      // After sending the prompt, make a GET request to the second webhook to get the AI response
      const response = await axios.get(
        "http://localhost:5678/webhook-test/ab9fcb42-28cf-48bf-9704-8842a931c3af"
      );
      console.log("AI Response:", response.data);
    } catch (error) {
      console.error("Error assigning to AI:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Pitch Deck Generator</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" onClick={handleSaveDraft} />
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
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    setSlideContent(templates.startup);
                    setActiveSlide("company");
                  }}
                >
                  Use Template
                </Button>



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
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    setSlideContent(templates.investor);
                    setActiveSlide("company");
                  }}>Use Template</Button>
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
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    setSlideContent(templates.product);
                    setActiveSlide("company");
                  }}>Use Template</Button>
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
              <CardContent className="p-2" >
                
                <div className="space-y-1">
                  {slideOptions.map(slide => (
                    <Button
                      key={slide.id}
                      variant={activeSlide === slide.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => { setActiveSlide(slide.id); localStorage.setItem("activeSlide", slide.id); }}

                    >
                      {slide.icon}

                      {slide.label}
                    </Button>
                  ))}                  
                  <Button
                    variant="ghost" 
                    className="w-full justify-start text-primary-600"
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
                      <Input
                        placeholder="Enter your company name"
                        value={slideContent.company ? slideContent.company["Company Name"] : ""}onChange={(e) =>
                          handleInputChange("company", "Company Name", e.target.value)
                        }


                      />
                    </div>
                    <div>
                      <Label>Tagline</Label>
                      <Input
                        placeholder="A short, memorable description"
                        value={slideContent.company ? slideContent.company.Tagline : ""}
                        onChange={(e) => handleInputChange("company", "Tagline", e.target.value)}
                      />

                    </div>
                    <div>
                      <Label>Company Description</Label>
                      <Textarea
                        placeholder="Describe what your company does in 2-3 sentences..."
                        className="min-h-[100px]"
                        value={slideContent.company ? slideContent.company["Company Description"] : ""}
                        onChange={(e) =>
                          handleInputChange("company", "Company Description", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Founded</Label>
                      <Input
                        type="date"
                        value={slideContent.company ? slideContent.company.Founded : ""}
                        onChange={(e) => handleInputChange("company", "Founded", e.target.value)}
                      />

                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="Enter your Company Location"
                        onChange={(e) => handleInputChange("company", "Location", e.target.value)}
                        value={slideContent.company ? slideContent.company.Location : ""}
                      />

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
                        value={slideContent.problem ? slideContent.problem["Problem Statement"] : ""}
                        onChange={(e) =>
                          handleInputChange("problem", "Problem Statement", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Who Experiences This Problem?</Label>
                      <Textarea
                        placeholder="Describe your target audience..."
                        className="min-h-[100px]"
                        value={slideContent.problem ? slideContent.problem["Who Experiences This Problem?"] : ""}
                        onChange={(e) =>
                          handleInputChange("problem", "Who Experiences This Problem?", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Current Alternatives</Label>
                      <Textarea
                        placeholder="How do people currently solve this problem?"
                        className="min-h-[100px]"
                        value={slideContent.problem ? slideContent.problem["Current Alternatives"] : ""}
                        onChange={(e) =>
                          handleInputChange("problem", "Current Alternatives", e.target.value)
                        }
                      />

                    </div>
                  </div>
                )}

                {activeSlide === 'market' && (
                  <div className="space-y-4">
                    <div>

                      <Label>Total Addressable Market (TAM)</Label>
                      <Input placeholder="e.g. $50 billion"
                        value={slideContent.market ? slideContent.market["Total Addressable Market (TAM)"] : ""}
                        onChange={(e) =>
                          handleInputChange("market", "Total Addressable Market (TAM)", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Serviceable Available Market (SAM)</Label>
                      <Input placeholder="e.g. $10 billion"
                        value={slideContent.market ? slideContent.market["Serviceable Available Market (SAM)"] : ""}
                        onChange={(e) =>
                          handleInputChange("market", "Serviceable Available Market (SAM)", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Serviceable Obtainable Market (SOM)</Label>
                      <Input placeholder="e.g. $1 billion"
                        value={slideContent.market ? slideContent.market["Serviceable Obtainable Market (SOM)"] : ""}
                        onChange={(e) =>
                          handleInputChange("market", "Serviceable Obtainable Market (SOM)", e.target.value)
                        }
                      />

                    </div>
                    <div>
                      <Label>Market Growth Rate</Label>
                      <Input placeholder="e.g. 15% annually"
                        value={slideContent.market ? slideContent.market["Market Growth Rate"] : ""}
                        onChange={(e) => handleInputChange("market", "Market Growth Rate", e.target.value)}                      />
                    </div>
                    <div>
                      <Label>Market Analysis</Label>
                      <Textarea
                        placeholder="Include key market trends and insights..."
                        className="min-h-[100px]"
                        value={slideContent.market ? slideContent.market["Market Analysis"] : ""}
                        onChange={(e) =>
                          handleInputChange("market", "Market Analysis", e.target.value)
                        }
                      />

                    </div>

                  </div>
                )}

                {/* Displays when any other slide is selected */}
                {!['company', 'problem', 'market'].includes(activeSlide) && (
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
                  <Button onClick={handleSaveSlide}>Save Slide</Button>
                  <Button variant="destructive" onClick={() => handleDeleteSlide('delete')}>
                    Delete Slide
                  </Button>

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
                  <FileText className="mr-2 h-4 w-4" onClick={handleSaveDraft} />
                  Save Draft
                </Button>
                <Button onClick={handleAssignToAI}>
                  Assign to AI Assistant
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
