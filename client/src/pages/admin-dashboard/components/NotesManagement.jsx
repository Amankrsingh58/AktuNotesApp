import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NotesManagement = ({ notes, onNoteAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' }
  ];

  const filteredNotes = notes?.filter(note => {
    const matchesSearch = note?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         note?.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || note?.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || note?.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'rejected':
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
            placeholder="Search notes by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
        </div>
        <div className="flex gap-3 md:gap-4">
          <div className="flex-1 sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
          </div>
          <div className="flex-1 sm:w-40">
            <Select
              options={branchOptions}
              value={branchFilter}
              onChange={setBranchFilter}
              placeholder="Filter by branch"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {filteredNotes?.map((note) => (
          <div key={note?.id} className="bg-card rounded-xl border border-border p-4 md:p-6 hover-lift transition-smooth">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={20} color="var(--color-primary)" className="md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2">
                      {note?.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">
                      {note?.subject} • {note?.semester}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(note?.status)}`}>
                        {note?.status}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {note?.branch?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Uploaded by</p>
                    <p className="text-foreground font-medium truncate">{note?.uploadedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Date</p>
                    <p className="text-foreground whitespace-nowrap">
                      {new Date(note.uploadDate)?.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Price</p>
                    <p className="text-foreground font-medium data-text">${note?.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Downloads</p>
                    <p className="text-foreground data-text">{note?.downloads}</p>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 lg:w-32">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  fullWidth
                  onClick={() => onNoteAction('view', note?.id)}
                >
                  View
                </Button>
                {note?.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      iconName="CheckCircle"
                      fullWidth
                      onClick={() => onNoteAction('approve', note?.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      iconName="XCircle"
                      fullWidth
                      onClick={() => onNoteAction('reject', note?.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash2"
                  fullWidth
                  onClick={() => onNoteAction('delete', note?.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredNotes?.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <Icon name="FileText" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
          <p className="text-sm md:text-base text-muted-foreground">No notes found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default NotesManagement;