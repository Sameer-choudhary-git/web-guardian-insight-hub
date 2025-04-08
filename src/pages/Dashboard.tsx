
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, BarChart2, Clock, AlertTriangle, Settings } from 'lucide-react';
import { getDashboardStats } from '@/data/mockData';

const Dashboard = () => {
  const stats = getDashboardStats();

  // Set the document title using the standard DOM API
  React.useEffect(() => {
    document.title = "Dashboard | Web Guardian";
    return () => {
      // Optional cleanup when component unmounts
      document.title = "Web Guardian";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Advanced Dashboard</h1>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Sites"
              value={stats.totalWebsites.toString()}
              icon={<BarChart2 className="h-4 w-4 text-guardian-500" />}
              change="+1"
              positive={true}
            />
            <MetricCard 
              title="Average Uptime"
              value={`${stats.averageUptime.toFixed(2)}%`}
              icon={<Clock className="h-4 w-4 text-guardian-500" />}
              change="-0.3%"
              positive={false}
            />
            <MetricCard 
              title="Security Threats"
              value={stats.totalThreats.toString()}
              icon={<Shield className="h-4 w-4 text-guardian-500" />}
              change="+2"
              positive={false}
            />
            <MetricCard 
              title="DDoS Attacks"
              value={stats.totalDdosAttempts.toString()}
              icon={<AlertTriangle className="h-4 w-4 text-guardian-500" />}
              change="0"
              positive={true}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 card-gradient">
              <h2 className="text-lg font-medium mb-4">Response Time Analysis</h2>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Response time visualization would appear here</p>
              </div>
            </Card>
            
            <Card className="p-4 card-gradient">
              <h2 className="text-lg font-medium mb-4">Traffic Analysis</h2>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Traffic visualization would appear here</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="p-4 card-gradient">
            <h2 className="text-lg font-medium mb-4">Security Overview</h2>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Security visualization would appear here</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card className="p-4 card-gradient">
            <h2 className="text-lg font-medium mb-4">Performance Metrics</h2>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Performance visualization would appear here</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4 mt-4">
          <Card className="p-4 card-gradient">
            <h2 className="text-lg font-medium mb-4">Alert Configuration</h2>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Alert configuration would appear here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}

const MetricCard = ({ title, value, icon, change, positive }: MetricCardProps) => {
  return (
    <Card className="p-4 card-gradient">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${positive ? 'text-alert-low' : 'text-alert-high'}`}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        <div className="p-2 bg-secondary rounded-md">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;
