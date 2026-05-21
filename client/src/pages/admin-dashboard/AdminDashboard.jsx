import { useState } from "react";

import MetricsCard from "./components/MetricsCard";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import PyqPage from "../../features/pyq/PyqPage";
import NotesPage from "../../features/notes/NotesPage";
import { useSelector } from 'react-redux';
import AdminsTable from './components/AdminsTable';
import CreateAdminModal from './components/CreateAdminModal';
import RecentActivity from './components/RecentActivity';
import ActivityLogsTable from './components/ActivityLogsTable';
import { 
  useGetDashboardStatsQuery,
  useGetActivityLogsQuery
} from "../../features/dashboard/pyqStats";
import { 
  useGetAllAdminsQuery, 
  useCreateAdminMutation, 
  useDeleteAdminMutation, 
  useToggleUploadPermissionMutation,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllArticlesAdminQuery,
  useDeleteArticleAdminMutation
} from '../../store/api/authApi';
import UsersTable from './components/UsersTable';
import CreateUserModal from './components/CreateUserModal';
import ArticlesTable from './components/ArticlesTable';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: logs, isLoading: isLogsLoading } = useGetActivityLogsQuery(undefined, {
    skip: activeTab !== 'logs' || userRole !== 'super_admin'
  });
  
  // RTK Query hooks for admin management
  const { data: admins, isLoading: isAdminsLoading } = useGetAllAdminsQuery(undefined, {
    skip: activeTab !== 'admins' || userRole !== 'super_admin'
  });
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [toggleUploadPermission] = useToggleUploadPermissionMutation();

  // RTK Query hooks for user management
  const { data: users, isLoading: isUsersLoading } = useGetAllUsersQuery(undefined, {
    skip: activeTab !== 'users' || userRole !== 'super_admin'
  });
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // RTK Query hooks for article management
  const { data: articles, isLoading: isArticlesLoading } = useGetAllArticlesAdminQuery(undefined, {
    skip: activeTab !== 'articles' || userRole !== 'super_admin'
  });
  const [deleteArticle] = useDeleteArticleAdminMutation();

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await deleteArticle(articleId).unwrap();
        toast.success('Article deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete article');
      }
    }
  };

  const metrics = [
    {
      title: "Total Admins",
      value: stats?.admins || 0,
      icon: "Users",
      color: "#3b82f6", // Blue
    },
    {
      title: "Total Notes",
      value: stats?.notes || 0,
      icon: "FileText",
      color: "#a855f7", // Purple
    },
    {
      title: "Total PYQs",
      value: stats?.pyqs || 0,
      icon: "BookOpen",
      color: "#10b981", // Green
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads || 0,
      icon: "Download",
      color: "#f59e0b", // Orange
    }
  ];

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Overview of site statistics",
    },
    {
      id: "pyq",
      label: "PYQS",
      // description: "Manage and upload previous year question papers",
    },
    {
      id: "notes",
      label: "Notes",
      description: "Upload and manage study notes",
    },
    ...(userRole === 'super_admin' ? [
    {
      id: 'admins',
      label: 'Admins',
      description: 'Manage administrator accounts and permissions'
    },
    {
      id: 'users',
      label: 'Users',
      description: 'Manage student accounts'
    },
    {
      id: 'articles',
      label: 'Articles',
      description: 'Manage community articles and contributions'
    },
    {
      id: 'logs',
      label: 'Activity Logs',
      description: 'System-wide activity and audit trails'
    }] : [])
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

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

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData).unwrap();
      toast.success('User created successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header/>
      {/* Top Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="h-14 md:h-16 flex items-center">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Content Management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-border px-2 md:px-4 py-2 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 lg:p-8">
            {/* Section Header */}
       

            {activeTab === "pyq" && <PyqPage />}

            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {isStatsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl border border-border"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {metrics.map((metric, i) => (
                        <MetricsCard
                          key={i}
                          title={metric.title}
                          value={metric.value}
                          icon={metric.icon}
                          iconColor={metric.color}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <RecentActivity activities={stats?.recentActivity} />
                      </div>
                      
                      <div className="bg-card rounded-xl border border-border p-6 h-full flex flex-col">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Icon name="Download" size={18} className="text-primary" />
                          Download Breakdown
                        </h3>
                        
                        <div className="space-y-6 flex-1">
                          {/* PYQS SECTION */}
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">PYQ Downloads</h4>
                            <div className="space-y-3">
                              {[1, 2, 3, 4].map(year => {
                                const item = stats?.pyqDownloadBreakdown?.find(d => d.year === year) || { year, downloadCount: 0 };
                                const total = stats?.pyqDownloadBreakdown?.reduce((acc, curr) => acc + curr.downloadCount, 0) || 1;
                                return (
                                  <div key={year} className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground w-12">{year} Year</span>
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mx-3">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(item.downloadCount / total) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-semibold w-6 text-right">{item.downloadCount}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* NOTES SECTION */}
                          <div className="pt-4 border-t border-border">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Notes Downloads</h4>
                            <div className="space-y-3">
                              {[1, 2, 3, 4].map(year => {
                                const item = stats?.noteDownloadBreakdown?.find(d => d.year === year) || { year, downloadCount: 0 };
                                const total = stats?.noteDownloadBreakdown?.reduce((acc, curr) => acc + curr.downloadCount, 0) || 1;
                                return (
                                  <div key={year} className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground w-12">{year} Year</span>
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mx-3">
                                      <div 
                                        className="h-full bg-accent" 
                                        style={{ width: `${(item.downloadCount / total) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-semibold w-6 text-right">{item.downloadCount}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => setActiveTab('pyq')}
                              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
                            >
                              <Icon name="PlusCircle" size={20} className="text-muted-foreground group-hover:text-primary" />
                              <span className="text-xs font-medium">Add PYQ</span>
                            </button>
                            <button 
                              onClick={() => setActiveTab('notes')}
                              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors group"
                            >
                              <Icon name="FilePlus" size={20} className="text-muted-foreground group-hover:text-accent" />
                              <span className="text-xs font-medium">Add Note</span>
                            </button>
                            {userRole === 'super_admin' && (
                              <>
                                <button 
                                  onClick={() => setActiveTab('admins')}
                                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-blue-500 hover:bg-blue-500/5 transition-colors group"
                                >
                                  <Icon name="Users" size={20} className="text-muted-foreground group-hover:text-blue-500" />
                                  <span className="text-xs font-medium">Admins</span>
                                </button>
                                <button 
                                  onClick={() => setActiveTab('articles')}
                                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-green-500 hover:bg-green-500/5 transition-colors group"
                                >
                                  <Icon name="BookOpen" size={20} className="text-muted-foreground group-hover:text-green-500" />
                                  <span className="text-xs font-medium">Articles</span>
                                </button>
                                <button 
                                  onClick={() => setActiveTab('logs')}
                                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-orange-500 hover:bg-orange-500/5 transition-colors group"
                                >
                                  <Icon name="Activity" size={20} className="text-muted-foreground group-hover:text-orange-500" />
                                  <span className="text-xs font-medium">Audit Logs</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "notes" && <NotesPage />}

            {activeTab === 'logs' && userRole === 'super_admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">System Activity Logs</h3>
                  <div className="flex gap-2">
                    {/* Placeholder for future filters */}
                  </div>
                </div>
                
                {isLogsLoading ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading audit logs...</p>
                  </div>
                ) : (
                  <ActivityLogsTable logs={logs} />
                )}
              </div>
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

            {activeTab === 'users' && userRole === 'super_admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Student Management</h3>
                  <Button 
                    size="sm" 
                    iconName="UserPlus"
                    onClick={() => setIsUserModalOpen(true)}
                  >
                    Add User
                  </Button>
                </div>
                
                {isUsersLoading ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </div>
                ) : (
                  <UsersTable 
                    users={users} 
                    onDeleteUser={handleDeleteUser}
                  />
                )}
              </div>
            )}

            {activeTab === 'articles' && userRole === 'super_admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Community Articles</h3>
                </div>
                
                {isArticlesLoading ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading articles...</p>
                  </div>
                ) : (
                  <ArticlesTable 
                    articles={articles} 
                    onDeleteArticle={handleDeleteArticle}
                  />
                )}
              </div>
            )}

            <CreateAdminModal 
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreateAdmin}
            />

            <CreateUserModal 
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
              onCreate={handleCreateUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
