
export interface Incident {
  id: string;
  website: string;
  timestamp: string;
  description: string;
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
}
