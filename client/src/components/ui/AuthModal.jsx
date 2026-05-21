import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../../features/user/userApi";
import { setUserAuth, closeAuthModal, openAuthModal } from "../../store/slices/userSlice";
import toast from "react-hot-toast";
import Icon from "../AppIcon";

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalType } = useSelector((state) => state.userAuth);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!isAuthModalOpen) return null;

  const isLogin = authModalType === "login";
  const isLoading = isLogin ? isLoginLoading : isRegisterLoading;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleMode = () => {
    dispatch(openAuthModal(isLogin ? "signup" : "login"));
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isLogin) {
        res = await login({ email: formData.email, password: formData.password }).unwrap();
        toast.success("Login successful!");
      } else {
        if (formData.password !== formData.confirmPassword) {
          return toast.error("Passwords do not match");
        }
        res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }).unwrap();
        toast.success("Registration successful!");
      }
      
      dispatch(setUserAuth(res.user));
      dispatch(closeAuthModal());
    } catch (err) {
      toast.error(err.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Join AKTU Notes"}
          </h2>
          <button 
            onClick={() => dispatch(closeAuthModal())}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                <input 
                  type="text" name="name" placeholder="John Doe" required={!isLogin}
                  value={formData.name} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <input 
                type="email" name="email" placeholder="john@example.com" required
                value={formData.email} onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <input 
                type="password" name="password" placeholder="••••••••" required
                value={formData.password} onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground ml-1">Confirm Password</label>
                <input 
                  type="password" name="confirmPassword" placeholder="••••••••" required={!isLogin}
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
                />
              </div>
            )}

            <button 
              type="submit" disabled={isLoading}
              className="w-full py-3 mt-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={handleToggleMode}
              className="ml-2 font-semibold text-primary hover:underline outline-none"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
