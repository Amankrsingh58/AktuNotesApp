import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, iconColor }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 hover-lift card-shadow hover:card-shadow-hover transition-smooth">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <div 
          className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={18} color={iconColor} className="md:w-5 md:h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        {Array.isArray(value) ? (
          <div className="space-y-1 w-full">
            {value.map((item) => (
              <div key={item.year} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{item.year} Year</span>
                <span className="text-sm font-semibold">{item.downloadCount}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {value ?? 0}
          </p>
        )}
      </div>

      {change && (
        <p className={`text-xs md:text-sm ${
          changeType === 'positive' ? 'text-success' : 
          changeType === 'negative'? 'text-error' : 'text-muted-foreground'
        }`}>
          {change}
        </p>
      )}
    </div>
  );
};

export default MetricsCard;