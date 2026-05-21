import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const DetailTabs = ({ note }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'contents', label: 'Table of Contents', icon: 'List' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'related', label: 'Related Notes', icon: 'BookOpen' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-foreground mb-3">
                About This Note
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {note?.description}
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-3">
                What You'll Learn
              </h4>
              <ul className="space-y-2">
                {note?.learningPoints?.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Icon name="CheckCircle2" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-3">
                Prerequisites
              </h4>
              <p className="text-sm text-foreground/80">
                {note?.prerequisites}
              </p>
            </div>
          </div>
        );

      case 'contents':
        return (
          <div className="space-y-3">
            {note?.tableOfContents?.map((chapter, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-sm font-semibold text-primary data-text min-w-[2rem]">
                    {String(index + 1)?.padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-foreground mb-1">
                      {chapter?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {chapter?.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground data-text whitespace-nowrap ml-4">
                  {chapter?.pages} pages
                </span>
              </div>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-4xl font-semibold text-foreground data-text">
                    {note?.rating}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5]?.map((star) => (
                      <Icon
                        key={star}
                        name="Star"
                        size={20}
                        color="var(--color-accent)"
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {note?.reviewCount} reviews
                </p>
              </div>

              <Button variant="outline" iconName="MessageSquare" iconPosition="left">
                Write a Review
              </Button>
            </div>
            <div className="space-y-4">
              {note?.reviews?.map((review, index) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review?.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review?.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={14}
                          color={star <= review?.rating ? 'var(--color-accent)' : 'var(--color-muted)'}
                          className={star <= review?.rating ? 'fill-current' : ''}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 mb-3">
                    {review?.comment}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-smooth">
                      <Icon name="ThumbsUp" size={14} />
                      <span>Helpful ({review?.helpfulCount})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-smooth">
                      <Icon name="MessageSquare" size={14} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'related':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {note?.relatedNotes?.map((relatedNote, index) => (
              <div
                key={index}
                className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-smooth cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={24} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
                      {relatedNote?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      {relatedNote?.subject}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} color="var(--color-accent)" className="fill-current" />
                        <span className="text-xs text-foreground/70 data-text">
                          {relatedNote?.rating}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-primary data-text">
                        ${relatedNote?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-1 p-2 min-w-max">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-smooth whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon
                name={tab?.icon}
                size={18}
                color={activeTab === tab?.id ? 'currentColor' : 'var(--color-foreground)'}
              />
              <span className="text-sm font-medium">{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 md:p-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DetailTabs;