import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { AIAssistant } from "@/components/assistant/AIAssistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Home} />
      <Route path="/business-plans" component={Home} />
      <Route path="/expenses" component={Home} />
      <Route path="/clients" component={Home} />
      <Route path="/forecasting" component={Home} />
      <Route path="/market-analysis" component={Home} />
      <Route path="/pitch-deck" component={Home} />
      <Route path="/legal" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <AIAssistant />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
