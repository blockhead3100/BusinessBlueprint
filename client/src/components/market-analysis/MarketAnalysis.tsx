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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Search, Users, TrendingUp, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";

// Sample data for demonstration
const competitorData = [
  { name: "Your Business", value: 25, color: "#3B82F6" },
  { name: "Competitor A", value: 35, color: "#10B981" },
  { name: "Competitor B", value: 20, color: "#F59E0B" },
  { name: "Competitor C", value: 15, color: "#6366F1" },
  { name: "Others", value: 5, color: "#D1D5DB" },
];

const demographicData = [
  { name: "18-24", value: 15, color: "#3B82F6" },
  { name: "25-34", value: 35, color: "#10B981" },
  { name: "35-44", value: 25, color: "#F59E0B" },
  { name: "45-54", value: 15, color: "#6366F1" },
  { name: "55+", value: 10, color: "#EC4899" },
];

const RADIAN = Math.PI / 180;

// Custom label for pie chart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function MarketAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">Market Analysis</h1>
      </div>

      <Tabs defaultValue="market-size">
        <TabsList className="mb-4">
          <TabsTrigger value="market-size">Market Size</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="market-size">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Market Size Estimator</CardTitle>
                <CardDescription>
                  Calculate your potential market size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Industry</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Geographic Scope</Label>
                  <Select defaultValue="national">
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local (City/County)</SelectItem>
                      <SelectItem value="regional">Regional (State/Province)</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Audience Size (Estimate)</Label>
                  <Input type="number" placeholder="1000000" />
                </div>

                <div>
                  <Label>Conversion Rate (%)</Label>
                  <Input type="number" placeholder="5" />
                </div>

                <div>
                  <Label>Average Purchase Value ($)</Label>
                  <Input type="number" placeholder="100" />
                </div>

                <Button className="w-full">Calculate Market Size</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Market Size Results</CardTitle>
                <CardDescription>
                  Your potential market statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-3 bg-primary-100 p-2 rounded-md">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">
                            Total Addressable Market
                          </p>
                          <p className="text-xl font-medium text-neutral-800">
                            10,000,000
                          </p>
                          <p className="text-xs text-neutral-500">
                            Potential customers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-3 bg-primary-100 p-2 rounded-md">
                          <TrendingUp className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">
                            Annual Market Value
                          </p>
                          <p className="text-xl font-medium text-neutral-800">
                            $50M
                          </p>
                          <p className="text-xs text-neutral-500">
                            Potential annual revenue
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-3 bg-primary-100 p-2 rounded-md">
                          <PieChartIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">
                            Market Share Potential
                          </p>
                          <p className="text-xl font-medium text-neutral-800">
                            5-10%
                          </p>
                          <p className="text-xs text-neutral-500">
                            Achievable within 2 years
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h3 className="text-md font-medium mb-3">Market Trends</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={[
                            { year: "2020", value: 3800 },
                            { year: "2021", value: 4200 },
                            { year: "2022", value: 4500 },
                            { year: "2023", value: 5100 },
                            { year: "2024(E)", value: 5800 },
                            { year: "2025(E)", value: 6700 },
                          ]}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}M`, "Market Size"]} />
                          <Legend />
                          <Bar
                            dataKey="value"
                            fill="#3B82F6"
                            name="Market Size ($M)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  Track and analyze your competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input placeholder="Add a competitor..." className="pl-8" />
                  </div>

                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={competitorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {competitorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Details</CardTitle>
                <CardDescription>
                  Add information about each competitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Competitor Name</Label>
                    <Select defaultValue="compA">
                      <SelectTrigger>
                        <SelectValue placeholder="Select competitor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compA">Competitor A</SelectItem>
                        <SelectItem value="compB">Competitor B</SelectItem>
                        <SelectItem value="compC">Competitor C</SelectItem>
                        <SelectItem value="new">Add new competitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Strengths</Label>
                    <Textarea placeholder="List their main strengths..." />
                  </div>

                  <div>
                    <Label>Weaknesses</Label>
                    <Textarea placeholder="List their weaknesses..." />
                  </div>

                  <div>
                    <Label>Pricing Strategy</Label>
                    <Select defaultValue="premium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget/Economy</SelectItem>
                        <SelectItem value="value">Value-based</SelectItem>
                        <SelectItem value="competitive">Competitive</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Market Share (%)</Label>
                    <Input type="number" placeholder="25" />
                  </div>

                  <Button className="w-full">Save Competitor Info</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>
                  Analyze your target audience demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Age Group"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Profile</CardTitle>
                <CardDescription>
                  Define your ideal customer profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Age Range</Label>
                  <Select defaultValue="25-34">
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55+">55+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Income Level</Label>
                  <Select defaultValue="middle">
                    <SelectTrigger>
                      <SelectValue placeholder="Select income level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Income</SelectItem>
                      <SelectItem value="middle">Middle Income</SelectItem>
                      <SelectItem value="high">High Income</SelectItem>
                      <SelectItem value="affluent">Affluent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Education Level</Label>
                  <Select defaultValue="bachelors">
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">High School</SelectItem>
                      <SelectItem value="somecollege">Some College</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Geographic Location</Label>
                  <Select defaultValue="urban">
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="suburban">Suburban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Primary Interests</Label>
                  <Textarea placeholder="List primary interests and behaviors of your target audience..." />
                </div>

                <Button className="w-full">Save Customer Profile</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="swot">
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
              <CardDescription>
                Identify strengths, weaknesses, opportunities, and threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <Label className="font-medium">Strengths</Label>
                    </div>
                    <Textarea 
                      placeholder="Internal factors that give you an advantage..."
                      className="min-h-[150px] border-green-200 focus-visible:ring-green-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <Label className="font-medium">Opportunities</Label>
                    </div>
                    <Textarea 
                      placeholder="External factors that could be beneficial..."
                      className="min-h-[150px] border-amber-200 focus-visible:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <Label className="font-medium">Weaknesses</Label>
                    </div>
                    <Textarea 
                      placeholder="Internal factors that could be detrimental..."
                      className="min-h-[150px] border-red-200 focus-visible:ring-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <Label className="font-medium">Threats</Label>
                    </div>
                    <Textarea 
                      placeholder="External factors that could cause problems..."
                      className="min-h-[150px] border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">Save SWOT Analysis</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
