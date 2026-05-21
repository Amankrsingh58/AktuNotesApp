import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateProfileMutation } from "../../features/articles/articleApi";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    bio: "",
    avatar: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      navigate("/articles");
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 max-w-2xl mx-auto px-4">
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="User" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Complete Your Article Profile</h1>
              <p className="text-muted-foreground text-sm">Fill in your details to start exploring and writing articles.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Short Bio</label>
              <textarea
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none h-32"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Twitter Profile URL</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://twitter.com/..."
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value } 
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">LinkedIn Profile URL</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Personal Website</label>
              <input
                type="url"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="https://yourwebsite.com"
                value={formData.socialLinks.website}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, website: e.target.value } 
                })}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={isLoading}
              className="py-4 text-lg font-semibold"
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CompleteProfile;
