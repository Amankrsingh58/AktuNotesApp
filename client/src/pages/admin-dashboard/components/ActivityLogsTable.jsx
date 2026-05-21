import React from 'react';
import { format } from 'date-fns';
import Icon from '../../../components/AppIcon';

const ActivityLogsTable = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-12 text-center bg-card rounded-xl border border-border">
        <Icon name="History" size={40} className="mx-auto mb-3 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">No activity logs found.</p>
      </div>
    );
  }

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'text-red-500 bg-red-500/10';
    if (action.includes('UPLOAD') || action.includes('CREATE')) return 'text-green-500 bg-green-500/10';
    if (action.includes('UPDATE') || action.includes('TOGGLE')) return 'text-blue-500 bg-blue-500/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{log.admin?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{log.admin?.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground max-w-xs truncate" title={log.details}>
                    {log.details}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.createdAt), 'MMM dd, yyyy • HH:mm:ss')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {log.ipAddress || '—'}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogsTable;
