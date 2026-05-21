import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrdersTable = ({ orders, onOrderAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order?.orderId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         order?.customerName?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'refunded':
        return 'text-error bg-error/10';
      default:
        return 'text-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>
      <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Note
                </th>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders?.map((order) => (
                <tr key={order?.id} className="hover:bg-muted/20 transition-smooth">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="text-xs md:text-sm font-medium text-primary data-text">
                      {order?.orderId}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <p className="text-xs md:text-sm text-foreground truncate max-w-[150px]">
                      {order?.customerName}
                    </p>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <p className="text-xs md:text-sm text-foreground truncate max-w-[200px]">
                      {order?.noteTitle}
                    </p>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="text-xs md:text-sm font-medium text-foreground data-text">
                      ${order?.amount}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
                      {order?.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="text-xs md:text-sm text-foreground whitespace-nowrap">
                      {new Date(order.date)?.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onOrderAction('view', order?.id)}
                      />
                      {order?.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="RefreshCw"
                          onClick={() => onOrderAction('refund', order?.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:hidden space-y-3 md:space-y-4">
        {filteredOrders?.map((order) => (
          <div key={order?.id} className="bg-card rounded-xl border border-border p-4 md:p-5">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-primary data-text mb-1">
                  {order?.orderId}
                </p>
                <p className="text-xs md:text-sm text-foreground font-medium truncate">
                  {order?.customerName}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)} flex-shrink-0 ml-2`}>
                {order?.status}
              </span>
            </div>

            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Note</p>
                <p className="text-xs md:text-sm text-foreground line-clamp-2">{order?.noteTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-xs md:text-sm text-foreground font-medium data-text">${order?.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-xs md:text-sm text-foreground whitespace-nowrap">
                    {new Date(order.date)?.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                fullWidth
                onClick={() => onOrderAction('view', order?.id)}
              >
                View Details
              </Button>
              {order?.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={() => onOrderAction('refund', order?.id)}
                >
                  Refund
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredOrders?.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <Icon name="ShoppingCart" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
          <p className="text-sm md:text-base text-muted-foreground">No orders found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;