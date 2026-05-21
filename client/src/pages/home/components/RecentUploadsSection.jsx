import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentUploadsSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recent');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const recentNotes = [
      {
        id: 5,
        title: 'Operating Systems Concepts',
        branch: 'Computer Science',
        semester: '4th Semester',
        rating: 4.8,
        reviews: 145,
        price: 26.99,
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_150b5ebf8-1765295140835.png",
        thumbnailAlt: 'Computer screen displaying operating system interface with multiple windows and system processes running',
        author: 'Dr. Michael Brown',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f7b74a8f-1763293826963.png",
        authorAvatarAlt: 'Professional headshot of man with brown hair in black shirt with confident smile',
        pages: 134,
        uploadDate: '2025-12-20',
        trending: true
      },
      {
        id: 6,
        title: 'Power Systems Analysis',
        branch: 'Electrical Engineering',
        semester: '6th Semester',
        rating: 4.7,
        reviews: 98,
        price: 28.99,
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_16b7e831e-1765567338855.png",
        thumbnailAlt: 'Electrical power grid diagram with transmission lines transformers and distribution networks on technical blueprint',
        author: 'Prof. Lisa Anderson',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17187f2d5-1763301571161.png",
        authorAvatarAlt: 'Professional headshot of woman with red hair in green blazer with warm expression',
        pages: 167,
        uploadDate: '2025-12-19',
        trending: false
      },
      {
        id: 7,
        title: 'Structural Engineering Fundamentals',
        branch: 'Civil Engineering',
        semester: '3rd Semester',
        rating: 4.6,
        reviews: 112,
        price: 25.99,
        thumbnail: "https://images.unsplash.com/photo-1721244654346-9be0c0129e36",
        thumbnailAlt: 'Architectural blueprint showing structural engineering plans with beams columns and foundation details',
        author: 'Dr. David Martinez',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_114713e0c-1763295039795.png",
        authorAvatarAlt: 'Professional headshot of Hispanic man with glasses in blue shirt with friendly demeanor',
        pages: 145,
        uploadDate: '2025-12-18',
        trending: true
      },
      {
        id: 8,
        title: 'Computer Networks Complete Guide',
        branch: 'Information Technology',
        semester: '5th Semester',
        rating: 4.9,
        reviews: 203,
        price: 31.99,
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1c069732d-1764757637236.png",
        thumbnailAlt: 'Network diagram showing interconnected computers servers and routers with data flow visualization',
        author: 'Dr. Jennifer Lee',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b1b32f79-1763293656871.png",
        authorAvatarAlt: 'Professional headshot of Asian woman with long black hair in white blouse with confident smile',
        pages: 198,
        uploadDate: '2025-12-21',
        trending: true
      },
      {
        id: 9,
        title: 'Machine Design Principles',
        branch: 'Mechanical Engineering',
        semester: '5th Semester',
        rating: 4.7,
        reviews: 134,
        price: 29.99,
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_120a36365-1766505752049.png",
        thumbnailAlt: 'Mechanical gears and components showing machine design elements with precision engineering details',
        author: 'Prof. Thomas Wilson',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_103f2c54c-1763291944450.png",
        authorAvatarAlt: 'Professional headshot of elderly man with gray hair in brown jacket with wise expression',
        pages: 176,
        uploadDate: '2025-12-17',
        trending: false
      },
      {
        id: 10,
        title: 'Microprocessors & Microcontrollers',
        branch: 'Electronics & Communication',
        semester: '4th Semester',
        rating: 4.8,
        reviews: 167,
        price: 27.99,
        thumbnail: "https://images.unsplash.com/photo-1610717952008-3e392205fdd1",
        thumbnailAlt: 'Close-up of microprocessor chip on circuit board with pins and electronic pathways visible',
        author: 'Dr. Rachel Green',
        authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1be53b7-1763295352081.png",
        authorAvatarAlt: 'Professional headshot of woman with blonde hair in red blazer with professional demeanor',
        pages: 154,
        uploadDate: '2025-12-22',
        trending: true
      }];


      setNotes(recentNotes);
      setLoading(false);
    };

    fetchNotes();
  }, []);

  const filteredNotes = activeTab === 'recent' ?
  notes :
  notes?.filter((note) => note?.trending);

  const handleNoteClick = (noteId) => {
    navigate(`/note-details?id=${noteId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10 lg:mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Latest Additions
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Fresh content uploaded by our educators
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-card rounded-lg p-1 border border-border w-fit">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              activeTab === 'recent' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'}`
              }>

              Recent Uploads
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              activeTab === 'trending' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground'}`
              }>

              Trending
            </button>
          </div>
        </div>

        {loading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6]?.map((i) =>
          <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-muted"></div>
                <div className="p-4 md:p-5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </div>
          )}
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredNotes?.map((note, index) =>
          <div
            key={note?.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-smooth hover-lift card-shadow hover:card-shadow-hover group cursor-pointer"
            onClick={() => handleNoteClick(note?.id)}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'scale-in 250ms ease-out forwards',
              opacity: 0
            }}>

                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                src={note?.thumbnail}
                alt={note?.thumbnailAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />

                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold data-text">
                    ${note?.price}
                  </div>
                  {note?.trending &&
              <div className="absolute top-3 left-3 bg-error text-error-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Icon name="TrendingUp" size={14} />
                      <span>Trending</span>
                    </div>
              }
                  <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                    {formatDate(note?.uploadDate)}
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {note?.branch}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {note?.semester}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                    {note?.title}
                  </h3>

                  <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-border">
                    <Image
                  src={note?.authorAvatar}
                  alt={note?.authorAvatarAlt}
                  className="w-8 h-8 rounded-full object-cover" />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">
                        {note?.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={16} color="var(--color-accent)" className="fill-current" />
                      <span className="text-sm font-semibold text-foreground data-text">
                        {note?.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({note?.reviews})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Icon name="FileText" size={16} />
                      <span className="text-xs data-text">{note?.pages} pages</span>
                    </div>
                  </div>
                </div>
              </div>
          )}
          </div>
        }

        <div className="text-center mt-8 md:mt-10 lg:mt-12">
          <Button
            variant="outline"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={() => navigate('/branch-notes-list')}>

            Browse All Notes
          </Button>
        </div>
      </div>
    </section>);

};

export default RecentUploadsSection;