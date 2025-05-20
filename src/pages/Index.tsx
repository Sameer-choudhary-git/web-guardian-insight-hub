import React, { useMemo, useState } from 'react';
import { mockWebsites, mockIncidents, getDashboardStats } from '@/data/mockData';
import WebsiteCard from '@/components/WebsiteCard';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import AddWebsiteDialog from '@/components/AddWebsiteDialog';
import IncidentsList from '@/components/IncidentsList';
import { Website } from '@/types/website';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/configs/config';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useWebsites } from '@/hooks/useWebsites';
import axios from 'axios';




const Index = () => {
  type UptimeStatus = "good" | "bad" | "unknown";
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { websites, fetchWebsites } = useWebsites();
  const stats = getDashboardStats();

  const processedWebsites = useMemo(() => {
    return websites.map((website) => {
      // Ensure website.tick is defined before using it
      const ticks = website.tick ?? [];

      // Sort ticks by creation time
      //it will sort ticks by creation time in decreasing order
      const sortedTicks = [...ticks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latency = sortedTicks[0]?.latency ?? 999;

      // Generate 24-hour latency data
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const last24HoursTicks = sortedTicks.filter(
        (tick) => new Date(tick.createdAt) > twentyFourHoursAgo
      );

      // Aggregate latency data into hourly windows
      const responseTimes = [];
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(Date.now() - (i + 1) * 60 * 60 * 1000);
        const hourEnd = new Date(Date.now() - i * 60 * 60 * 1000);

        const hourTicks = last24HoursTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= hourStart && tickTime < hourEnd;
        });

        // Calculate average latency for the hour or use fallback
        const avgLatency = hourTicks.length > 0
          ? hourTicks.reduce((sum, tick) => sum + tick.latency, 0) / hourTicks.length
          : null;

        responseTimes.unshift({
          time: hourStart.toLocaleTimeString(),
          value: avgLatency ?? 999 // fallback value if no data
        });
      }

      // Get the most recent 30 minutes of ticks
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(
        (tick) => new Date(tick.createdAt) > thirtyMinutesAgo
      );

      // Aggregate ticks into 3-minute windows (10 windows total)
      const windows: UptimeStatus[] = [];

      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);

        const windowTicks = recentTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter(
          (tick) => tick.status === "UP"
        ).length;
        windows[9 - i] =
          windowTicks.length === 0
            ? "unknown"
            : upTicks / windowTicks.length >= 0.5
              ? "good"
              : "bad";
      }
      console.log(windows);
      // Calculate overall status and uptime percentage
      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter((tick) => tick.status === "UP").length;
      const uptimePercentage =
        totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;

      // Get the most recent status
      const currentStatus = windows[windows.length - 1];

      // Format the last checked time
      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : "Never";

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        latency: latency,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
        responseTimes,
      };
    });
  }, [websites]);
  
  const handleAddWebsite = async (url: string) => {
    const token = await getToken();
    axios
    .post(
      `${BACKEND_URL}/api/v1/website`,
      { url, email: user?.primaryEmailAddress?.emailAddress },
      { headers: { Authorization: token } }
    )
    .then(fetchWebsites)
    .catch(console.error);   

  };
  
  const handleDeleteWebsite = async(id: string) => {
    const token = await getToken();
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/website/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      // Refresh the website list after deletion
      fetchWebsites();
    } catch (error) {
      console.error("Error deleting website:", error);
      // You could add error handling UI here
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <DashboardHeader onAddWebsite={() => setIsAddWebsiteOpen(true)} />
      
      <DashboardStats 
        totalWebsites={processedWebsites.length}
        averageUptime={processedWebsites.length > 0 ? processedWebsites.reduce((sum, site) => sum + site.uptimePercentage, 0) / processedWebsites.length : 100}
        // totalThreats={processedWebsites.reduce((sum, site) => sum + site.securityThreats, 0)}
        // totalDdosAttempts={processedWebsites.reduce((sum, site) => sum + site.ddosAttempts, 0)}
        //  currectly hardcoded to 0
        totalThreats={0}
        totalDdosAttempts={0}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Monitored Websites</h2>
          {processedWebsites.map((website) => (
            <WebsiteCard 
              key={website.id} 
              website={website} 
              onDelete={handleDeleteWebsite} 
            />
          ))}
          
          {processedWebsites.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground">No websites monitored yet</p>
              <button 
                className="mt-4 text-guardian-500 hover:text-guardian-400"
                onClick={() => setIsAddWebsiteOpen(true)}
              >
                Add your first website
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <IncidentsList incidents={mockIncidents} />
        </div>
      </div>
      
      <AddWebsiteDialog 
        open={isAddWebsiteOpen}
        onClose={() => setIsAddWebsiteOpen(false)}
        onAdd={handleAddWebsite}
      />
    </div>
  );
};

export default Index;
