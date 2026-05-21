import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedNotesCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredNotes = [
  {
    id: 1,
    title: 'Complete Data Structures & Algorithms Guide',
    branch: 'Computer Science',
    semester: '3rd Semester',
    rating: 4.9,
    reviews: 234,
    price: 29.99,
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1dc1ac663-1764663759590.png",
    thumbnailAlt: 'Open textbook showing data structures diagrams with binary trees and algorithms on white pages with colorful annotations',
    author: 'Dr. Sarah Mitchell',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116492473-1763296099355.png",
    authorAvatarAlt: 'Professional headshot of woman with brown hair in navy blazer smiling warmly',
    pages: 156,
    downloads: 1247
  },
  {
    id: 2,
    title: 'Digital Electronics Comprehensive Notes',
    branch: 'Electronics & Communication',
    semester: '2nd Semester',
    rating: 4.8,
    reviews: 189,
    price: 24.99,
    thumbnail: "https://images.unsplash.com/photo-1697071327741-04319e5d54d3",
    thumbnailAlt: 'Close-up view of green circuit board with electronic components resistors capacitors and integrated circuits showing detailed pathways',
    author: 'Prof. James Chen',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1665ca73c-1763296377705.png",
    authorAvatarAlt: 'Professional headshot of Asian man with glasses in gray suit with confident expression',
    pages: 142,
    downloads: 987
  },
  {
    id: 3,
    title: 'Thermodynamics & Heat Transfer',
    branch: 'Mechanical Engineering',
    semester: '4th Semester',
    rating: 4.7,
    reviews: 156,
    price: 27.99,
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_10bd63279-1766505752040.png",
    thumbnailAlt: 'Industrial machinery with steam and heat waves visible showing thermodynamic processes in manufacturing environment',
    author: 'Dr. Robert Kumar',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1597163eb-1763300719854.png",
    authorAvatarAlt: 'Professional headshot of Indian man with short black hair in white shirt with friendly smile',
    pages: 178,
    downloads: 823
  },
  {
    id: 4,
    title: 'Database Management Systems Complete',
    branch: 'Information Technology',
    semester: '5th Semester',
    rating: 4.9,
    reviews: 267,
    price: 32.99,
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1bff0cc1b-1764677600001.png",
    thumbnailAlt: 'Computer screen displaying database schema diagrams with tables relationships and SQL queries on dark background',
    author: 'Dr. Emily Watson',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1985c262f-1763294244026.png",
    authorAvatarAlt: 'Professional headshot of blonde woman with glasses in blue blouse with warm smile',
    pages: 189,
    downloads: 1456
  }];


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNotes?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredNotes?.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + featuredNotes?.length) % featuredNotes?.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % featuredNotes?.length);
  };

  const handlePreview = (noteId) => {
    navigate(`/note-details?id=${noteId}`);
  };

  const currentNote = featuredNotes?.[currentSlide];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-3 md:mb-4">
            <Icon name="Star" size={18} color="var(--color-accent)" />
            <span className="text-xs md:text-sm font-medium text-accent">
              Featured Notes
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Top Rated Academic Materials
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-measure mx-auto">
            Handpicked notes from our best educators to help you excel
          </p>
        </div>

        <div className="relative">
          <div className="bg-card rounded-2xl border border-border overflow-hidden card-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <Image
                  src={currentNote?.thumbnail}
                  alt={currentNote?.thumbnailAlt}
                  className="w-full h-full object-cover" />

                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold data-text">
                  ${currentNote?.price}
                </div>
              </div>

              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3 md:mb-4">
                    <span className="text-xs md:text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {currentNote?.branch}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {currentNote?.semester}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">
                    {currentNote?.title}
                  </h3>

                  <div className="flex items-center space-x-4 mb-4 md:mb-6">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={18} color="var(--color-accent)" className="fill-current" />
                      <span className="text-sm md:text-base font-semibold text-foreground data-text">
                        {currentNote?.rating}
                      </span>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        ({currentNote?.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-border">
                    <Image
                      src={currentNote?.authorAvatar}
                      alt={currentNote?.authorAvatarAlt}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />

                    <div>
                      <p className="text-sm md:text-base font-medium text-foreground">
                        {currentNote?.author}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Verified Educator
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="text-center">
                      <Icon name="FileText" size={20} color="var(--color-primary)" className="mx-auto mb-1 md:mb-2" />
                      <p className="text-base md:text-lg font-semibold text-foreground data-text">
                        {currentNote?.pages}
                      </p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Download" size={20} color="var(--color-success)" className="mx-auto mb-1 md:mb-2" />
                      <p className="text-base md:text-lg font-semibold text-foreground data-text">
                        {currentNote?.downloads}
                      </p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Clock" size={20} color="var(--color-accent)" className="mx-auto mb-1 md:mb-2" />
                      <p className="text-base md:text-lg font-semibold text-foreground data-text">
                        24h
                      </p>
                      <p className="text-xs text-muted-foreground">Access</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => handlePreview(currentNote?.id)}>

                    Preview
                  </Button>
                  <Button
                    variant="default"
                    fullWidth
                    iconName="ShoppingCart"
                    iconPosition="left"
                    onClick={() => handlePreview(currentNote?.id)}>

                    Purchase Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrevious}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-card border border-border rounded-full items-center justify-center hover:bg-muted transition-smooth card-shadow z-10"
            aria-label="Previous slide">

            <Icon name="ChevronLeft" size={24} color="var(--color-foreground)" />
          </button>

          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-card border border-border rounded-full items-center justify-center hover:bg-muted transition-smooth card-shadow z-10"
            aria-label="Next slide">

            <Icon name="ChevronRight" size={24} color="var(--color-foreground)" />
          </button>

          <div className="flex lg:hidden justify-center space-x-3 mt-6">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-smooth"
              aria-label="Previous slide">

              <Icon name="ChevronLeft" size={20} color="var(--color-foreground)" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-smooth"
              aria-label="Next slide">

              <Icon name="ChevronRight" size={20} color="var(--color-foreground)" />
            </button>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {featuredNotes?.map((_, index) =>
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-smooth ${
              index === currentSlide ?
              'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`
              }
              aria-label={`Go to slide ${index + 1}`} />

            )}
          </div>
        </div>
      </div>
    </section>);

};

export default FeaturedNotesCarousel;