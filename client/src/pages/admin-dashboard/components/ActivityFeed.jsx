import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return { name: 'UserPlus', color: 'var(--color-success)' };
      case 'note_uploaded':
        return { name: 'Upload', color: 'var(--color-primary)' };
      case 'purchase':
        return { name: 'ShoppingCart', color: 'var(--color-accent)' };
      case 'review':
        return { name: 'Star', color: 'var(--color-warning)' };
      default:
        return { name: 'Activity', color: 'var(--color-muted-foreground)' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-border max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {activities?.map((activity) => {
          const iconConfig = getActivityIcon(activity?.type);
          return (
            <div key={activity?.id} className="p-3 md:p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-start space-x-3">
                <div 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconConfig?.color}15` }}
                >
                  <Icon name={iconConfig?.name} size={16} color={iconConfig?.color} className="md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-foreground mb-1">
                    {activity?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(activity?.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;