import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignalsSection = () => {
  const trustMetrics = [
  {
    icon: 'Shield',
    title: 'Secure Payments',
    description: 'SSL encrypted transactions with trusted payment gateways',
    color: 'var(--color-success)'
  },
  {
    icon: 'Award',
    title: 'Quality Assured',
    description: 'All notes reviewed and verified by subject experts',
    color: 'var(--color-primary)'
  },
  {
    icon: 'Clock',
    title: 'Instant Access',
    description: 'Download immediately after purchase confirmation',
    color: 'var(--color-accent)'
  },
  {
    icon: 'Users',
    title: 'Community Driven',
    description: 'Trusted by 1,247+ B.Tech students nationwide',
    color: 'var(--color-error)'
  }];


  const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Computer Science, 3rd Year',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_101904fc7-1763294024485.png",
    avatarAlt: 'Professional headshot of young Indian woman with long black hair in blue top with bright smile',
    rating: 5,
    comment: 'The notes are comprehensive and well-structured. Helped me score 9.2 CGPA in my last semester. Highly recommended for exam preparation!'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Mechanical Engineering, 4th Year',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_162d1d91e-1763300977297.png",
    avatarAlt: 'Professional headshot of young Indian man with short black hair in white shirt with confident expression',
    rating: 5,
    comment: 'Best investment for my academics. The quality of content and presentation is outstanding. Saved me countless hours of note-making.'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Electronics & Communication, 2nd Year',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c56c88d9-1763296268131.png",
    avatarAlt: 'Professional headshot of young Indian woman with shoulder-length hair in green dress with warm smile',
    rating: 5,
    comment: 'Clear explanations with diagrams and examples. The preview feature helped me choose the right notes. Worth every penny!'
  }];


  const partnerLogos = [
  {
    name: 'IIT Delhi',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19b582e36-1766505754831.png",
    logoAlt: 'IIT Delhi institutional logo with traditional emblem and university name in formal typography'
  },
  {
    name: 'NIT Trichy',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_138c947ec-1766059047957.png",
    logoAlt: 'NIT Trichy institutional logo featuring engineering symbols and university crest'
  },
  {
    name: 'BITS Pilani',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1004720d9-1764671189803.png",
    logoAlt: 'BITS Pilani institutional logo with academic insignia and university branding'
  },
  {
    name: 'VIT Vellore',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11cfac917-1765867497877.png",
    logoAlt: 'VIT Vellore institutional logo displaying university emblem and official colors'
  }];


  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12 md:mb-16 lg:mb-20">
          {trustMetrics?.map((metric, index) =>
          <div
            key={index}
            className="bg-card rounded-xl p-6 md:p-8 border border-border text-center hover-lift card-shadow"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'scale-in 250ms ease-out forwards',
              opacity: 0
            }}>

              <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${metric?.color}15` }}>

                <Icon name={metric?.icon} size={28} color={metric?.color} />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                {metric?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {metric?.description}
              </p>
            </div>
          )}
        </div>

        <div className="mb-12 md:mb-16 lg:mb-20">
          <div className="text-center mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
              What Students Say
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-measure mx-auto">
              Real experiences from B.Tech students across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {testimonials?.map((testimonial, index) =>
            <div
              key={testimonial?.id}
              className="bg-card rounded-xl p-6 md:p-8 border border-border hover-lift card-shadow"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'scale-in 250ms ease-out forwards',
                opacity: 0
              }}>

                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial?.rating)]?.map((_, i) =>
                <Icon
                  key={i}
                  name="Star"
                  size={18}
                  color="var(--color-accent)"
                  className="fill-current" />

                )}
                </div>

                <p className="text-sm md:text-base text-foreground mb-6 line-clamp-4">
                  "{testimonial?.comment}"
                </p>

                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.avatarAlt}
                  className="w-12 h-12 rounded-full object-cover" />

                  <div>
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      {testimonial?.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {testimonial?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 md:p-10 lg:p-12">
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Trusted by Top Institutions
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Content creators from premier engineering colleges
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
            {partnerLogos?.map((partner, index) =>
            <div
              key={index}
              className="bg-card rounded-xl p-6 md:p-8 border border-border flex items-center justify-center hover-lift"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'scale-in 250ms ease-out forwards',
                opacity: 0
              }}>

                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="GraduationCap" size={32} color="var(--color-primary)" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-foreground">
                    {partner?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSignalsSection;