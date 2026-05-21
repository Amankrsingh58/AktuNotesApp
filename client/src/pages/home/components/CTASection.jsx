import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Search',
      title: 'Browse & Search',
      description: 'Find notes by branch, subject, or topic'
    },
    {
      icon: 'Eye',
      title: 'Preview Content',
      description: 'Check quality before purchasing'
    },
    {
      icon: 'ShoppingCart',
      title: 'Secure Purchase',
      description: 'Safe payment with instant access'
    },
    {
      icon: 'Download',
      title: 'Download & Study',
      description: 'Access anytime, anywhere offline'
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-accent rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4 md:mb-6">
            <Icon name="Zap" size={18} color="var(--color-primary)" />
            <span className="text-xs md:text-sm font-medium text-primary">
              Get Started Today
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 text-balance">
            Ready to Excel in Your
            <span className="block text-primary mt-2">B.Tech Journey?</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 max-measure mx-auto">
            Join thousands of students who are already using EduNotes to achieve academic excellence. Start browsing quality notes today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="default"
              size="lg"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={() => navigate('/pyq/semesters')}
            >
              Browse All Notes
            </Button>
       
          </div>
        </div>
{/* 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10 md:mb-12">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 md:p-8 border border-border text-center hover-lift card-shadow"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'scale-in 250ms ease-out forwards',
                opacity: 0
              }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                {feature?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          ))}
        </div> */}

       <div className="bg-card rounded-2xl p-8 md:p-10 lg:p-12 border border-border card-shadow">
  <div className="text-center mb-10">
    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
      How It Works
    </h3>
    <p className="text-sm md:text-base text-muted-foreground mt-2">
      Get your academic notes in just a few simple steps
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Step 1 */}
    <div className="
     bg-card
    rounded-2xl
    animated-border
    duration-300
    hover:shadow-lg
     border border-border p-6 text-center transition-all">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon name="Search" size={24} className='text-primary' />
      </div>
      <h4 className="font-semibold text-foreground mb-1">
        Browse Notes
      </h4>
      <p className="text-sm text-muted-foreground">
        Explore notes by year, branch, and subject
      </p>
    </div>

    {/* Step 2 */}
    <div className=" bg-card
    rounded-2xl
    animated-border
    duration-300
    hover:shadow-lg
     border border-border p-6 text-center transition-all">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
        <Icon name="BookOpen" size={24} className='text-accent' />
      </div>
      <h4 className="font-semibold text-foreground mb-1">
        Select Notes
      </h4>
      <p className="text-sm text-muted-foreground">
        Choose the subjects and units you need
      </p>
    </div>

    {/* Step 3 */}
    <div className=" bg-card
    rounded-2xl
    animated-border
    duration-300
    hover:shadow-lg
     border border-border p-6 text-center transition-all">
      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
        <Icon name="CreditCard" size={24} className='text-success' />
      </div>
      <h4 className="font-semibold text-foreground mb-1">
        Secure Payment
      </h4>
      <p className="text-sm text-muted-foreground">
        Pay safely using trusted payment methods
      </p>
    </div>

    {/* Step 4 */}
    <div className=" bg-card
    rounded-2xl
    animated-border
    duration-300
    hover:shadow-lg
     border border-border p-6 text-center transition-all">
      <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
        <Icon name="Download" size={24} className='text-error'/>
      </div>
      <h4 className="font-semibold text-foreground mb-1">
        Download & Study
      </h4>
      <p className="text-sm text-muted-foreground">
        Instant access to your purchased notes
      </p>
    </div>
  </div>
</div>
</div>
</section>
  );
};

export default CTASection;