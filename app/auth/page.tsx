"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.custom((t) => (
          <div className="flex items-center gap-3 lg:gap-4 w-full bg-white border border-[#E5E7EB] p-3 lg:p-4 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#9013FE] to-[#FF8687]" />
             <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center text-[#9013FE] shrink-0">
                <Icon icon="solar:check-circle-bold" width={18} />
             </div>
             <div className="flex-1 min-w-0">
                <h4 className="text-[#111827] font-bold text-xs lg:text-sm">Account Created!</h4>
                <p className="text-[#6B7280] text-[10px] lg:text-xs">Welcome to Flowva Rewards Hub</p>
             </div>
          </div>
        ), { duration: 3000 });

        router.push('/dashboard/earn-rewards');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.custom((t) => (
          <div className="flex items-center gap-3 lg:gap-4 w-full bg-white border border-[#E5E7EB] p-3 lg:p-4 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#9013FE] to-[#FF8687]" />
             <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center text-[#9013FE] shrink-0">
                <Icon icon="solar:login-3-bold" width={18} />
             </div>
             <div className="flex-1 min-w-0">
                <h4 className="text-[#111827] font-bold text-xs lg:text-sm">Welcome Back!</h4>
                <p className="text-[#6B7280] text-[10px] lg:text-xs">Signed in successfully</p>
             </div>
          </div>
        ), { duration: 3000 });

        router.push('/dashboard/earn-rewards');
      }
    } catch (error: any) {
      toast.custom((t) => (
        <div className="flex items-center gap-3 lg:gap-4 w-full bg-white border border-red-200 p-3 lg:p-4 rounded-2xl shadow-xl relative overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
           <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <Icon icon="solar:danger-circle-bold" width={18} />
           </div>
           <div className="flex-1 min-w-0">
              <h4 className="text-[#111827] font-bold text-xs lg:text-sm">Authentication Failed</h4>
              <p className="text-[#6B7280] text-[10px] lg:text-xs">{error.message}</p>
           </div>
        </div>
      ), { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard/earn-rewards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EBFF] via-white to-[#F9FAFB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#9013FE] to-[#FF8687] mb-4 shadow-xl"
          >
            <Icon icon="solar:gift-bold" className="text-white" width={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Flowva Rewards</h1>
          <p className="text-[#6B7280]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-[#E5E7EB] p-8"
        >
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#9013FE] focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#9013FE] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#9013FE] to-[#FF8687] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Icon icon={isSignUp ? "solar:user-plus-bold" : "solar:login-3-bold"} width={20} />
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-[#9013FE] hover:underline font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <button
              onClick={handleSkip}
              className="w-full text-[#6B7280] hover:text-[#111827] font-medium py-2 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Icon icon="solar:eye-linear" width={18} />
              Continue as Guest (Demo Mode)
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-[#6B7280] mt-6">
          Technical Assessment - React Full-Stack Developer
        </p>
      </motion.div>
    </div>
  );
}
