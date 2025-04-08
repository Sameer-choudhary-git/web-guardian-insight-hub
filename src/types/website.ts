
export interface Website {
  id: string;
  url: string;
  uptime: number;
  latency: number;
  lastChecked: string;
  statusHistory: ('online' | 'offline' | 'warning' | 'issue')[];
  responseTimes: { time: string; value: number }[];
  httpStatus: string;
  sslExpiry?: string;
  server?: string;
  securityThreats: number;
  ddosAttempts: number;
}
