
import React from 'react';

interface StatusTimelineProps {
  statuses: ('good' | 'bad' | 'warning' | 'issue')[];
}

const StatusTimeline = ({ statuses }: StatusTimelineProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good':
        return 'bg-alert-low';
      case 'bad':
        return 'bg-alert-critical';
      case 'warning':
        return 'bg-alert-high';
      case 'issue':
        return 'bg-alert-medium';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="status-timeline">
      {statuses.map((status, index) => (
        <div 
          key={index}
          className={`status-timeline-item ${getStatusColor(status)}`}
          title={`Status: ${status}`}
        />
      ))}
    </div>
  );
};

export default StatusTimeline;
