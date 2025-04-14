import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const revenueSchema = z.object({
  initialRevenue: z.coerce.number().min(0, "Revenue must be a positive number"),
  growthRate: z.coerce
    .number()
    .min(-100, "Growth rate cannot be less than -100%")
    .max(1000, "Growth rate cannot exceed 1000%"),
  forecastMonths: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  expenses: z.coerce
    .number()
    .min(0, "Expenses must be a positive number")
    .optional(),
  expenseGrowthRate: z.coerce
    .number()
    .min(-100, "Expense growth rate cannot be less than -100%")
    .max(1000, "Expense growth rate cannot exceed 1000%")
    .optional(),
});

type RevenueFormValues = z.infer<typeof revenueSchema>;

export default function Forecasting() {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("revenue-forecast");

  const form = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      initialRevenue: 10000,
      growthRate: 5,
      forecastMonths: 12,
      expenses: 7000,
      expenseGrowthRate: 3,
    },
  });

  const onSubmit = (values: RevenueFormValues) => {
    // Generate forecast data
    const data = [];
    let currentRevenue = values.initialRevenue;
    let currentExpenses = values.expenses || 0;
    const monthlyGrowthRate = values.growthRate / 100;
    const monthlyExpenseGrowthRate = (values.expenseGrowthRate || 0) / 100;

    for (let i = 0; i < values.forecastMonths; i++) {
      const month = i + 1;
      const profit = currentRevenue - currentExpenses;
      
      data.push({
        month: `Month ${month}`,
        revenue: Math.round(currentRevenue),
        expenses: Math.round(currentExpenses),
        profit: Math.round(profit),
      });

      // Apply growth rates
      currentRevenue *= (1 + monthlyGrowthRate);
      currentExpenses *= (1 + monthlyExpenseGrowthRate);
    }

    setForecastData(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-800">
          Financial Forecasting
        </h1>
      </div>

      <Tabs
        defaultValue="revenue-forecast"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="revenue-forecast">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="break-even">Break-Even Analysis</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue-forecast">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>
                  Predict your future revenue based on growth assumptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="initialRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Monthly Revenue ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="growthRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Growth Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Monthly Expenses ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expenseGrowthRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Monthly Expense Growth Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="forecastMonths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forecast Duration (Months)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="60" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Generate Forecast
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Forecast Results</CardTitle>
                <CardDescription>
                  Visualization of your projected revenue over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {forecastData.length > 0 ? (
                  <div className="space-y-6">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={forecastData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`$${value}`, ""]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            name="Revenue"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#EF4444"
                            name="Expenses"
                          />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#10B981"
                            name="Profit"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="text-md font-medium mb-2">Summary</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-3 bg-white shadow-sm rounded-md">
                          <p className="text-sm text-neutral-500">
                            Final Monthly Revenue
                          </p>
                          <p className="text-xl font-medium text-primary-600">
                            ${forecastData[forecastData.length - 1].revenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-white shadow-sm rounded-md">
                          <p className="text-sm text-neutral-500">
                            Final Monthly Expenses
                          </p>
                          <p className="text-xl font-medium text-red-600">
                            ${forecastData[forecastData.length - 1].expenses.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-white shadow-sm rounded-md">
                          <p className="text-sm text-neutral-500">
                            Final Monthly Profit
                          </p>
                          <p className="text-xl font-medium text-green-600">
                            ${forecastData[forecastData.length - 1].profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-neutral-400">
                    <p>Enter your parameters and generate a forecast to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="break-even">
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analysis</CardTitle>
              <CardDescription>
                Calculate how many units you need to sell to break even
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Fixed Costs (per month)</FormLabel>
                      <Input type="number" placeholder="5000" />
                    </div>
                    <div>
                      <FormLabel>Variable Cost (per unit)</FormLabel>
                      <Input type="number" placeholder="25" />
                    </div>
                    <div>
                      <FormLabel>Unit Price ($)</FormLabel>
                      <Input type="number" placeholder="50" />
                    </div>
                    <Button className="w-full">Calculate Break-Even</Button>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-medium mb-4">Break-Even Results</h3>
                      <p className="mb-4">Enter your parameters and calculate to see results</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-neutral-50 rounded-md">
                          <p className="text-sm text-neutral-500">Break-Even Point (Units)</p>
                          <p className="text-xl font-medium">200 units</p>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-md">
                          <p className="text-sm text-neutral-500">Break-Even Revenue</p>
                          <p className="text-xl font-medium">$10,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Projection</CardTitle>
              <CardDescription>
                Project your cash inflows and outflows over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 space-y-4">
                    <div>
                      <FormLabel>Starting Cash Balance</FormLabel>
                      <Input type="number" placeholder="10000" />
                    </div>
                    <div>
                      <FormLabel>Projection Period</FormLabel>
                      <Select defaultValue="12">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Generate Cash Flow</Button>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <div className="p-4 h-[400px]">
                      <p className="text-center text-neutral-400 mb-4">Enter your parameters to see projected cash flow</p>
                      <div className="h-full flex items-center justify-center bg-neutral-50 rounded-lg">
                        {/* Chart will be rendered here */}
                        <p className="text-neutral-400">Cash flow chart will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
