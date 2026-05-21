import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation, useUpdatePasswordMutation } from "../../features/user/userApi";
import { setUserAuth } from "../../store/slices/userSlice";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import toast from "react-hot-toast";

const MyProfile = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userAuth);
    
    const [profileData, setProfileData] = useState({
        name: "",
        year: "",
        college: ""
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

    const [isProfileExpanded, setIsProfileExpanded] = useState(true);
    const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setProfileData({
                name: userInfo.name || "",
                year: userInfo.year || "",
                college: userInfo.college || ""
            });
        }
    }, [userInfo]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(profileData).unwrap();
            dispatch(setUserAuth(res.user));
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.data?.message || "Failed to update profile");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        try {
            await updatePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }).unwrap();
            toast.success("Password updated successfully!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.data?.message || "Failed to update password");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Sidebar/Overview */}
                    <div className="md:col-span-1">
                        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center sticky top-24">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="User" size={48} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">{userInfo?.name}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{userInfo?.email}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground">
                                    {userInfo?.year ? `${userInfo.year} Year` : "Year not set"}
                                </span>
                                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground max-w-[150px] truncate">
                                    {userInfo?.college || "College not set"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Forms */}
                    <div className="md:col-span-2 space-y-4">
                        
                        {/* Profile Settings */}
                        <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <button 
                                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                                className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon name="Settings" size={24} className="text-primary" />
                                    <h3 className="text-xl font-bold text-foreground">Profile Settings</h3>
                                </div>
                                <Icon 
                                    name="ChevronDown" 
                                    size={24} 
                                    className={`text-muted-foreground transition-transform duration-300 ${isProfileExpanded ? "rotate-180" : ""}`} 
                                />
                            </button>
                            
                            <div className={`transition-all duration-300 ease-in-out ${isProfileExpanded ? "max-h-[1000px] opacity-100 p-8 pt-0" : "max-h-0 opacity-0 overflow-hidden"}`}>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                                        <input 
                                            type="text" name="name" value={profileData.name} onChange={handleProfileChange}
                                            className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-foreground ml-1">Current Year</label>
                                            <select 
                                                name="year" value={profileData.year} onChange={handleProfileChange}
                                                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                                required
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground ml-1">College Name</label>
                                            <input 
                                                type="text" name="college" value={profileData.college} onChange={handleProfileChange}
                                                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" disabled={isUpdatingProfile}
                                        className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-lg disabled:opacity-50"
                                    >
                                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                    </button>
                                </form>
                            </div>
                        </section>

                        {/* Password Settings */}
                        <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <button 
                                onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
                                className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon name="Lock" size={24} className="text-primary" />
                                    <h3 className="text-xl font-bold text-foreground">Change Password</h3>
                                </div>
                                <Icon 
                                    name="ChevronDown" 
                                    size={24} 
                                    className={`text-muted-foreground transition-transform duration-300 ${isPasswordExpanded ? "rotate-180" : ""}`} 
                                />
                            </button>
                            
                            <div className={`transition-all duration-300 ease-in-out ${isPasswordExpanded ? "max-h-[1000px] opacity-100 p-8 pt-0" : "max-h-0 opacity-0 overflow-hidden"}`}>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground ml-1">Current Password</label>
                                        <input 
                                            type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange}
                                            className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                            placeholder="••••••••" required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-foreground ml-1">New Password</label>
                                            <input 
                                                type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                                                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                                placeholder="••••••••" required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground ml-1">Confirm New Password</label>
                                            <input 
                                                type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                                                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                                                placeholder="••••••••" required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" disabled={isUpdatingPassword}
                                        className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-lg disabled:opacity-50"
                                    >
                                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyProfile;
