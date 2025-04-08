
import React, { useState } from 'react';
import { mockWebsites, mockIncidents, getDashboardStats } from '@/data/mockData';
import WebsiteCard from '@/components/WebsiteCard';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import AddWebsiteDialog from '@/components/AddWebsiteDialog';
import IncidentsList from '@/components/IncidentsList';
import { Website } from '@/types/website';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [websites, setWebsites] = useState<Website[]>(mockWebsites);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const { toast } = useToast();
  
  const stats = getDashboardStats();
  
  const handleAddWebsite = (url: string) => {
    const newWebsite: Website = {
      id: `site-${Date.now()}`,
      url,
      uptime: 100,
      latency: 200,
      lastChecked: new Date().toLocaleTimeString(),
      statusHistory: ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online'],
      responseTimes: Array.from({ length: 24 }, (_, i) => ({
        time: `${i < 10 ? '0' + i : i}:00`,
        value: Math.floor(Math.random() * 150) + 150
      })),
      httpStatus: '200 OK',
      sslExpiry: 'Jan 1, 2026',
      server: 'Unknown',
      securityThreats: 0,
      ddosAttempts: 0
    };
    
    setWebsites([newWebsite, ...websites]);
  };
  
  const handleDeleteWebsite = (id: string) => {
    setWebsites(websites.filter(website => website.id !== id));
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <DashboardHeader onAddWebsite={() => setIsAddWebsiteOpen(true)} />
      
      <DashboardStats 
        totalWebsites={websites.length}
        averageUptime={websites.reduce((sum, site) => sum + site.uptime, 0) / websites.length}
        totalThreats={websites.reduce((sum, site) => sum + site.securityThreats, 0)}
        totalDdosAttempts={websites.reduce((sum, site) => sum + site.ddosAttempts, 0)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Monitored Websites</h2>
          {websites.map((website) => (
            <WebsiteCard 
              key={website.id} 
              website={website} 
              onDelete={handleDeleteWebsite} 
            />
          ))}
          
          {websites.length === 0 && (
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
