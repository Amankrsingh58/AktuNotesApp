import React from 'react';
import Icon from '../../../components/AppIcon';

const NoteMetadata = ({ note }) => {
  const metadataItems = [
    { icon: 'BookOpen', label: 'Subject', value: note?.subject },
    { icon: 'Calendar', label: 'Semester', value: note?.semester },
    { icon: 'TrendingUp', label: 'Difficulty', value: note?.difficulty },
    { icon: 'FileText', label: 'Pages', value: `${note?.pageCount} pages` },
    { icon: 'Upload', label: 'Uploaded', value: note?.uploadDate },
    { icon: 'User', label: 'Author', value: note?.author }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'var(--color-success)';
      case 'medium':
        return 'var(--color-warning)';
      case 'hard':
        return 'var(--color-error)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-3">
              {note?.title}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                  <Icon
                    key={star}
                    name={star <= Math.floor(note?.rating) ? 'Star' : 'Star'}
                    size={18}
                    color={star <= Math.floor(note?.rating) ? 'var(--color-accent)' : 'var(--color-muted)'}
                    className={star <= Math.floor(note?.rating) ? 'fill-current' : ''}
                  />
                ))}
                <span className="text-sm text-foreground/70 ml-2 data-text">
                  {note?.rating} ({note?.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-semibold text-primary data-text">
              ${note?.price}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              One-time purchase
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {metadataItems?.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon
                name={item?.icon}
                size={20}
                color={item?.label === 'Difficulty' ? getDifficultyColor(item?.value) : 'var(--color-primary)'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                {item?.label}
              </div>
              <div className="text-sm font-medium text-foreground truncate">
                {item?.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {note?.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">
            Downloads
          </span>
          <span className="text-sm text-muted-foreground data-text">
            {note?.downloadCount} students
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Last Updated
          </span>
          <span className="text-sm text-muted-foreground">
            {note?.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteMetadata;