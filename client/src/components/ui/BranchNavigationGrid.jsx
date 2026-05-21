import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BranchNavigationGrid = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const branchData = [
        {
          id: 'computer-science',
          name: 'Computer Science',
          icon: 'Laptop',
          noteCount: 245,
          color: 'var(--color-primary)',
          description: 'Programming, algorithms, data structures'
        },
        {
          id: 'electronics',
          name: 'Electronics & Communication',
          icon: 'Cpu',
          noteCount: 189,
          color: '#8B5CF6',
          description: 'Circuits, signals, communication systems'
        },
        {
          id: 'mechanical',
          name: 'Mechanical Engineering',
          icon: 'Settings',
          noteCount: 167,
          color: '#EF4444',
          description: 'Thermodynamics, mechanics, manufacturing'
        },
        {
          id: 'civil',
          name: 'Civil Engineering',
          icon: 'Building2',
          noteCount: 143,
          color: '#F59E0B',
          description: 'Structures, construction, surveying'
        },
        {
          id: 'electrical',
          name: 'Electrical Engineering',
          icon: 'Zap',
          noteCount: 156,
          color: '#10B981',
          description: 'Power systems, machines, control'
        },
        {
          id: 'information-technology',
          name: 'Information Technology',
          icon: 'Globe',
          noteCount: 198,
          color: '#3B82F6',
          description: 'Networks, databases, web development'
        }
      ];

      setBranches(branchData);
      setLoading(false);
    };

    fetchBranches();
  }, []);

  const handleBranchClick = (branchId) => {
    navigate(`/branch-notes-list?branch=${branchId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6]?.map((i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-8 border border-border animate-pulse"
          >
            <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {branches?.map((branch, index) => (
        <button
          key={branch?.id}
          onClick={() => handleBranchClick(branch?.id)}
          className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-smooth hover-lift card-shadow hover:card-shadow-hover text-left group"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'scale-in 250ms ease-out forwards',
            opacity: 0
          }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-smooth group-hover:scale-110"
            style={{ backgroundColor: `${branch?.color}15` }}
          >
            <Icon name={branch?.icon} size={24} color={branch?.color} />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
            {branch?.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {branch?.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/70 data-text">
              {branch?.noteCount} notes
            </span>
            <Icon
              name="ArrowRight"
              size={18}
              color="var(--color-primary)"
              className="opacity-0 group-hover:opacity-100 transition-smooth transform group-hover:translate-x-1"
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export default BranchNavigationGrid;