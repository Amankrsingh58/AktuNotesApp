import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Latest 5 events</span>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, idx) => (
          <div key={idx} className="px-6 py-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center shrink-0
              ${activity.type === 'note' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}
            `}>
              <Icon name={activity.type === 'note' ? 'FileText' : 'BookOpen'} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                <span className="font-semibold">{activity.createdBy?.name || 'Admin'}</span> 
                {activity.type === 'note' ? ' uploaded a new note: ' : ' added a new PYQ: '}
                <span className="text-primary truncate inline-block max-w-[200px] align-bottom">
                  {activity.subject}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{activity.year} Year</span>
                {activity.semester && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span>Sem {activity.semester}</span>
                  </>
                )}
                {activity.Unit && (
                   <>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span>Unit {activity.Unit}</span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
