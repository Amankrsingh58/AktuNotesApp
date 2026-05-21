import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsCharts = ({ revenueData, userGrowthData, categoryData }) => {
  const COLORS = ['#1E40AF', '#F59E0B', '#059669', '#8B5CF6', '#EF4444', '#3B82F6'];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
              Revenue Overview
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Monthly revenue for the last 6 months
            </p>
          </div>
          <Icon name="DollarSign" size={20} color="var(--color-success)" className="md:w-6 md:h-6" />
        </div>
        <div className="w-full h-64 md:h-80" aria-label="Monthly Revenue Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card rounded-xl border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                User Growth
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                New user registrations over time
              </p>
            </div>
            <Icon name="TrendingUp" size={20} color="var(--color-success)" className="md:w-6 md:h-6" />
          </div>
          <div className="w-full h-64 md:h-80" aria-label="User Growth Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                Notes by Category
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Distribution across branches
              </p>
            </div>
            <Icon name="PieChart" size={20} color="var(--color-accent)" className="md:w-6 md:h-6" />
          </div>
          <div className="w-full h-64 md:h-80" aria-label="Category Distribution Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-muted-foreground">Avg. Order Value</p>
            <Icon name="DollarSign" size={16} color="var(--color-success)" className="md:w-5 md:h-5" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-foreground data-text">$24.50</p>
          <p className="text-xs text-success mt-1">+5.2% from last month</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-muted-foreground">Conversion Rate</p>
            <Icon name="TrendingUp" size={16} color="var(--color-primary)" className="md:w-5 md:h-5" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-foreground data-text">3.8%</p>
          <p className="text-xs text-success mt-1">+0.4% from last month</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
            <Icon name="Users" size={16} color="var(--color-accent)" className="md:w-5 md:h-5" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-foreground data-text">892</p>
          <p className="text-xs text-success mt-1">+12% from last month</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-muted-foreground">Total Downloads</p>
            <Icon name="Download" size={16} color="var(--color-primary)" className="md:w-5 md:h-5" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-foreground data-text">4,567</p>
          <p className="text-xs text-success mt-1">+18% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;