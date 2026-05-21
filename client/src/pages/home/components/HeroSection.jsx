import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchSuggestions = [
    { id: 1, title: 'Data Structures and Algorithms', branch: 'Computer Science', icon: 'Code' },
    { id: 2, title: 'Digital Electronics', branch: 'Electronics', icon: 'Cpu' },
    { id: 3, title: 'Thermodynamics', branch: 'Mechanical', icon: 'Flame' },
    { id: 4, title: 'Engineering Mathematics', branch: 'All Branches', icon: 'Calculator' },
    { id: 5, title: 'Database Management Systems', branch: 'Computer Science', icon: 'Database' }
  ];

  const filteredSuggestions = searchSuggestions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes/years?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleYearSelect = (year) => {
    // navigate(`/notes/year/${year}`);
    navigate(`/pyq/semester-or-year/${year}`);
  };

  const years = [
    { year: 1, label: 'First Year', icon: 'BookOpen' },
    { year: 2, label: 'Second Year', icon: 'CodeXml' },
    { year: 3, label: 'Third Year', icon: 'Cpu' },
    { year: 4, label: 'Final Year', icon: 'GraduationCap' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-4">

        {/* ---- TEXT & SEARCH (unchanged) ---- */}
        <div className="text-center max-w-4xl mx-auto mb-12">
  <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-3 leading-tight">
    Access Quality B.Tech Notes
    <span className="block text-primary mt-1">Anytime, Anywhere</span>
  </h1>

  <p className="text-base text-muted-foreground mb-7">
    Browse, select, and purchase subject-wise notes from here.
  </p>

  <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
    <Input
      type="search"
      placeholder="Search subjects, topics..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
      }}
className="h-12 pr-28 text-foreground border-border focus:ring-2 focus:ring-primary/40"

    />
  <Button
  type="submit"
  size="sm"
  className="
    absolute right-0 top-0
    h-full px-6
    rounded-l-none
    bg-primary text-primary-foreground
    hover:opacity-90
  "
  iconName="Search"
>
  Search
</Button>


  </form>
</div>


        {/* ---- YEAR SELECTION CARDS ---- */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
  {years.map((item) => (
    <button
  key={item.year}
  onClick={() => handleYearSelect(item.year)}
  className="
    group relative animated-border
    bg-card border border-border
    rounded-xl p-6 text-center
    cursor-pointer
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-lg
    active:scale-95
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
  "
>

      {/* Icon */}
      <div className="
        w-12 h-12 mx-auto mb-3
        bg-primary/10 rounded-lg
        flex items-center justify-center
        transition-colors
        group-hover:bg-primary/20
      ">
        <Icon
          name={item.icon}
          size={22}
          className="text-primary"
        />
      </div>

      {/* Text */}
      <p className="
        text-xl font-semibold text-foreground
        group-hover:text-primary
        transition-colors
      ">
        Year {item.year}
      </p>

      <p className="text-sm text-muted-foreground">
        {item.label}
      </p>

      {/* Hover Arrow */}
      <div className="
        absolute top-3 right-3
        opacity-0 translate-x-1
        transition-all
        group-hover:opacity-100 group-hover:translate-x-0
      ">
        <Icon
          name="ArrowRight"
          size={16}
          className="text-muted-foreground"
        />
      </div>
    </button>
  ))}
</div>


      </div>
    </section>
  );
};

export default HeroSection;
