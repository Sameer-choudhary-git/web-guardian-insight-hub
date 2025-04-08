
import { Website } from '@/types/website';
import { Incident } from '@/types/incident';

// Generate random response time data
const generateResponseTimeData = (count: number, baseValue: number, variance: number) => {
  const data = [];
  const hours = Array.from({ length: count }, (_, i) => {
    const hour = i % 24;
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
  });
  
  for (let i = 0; i < count; i++) {
    const randomVariance = Math.random() * variance * 2 - variance;
    data.push({
      time: hours[i],
      value: Math.max(50, Math.round(baseValue + randomVariance))
    });
  }
  
  return data;
};

// Mock website data
export const mockWebsites: Website[] = [
  {
    id: '1',
    url: 'http://google.com',
    uptime: 90.8,
    latency: 1285,
    lastChecked: '3:18:19 pm',
    statusHistory: ['online', 'online', 'issue', 'online', 'warning', 'online', 'online', 'online', 'warning', 'online'],
    responseTimes: generateResponseTimeData(24, 1200, 200),
    httpStatus: '200 OK',
    sslExpiry: 'Jan 15, 2026',
    server: 'gws',
    securityThreats: 2,
    ddosAttempts: 0
  },
  {
    id: '2',
    url: 'https://dpin.onrender.com/',
    uptime: 96.7,
    latency: 174,
    lastChecked: '3:17:45 pm',
    statusHistory: ['online', 'online', 'online', 'online', 'issue', 'online', 'online', 'online', 'online', 'online'],
    responseTimes: generateResponseTimeData(24, 180, 50),
    httpStatus: '200 OK',
    sslExpiry: 'Dec 10, 2025',
    server: 'Render',
    securityThreats: 0,
    ddosAttempts: 0
  },
  {
    id: '3',
    url: 'https://google.com',
    uptime: 100.0,
    latency: 504,
    lastChecked: '3:16:32 pm',
    statusHistory: ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online'],
    responseTimes: generateResponseTimeData(24, 500, 100),
    httpStatus: '200 OK',
    sslExpiry: 'Jan 15, 2026',
    server: 'gws',
    securityThreats: 0,
    ddosAttempts: 0
  },
  {
    id: '4',
    url: 'https://example.com',
    uptime: 85.2,
    latency: 722,
    lastChecked: '3:15:10 pm',
    statusHistory: ['warning', 'offline', 'issue', 'online', 'warning', 'online', 'issue', 'online', 'warning', 'online'],
    responseTimes: generateResponseTimeData(24, 700, 300),
    httpStatus: '200 OK',
    sslExpiry: 'Mar 22, 2026',
    server: 'Apache',
    securityThreats: 8,
    ddosAttempts: 3
  }
];

// Mock incident data
export const mockIncidents: Incident[] = [
  {
    id: '1',
    website: 'example.com',
    timestamp: '2025-04-08 15:23:45',
    description: 'Multiple DDoS attempts detected and blocked',
    status: 'Resolved'
  },
  {
    id: '2',
    website: 'google.com',
    timestamp: '2025-04-08 14:12:30',
    description: 'Elevated latency detected (1285ms)',
    status: 'Investigating'
  },
  {
    id: '3',
    website: 'example.com',
    timestamp: '2025-04-08 10:45:22',
    description: 'Suspicious traffic pattern detected from 45.67.32.11',
    status: 'Monitoring'
  }
];

// Stats calculations
export const getDashboardStats = () => {
  const totalWebsites = mockWebsites.length;
  
  const totalUptime = mockWebsites.reduce((acc, site) => acc + site.uptime, 0);
  const averageUptime = totalWebsites > 0 ? totalUptime / totalWebsites : 0;
  
  const totalThreats = mockWebsites.reduce((acc, site) => acc + site.securityThreats, 0);
  
  const totalDdosAttempts = mockWebsites.reduce((acc, site) => acc + site.ddosAttempts, 0);
  
  return {
    totalWebsites,
    averageUptime,
    totalThreats,
    totalDdosAttempts
  };
};
