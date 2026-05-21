import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import UsersTable from './components/UsersTable';
import NotesManagement from './components/NotesManagement';
import OrdersTable from './components/OrderTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import PyqPage from '../../features/pyq/PyqPage';
import { useSelector } from 'react-redux';
import AdminsTable from './components/AdminsTable';
import CreateAdminModal from './components/CreateAdminModal';
import { 
  useGetAllAdminsQuery, 
  useCreateAdminMutation, 
  useDeleteAdminMutation, 
  useToggleUploadPermissionMutation 
} from '../../store/api/authApi';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // RTK Query hooks
  const { data: admins, isLoading: isAdminsLoading } = useGetAllAdminsQuery(undefined, {
    skip: activeTab !== 'admins' || userRole !== 'super_admin'
  });
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [toggleUploadPermission] = useToggleUploadPermissionMutation();

  const mockMetrics = {
    totalUsers: { value: "1,247", change: "+12% from last month", changeType: "positive" },
    totalNotes: { value: "1,098", change: "+8% from last month", changeType: "positive" },
    totalRevenue: { value: "$24,567", change: "+15% from last month", changeType: "positive" },
    pendingReviews: { value: "23", change: "Requires attention", changeType: "neutral" }
  };

  const mockActivities = [
    {
      id: 1,
      type: "user_registered",
      description: "New student Sarah Johnson registered",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: "note_uploaded",
      description: "Dr. Michael Chen uploaded Data Structures notes",
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 3,
      type: "purchase",
      description: "Alex Martinez purchased Operating Systems notes",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 4,
      type: "review",
      description: "Emily Davis left a 5-star review on Algorithm Design",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 5,
      type: "user_registered",
      description: "New staff member Dr. Robert Wilson joined",
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 6,
      type: "note_uploaded",
      description: "Prof. Lisa Anderson uploaded Computer Networks notes",
      timestamp: new Date(Date.now() - 10800000)
    }
  ];

  const mockUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      role: "student",
      status: "active",
      joinedDate: "2025-01-15T10:30:00",
      purchaseCount: 12
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "m.chen@university.edu",
      role: "staff",
      status: "active",
      joinedDate: "2024-09-01T08:00:00",
      purchaseCount: 0
    },
    {
      id: 3,
      name: "Alex Martinez",
      email: "alex.m@university.edu",
      role: "student",
      status: "active",
      joinedDate: "2025-02-20T14:15:00",
      purchaseCount: 8
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@university.edu",
      role: "student",
      status: "suspended",
      joinedDate: "2024-11-10T09:45:00",
      purchaseCount: 5
    },
    {
      id: 5,
      name: "Dr. Robert Wilson",
      email: "r.wilson@university.edu",
      role: "staff",
      status: "active",
      joinedDate: "2024-08-15T07:30:00",
      purchaseCount: 0
    },
    {
      id: 6,
      name: "Jessica Taylor",
      email: "j.taylor@university.edu",
      role: "student",
      status: "inactive",
      joinedDate: "2024-06-05T11:20:00",
      purchaseCount: 3
    }
  ];

  const mockNotes = [
    {
      id: 1,
      title: "Data Structures and Algorithms - Complete Guide",
      subject: "Computer Science",
      semester: "Semester 3",
      branch: "computer-science",
      status: "approved",
      uploadedBy: "Dr. Michael Chen",
      uploadDate: "2025-12-20T10:00:00",
      price: 29.99,
      downloads: 156
    },
    {
      id: 2,
      title: "Operating Systems Fundamentals",
      subject: "Computer Science",
      semester: "Semester 4",
      branch: "computer-science",
      status: "pending",
      uploadedBy: "Prof. Lisa Anderson",
      uploadDate: "2025-12-22T14:30:00",
      price: 24.99,
      downloads: 0
    },
    {
      id: 3,
      title: "Digital Electronics and Logic Design",
      subject: "Electronics",
      semester: "Semester 2",
      branch: "electronics",
      status: "approved",
      uploadedBy: "Dr. Robert Wilson",
      uploadDate: "2025-12-18T09:15:00",
      price: 19.99,
      downloads: 89
    },
    {
      id: 4,
      title: "Thermodynamics and Heat Transfer",
      subject: "Mechanical Engineering",
      semester: "Semester 3",
      branch: "mechanical",
      status: "pending",
      uploadedBy: "Prof. James Brown",
      uploadDate: "2025-12-23T11:00:00",
      price: 22.99,
      downloads: 0
    },
    {
      id: 5,
      title: "Structural Analysis and Design",
      subject: "Civil Engineering",
      semester: "Semester 5",
      branch: "civil",
      status: "rejected",
      uploadedBy: "Dr. Maria Garcia",
      uploadDate: "2025-12-21T16:45:00",
      price: 27.99,
      downloads: 0
    }
  ];

  const mockOrders = [
    {
      id: 1,
      orderId: "ORD-2025-001247",
      customerName: "Sarah Johnson",
      noteTitle: "Data Structures and Algorithms - Complete Guide",
      amount: 29.99,
      status: "completed",
      date: "2025-12-23T10:30:00"
    },
    {
      id: 2,
      orderId: "ORD-2025-001246",
      customerName: "Alex Martinez",
      noteTitle: "Operating Systems Fundamentals",
      amount: 24.99,
      status: "completed",
      date: "2025-12-23T09:15:00"
    },
    {
      id: 3,
      orderId: "ORD-2025-001245",
      customerName: "Emily Davis",
      noteTitle: "Digital Electronics and Logic Design",
      amount: 19.99,
      status: "pending",
      date: "2025-12-22T16:20:00"
    },
    {
      id: 4,
      orderId: "ORD-2025-001244",
      customerName: "Jessica Taylor",
      noteTitle: "Computer Networks Essentials",
      amount: 26.99,
      status: "refunded",
      date: "2025-12-22T14:10:00"
    },
    {
      id: 5,
      orderId: "ORD-2025-001243",
      customerName: "Michael Brown",
      noteTitle: "Database Management Systems",
      amount: 31.99,
      status: "completed",
      date: "2025-12-21T11:45:00"
    }
  ];

  const revenueData = [
    { month: 'Jul', revenue: 4200 },
    { month: 'Aug', revenue: 5100 },
    { month: 'Sep', revenue: 4800 },
    { month: 'Oct', revenue: 6300 },
    { month: 'Nov', revenue: 7200 },
    { month: 'Dec', revenue: 8500 }
  ];

  const userGrowthData = [
    { month: 'Jul', users: 180 },
    { month: 'Aug', users: 220 },
    { month: 'Sep', users: 195 },
    { month: 'Oct', users: 280 },
    { month: 'Nov', users: 340 },
    { month: 'Dec', users: 427 }
  ];

  const categoryData = [
    { name: 'Computer Science', value: 245 },
    { name: 'Electronics', value: 189 },
    { name: 'Mechanical', value: 167 },
    { name: 'Civil', value: 143 },
    { name: 'Electrical', value: 156 },
    { name: 'IT', value: 198 }
  ];

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     await new Promise(resolve => setTimeout(resolve, 500));
      
    //   const storedAuth = localStorage.getItem('edunotesAuth');
    //   if (storedAuth) {
    //     const authData = JSON.parse(storedAuth);
    //     if (authData?.role === 'admin') {
    //       setIsAuthenticated(true);
    //       setUserRole(authData?.role);
    //     } else {
    //       navigate('/home');
    //     }
    //   } else {
    //     navigate('/home');
    //   }
    //   setLoading(false);
    // };

  //   checkAuth();
  // }, [navigate]);

  const navigationTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'Platform statistics and insights'
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'Users',
      description: 'Manage students, staff, and administrators'
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'FileCheck',
      description: 'Review and approve uploaded notes'
    },

    {
      id: 'orders',
      label: 'Orders',
      icon: 'ShoppingCart',
      description: 'Transaction monitoring and management'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Performance metrics and reports'
    },
    ...(userRole === 'super_admin' ? [{
      id: 'admins',
      label: 'Admins',
      icon: 'ShieldAlert',
      description: 'Manage administrator accounts and permissions'
    }] : [])
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleUserAction = (action, userId) => {
    console.log(`User action: ${action} for user ${userId}`);
  };

  const handleNoteAction = (action, noteId) => {
    console.log(`Note action: ${action} for note ${noteId}`);
  };

  const handleOrderAction = (action, orderId) => {
    console.log(`Order action: ${action} for order ${orderId}`);
  };

  const handleCreateAdmin = async (adminData) => {
    try {
      await createAdmin(adminData).unwrap();
      toast.success('Admin created successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteAdmin(adminId).unwrap();
        toast.success('Admin deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const handleToggleUpload = async (adminId) => {
    try {
      await toggleUploadPermission(adminId).unwrap();
      toast.success('Permission updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update permission');
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-sm md:text-base text-muted-foreground">Loading dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="Shield" size={20}  className=" text-primary md:w-6 md:h-6" />
                </div>
                <div>
                  <h1 className="text-base md:text-lg font-semibold text-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Platform Management
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                iconName="Home"
                onClick={() => navigate('/home')}
              >
                <span className="hidden sm:inline">Exit Admin</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="border-b border-border overflow-x-auto">
              <nav className="flex space-x-1 p-2 min-w-max">
                {navigationTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 md:py-3  rounded-lg transition-smooth ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon
                      name={tab?.icon}
                      size={16}
                      color={activeTab === tab?.id ? 'currentColor' : 'foreground'}
                      className={` md:w-5 md:h-5 text-${activeTab === tab?.id ? 'currentColor' : 'foreground'}`}
                    />
                    <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                      {tab?.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1 md:mb-2">
                  {navigationTabs?.find(tab => tab?.id === activeTab)?.label}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {navigationTabs?.find(tab => tab?.id === activeTab)?.description}
                </p>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <MetricsCard
                      title="Total Users"
                      value={mockMetrics?.totalUsers?.value}
                      change={mockMetrics?.totalUsers?.change}
                      changeType={mockMetrics?.totalUsers?.changeType}
                      icon="Users"
                      iconColor="var(--color-primary)"
                    />
                    <MetricsCard
                      title="Total Notes"
                      value={mockMetrics?.totalNotes?.value}
                      change={mockMetrics?.totalNotes?.change}
                      changeType={mockMetrics?.totalNotes?.changeType}
                      icon="FileText"
                      iconColor="var(--color-accent)"
                    />
                    <MetricsCard
                      title="Total Revenue"
                      value={mockMetrics?.totalRevenue?.value}
                      change={mockMetrics?.totalRevenue?.change}
                      changeType={mockMetrics?.totalRevenue?.changeType}
                      icon="DollarSign"
                      iconColor="var(--color-success)"
                    />
                    <MetricsCard
                      title="Pending Reviews"
                      value={mockMetrics?.pendingReviews?.value}
                      change={mockMetrics?.pendingReviews?.change}
                      changeType={mockMetrics?.pendingReviews?.changeType}
                      icon="Clock"
                      iconColor="var(--color-warning)"
                    />
                  </div>

                  <ActivityFeed activities={mockActivities} />
                </div>
              )}

              {activeTab === 'users' && (
                <UsersTable users={mockUsers} onUserAction={handleUserAction} />
              )}

              {activeTab === 'notes' && (
                <NotesManagement notes={mockNotes} onNoteAction={handleNoteAction} />
              )}
  

              {activeTab === 'orders' && (
                <OrdersTable orders={mockOrders} onOrderAction={handleOrderAction} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsCharts
                  revenueData={revenueData}
                  userGrowthData={userGrowthData}
                  categoryData={categoryData}
                />
              )}

              {activeTab === 'admins' && userRole === 'super_admin' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">All Administrators</h3>
                    <Button 
                      size="sm" 
                      iconName="UserPlus"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Add Admin
                    </Button>
                  </div>
                  
                  {isAdminsLoading ? (
                    <div className="py-12 text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading admins...</p>
                    </div>
                  ) : (
                    <AdminsTable 
                      admins={admins} 
                      onToggleUpload={handleToggleUpload}
                      onDeleteAdmin={handleDeleteAdmin}
                    />
                  )}
                </div>
              )}

              <CreateAdminModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateAdmin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;