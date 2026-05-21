import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminsTable = ({ admins, onToggleUpload, onDeleteAdmin }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upload Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {admins?.map((admin) => (
            <tr key={admin._id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-primary">
                      {admin.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{admin.name}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {admin.email}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  admin.role === 'super_admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  admin.canUpload 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {admin.canUpload ? 'Allowed' : 'Disallowed'}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onToggleUpload(admin._id)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    title={admin.canUpload ? "Disallow Upload" : "Allow Upload"}
                  >
                    <Icon name={admin.canUpload ? "Slash" : "Upload"} size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteAdmin(admin._id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete Admin"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {admins?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No admins found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminsTable;
