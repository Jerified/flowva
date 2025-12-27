"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  status: string;
  image_url?: string;
}

interface UserProfile {
  total_points: number;
  streak_count: number;
  last_check_in_date: string | null;
  referral_code: string;
  total_referrals: number;
  referral_points_earned: number;
}




const VaultCard = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 hover:shadow-lg transition-all",
      className
    )}
  >
    {children}
  </motion.div>
);

const PurpleButton = ({ children, onClick, className, variant = "primary", disabled = false }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "gradient";
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02, filter: "brightness(1.05)" } : {}}
    whileTap={!disabled ? { scale: 0.97 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "relative overflow-hidden rounded-full px-4 py-2.5 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold text-white transition-all",
      variant === "gradient" 
        ? "bg-gradient-to-r from-[#9013FE] to-[#FF8687] shadow-[0_4px_12px_rgba(144,19,254,0.3)]"
        : "bg-[#9013FE] shadow-[0_2px_8px_rgba(144,19,254,0.25)] hover:shadow-[0_4px_16px_rgba(144,19,254,0.35)]",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    <div className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </div>
  </motion.button>
);

const Celebration = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="bg-white px-8 py-6 rounded-3xl shadow-2xl text-center border border-[#E5E7EB]"
        >
          <div className="h-16 w-16 bg-[#F5EBFF] rounded-full mx-auto mb-4 flex items-center justify-center text-[#9013FE] text-2xl">
            <Icon icon="solar:star-bold" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">Congratulations!</h2>
          <p className="text-[#6B7280]">Reward successfully claimed.</p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const StreakModule = ({ streakCount, lastCheckIn, onCheckIn }: { 
  streakCount: number; 
  lastCheckIn: string | null;
  onCheckIn: () => void;
}) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  const canCheckIn = lastCheckIn !== new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-50 rounded-2xl p-4">
        {days.map((day, i) => {
          const isPast = i < todayIndex;
          const isToday = i === todayIndex;
          const isChecked = isPast || (isToday && !canCheckIn);

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                isChecked 
                  ? "bg-[#9013FE] text-white shadow-md shadow-purple-200" 
                  : isToday 
                    ? "border-2 border-[#9013FE] text-[#9013FE]" 
                    : "bg-zinc-200 text-zinc-400"
              )}>
                {isChecked ? <Icon icon="solar:check-read-bold" width={14} /> : day}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onCheckIn}
        disabled={!canCheckIn}
        className={cn(
          "w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
          canCheckIn 
            ? "bg-[#111827] text-white hover:bg-[#9013FE] shadow-lg shadow-zinc-200" 
            : "bg-zinc-100 text-[#9CA3AF] cursor-not-allowed"
        )}
      >
        <Icon icon="solar:calendar-bold" width={18} />
        {canCheckIn ? 'Daily Check-in (+5 pts)' : 'Already Checked In'}
      </button>
    </div>
  );
};

const RewardModal = ({ 
  reward, 
  isOpen, 
  onClose, 
  onConfirm,
  userPoints 
}: { 
  reward: Reward | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: (id: string) => void;
  userPoints: number;
}) => {
  if (!reward) return null;

  const canAfford = userPoints >= reward.points_cost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-[#6B7280] hover:text-[#111827]"
            >
              <Icon icon="solar:close-circle-bold" width={24} />
            </button>

            <div className="text-center">
              <div className="h-20 w-20 rounded-2xl bg-[#F5EBFF] text-[#9013FE] mx-auto flex items-center justify-center mb-6">
                <Icon icon={reward.category === 'gift_card' ? "solar:ticket-bold" : "solar:tag-bold"} width={40} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-2">Claim {reward.name}</h2>
              <p className="text-[#6B7280] mb-8">{reward.description}</p>

              <div className="bg-zinc-50 rounded-2xl p-6 mb-8 flex justify-between items-center text-sm font-medium">
                <div className="text-left">
                  <p className="text-[#6B7280] mb-1">Cost:</p>
                  <p className="text-lg font-bold text-[#111827]">{reward.points_cost.toLocaleString()} pts</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6B7280] mb-1">Your Balance:</p>
                  <p className="text-lg font-bold text-[#9013FE]">{userPoints.toLocaleString()} pts</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PurpleButton
                  onClick={() => onConfirm(reward.id)}
                  disabled={!canAfford}
                  className="w-full h-14"
                >
                  {canAfford ? 'Confirm Claim' : 'Insufficient Points'}
                </PurpleButton>
                <button
                  onClick={onClose}
                  className="w-full h-14 text-sm font-bold text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RewardCard = ({ 
  reward, 
  userPoints, 
  onClaim 
}: { 
  reward: Reward; 
  userPoints: number;
  onClaim: (reward: Reward) => void;
}) => {
  const canClaim = userPoints >= reward.points_cost && reward.status === 'active';
  const isLocked = userPoints < reward.points_cost;
  const isComingSoon = reward.status === 'coming_soon';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isComingSoon && onClaim(reward)}
      className={cn(
        "group relative bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between cursor-pointer overflow-hidden",
        !canClaim && !isComingSoon && "hover:border-[#9013FE]/30"
      )}
    >
      {/* Click Hint Overlay */}
      <div className="absolute inset-0 bg-[#9013FE]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <span className="text-[10px] font-black text-[#9013FE] uppercase tracking-widest">
            {isComingSoon ? "Locked" : canClaim ? "Tap to Redeem" : "View Details"}
          </span>
          <Icon icon="solar:arrow-right-up-bold" className="text-[#9013FE]" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
            canClaim ? "bg-[#F5EBFF] text-[#9013FE]" : "bg-zinc-100 text-[#9CA3AF]"
          )}>
            <Icon icon={reward.category === 'gift_card' ? "solar:ticket-bold" : "solar:tag-bold"} width={24} />
          </div>
          {(isLocked || isComingSoon) && (
            <div className="text-[#9CA3AF]">
              <Icon icon={isComingSoon ? "solar:clock-circle-bold" : "solar:lock-bold"} width={18} />
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#111827] mb-1 group-hover:text-[#9013FE] transition-colors">{reward.name}</h3>
        <p className="text-sm text-[#6B7280] mb-6 line-clamp-2">{reward.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F3F4F6]">
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Points Required</p>
          <p className={cn(
            "text-lg font-black",
            canClaim ? "text-[#111827]" : "text-[#9CA3AF]"
          )}>{reward.points_cost.toLocaleString()} <span className="text-xs">PTS</span></p>
        </div>

        <div className={cn(
            "h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
            canClaim 
              ? "bg-[#111827] text-white group-hover:bg-[#9013FE]" 
              : "bg-zinc-100 text-[#9CA3AF]"
          )}>
          {isComingSoon ? 'Soon' : canClaim ? 'Unlock' : 'Locked'}
        </div>
      </div>
    </motion.div>
  );
};



export default function EarnRewardsPage() {
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem'>('earn');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardFilter, setRewardFilter] = useState<'all' | 'unlocked' | 'locked' | 'coming_soon'>('all');
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  // --- Toast System ---
  const showToast = (message: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast.custom((t) => (
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="flex items-center gap-4 w-[calc(100vw-32px)] md:w-full max-w-md bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group"
      >
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-all",
          type === 'success' ? "bg-gradient-to-b from-[#9013FE] to-[#FF8687]" :
          type === 'error' ? "bg-red-500" : "bg-zinc-800"
        )} />
        
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transform transition-transform group-hover:rotate-12",
          type === 'success' ? "bg-[#F5EBFF] text-[#9013FE]" :
          type === 'error' ? "bg-red-50 text-red-500" : "bg-zinc-100 text-zinc-800"
        )}>
          <Icon icon={
            type === 'success' ? "solar:star-bold" :
            type === 'error' ? "solar:danger-bold" : "solar:info-circle-bold"
          } width={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[#111827] font-black text-sm uppercase tracking-tight">{message}</h4>
          {description && <p className="text-[#6B7280] text-[11px] font-medium leading-tight mt-0.5">{description}</p>}
        </div>

        <button onClick={() => toast.dismiss(t)} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors">
          <Icon icon="solar:close-circle-bold" className="text-zinc-300" width={20} />
        </button>
      </motion.div>
    ), { duration: 4000 });
  };

  const supabase = createClient();
  const isDemoMode = true; // Set to false to enable real Supabase integration


  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Show demo data for unauthenticated users
          setProfile({
            total_points: 10,
            streak_count: 2,
            last_check_in_date: null,
            referral_code: "DEMO-CODE",
            total_referrals: 0,
            referral_points_earned: 0
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Profile fetch error:', error);
          // If profile doesn't exist, show demo data
          setProfile({
            total_points: 0,
            streak_count: 0,
            last_check_in_date: null,
            referral_code: "LOADING...",
            total_referrals: 0,
            referral_points_earned: 0
          });
        } else {
          setProfile(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to demo data on error
        setProfile({
          total_points: 10,
          streak_count: 2,
          last_check_in_date: null,
          referral_code: "ERROR-DEMO",
          total_referrals: 0,
          referral_points_earned: 0
        });
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);


  useEffect(() => {
    async function fetchRewards() {
      try {
        // Demo mode - use mock data
        if (isDemoMode) {
          setRewards([
            {
              id: '1',
              name: '$5 PayPal International',
              description: 'Redeem for a $5 PayPal transfer',
              points_cost: 5000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '2',
              name: '$5 Virtual Visa Card',
              description: 'Redeem for a $5 Virtual Visa gift card',
              points_cost: 5000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '3',
              name: '$5 Apple Gift Card',
              description: 'Redeem for a $5 Apple gift card',
              points_cost: 5000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '4',
              name: '$5 Google Play Card',
              description: 'Redeem for a $5 Google Play gift card',
              points_cost: 5000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '5',
              name: '$5 Amazon Gift Card',
              description: 'Redeem for a $5 Amazon gift card',
              points_cost: 5000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '6',
              name: '$10 Amazon Gift Card',
              description: 'Redeem for a $10 Amazon gift card',
              points_cost: 10000,
              category: 'gift_card',
              status: 'active'
            },
            {
              id: '7',
              name: 'Free Udemy Course',
              description: 'Get access to any Udemy course',
              points_cost: 0,
              category: 'course',
              status: 'coming_soon'
            }
          ]);
          return;
        }

        const { data, error } = await supabase
          .from('rewards')
          .select('*')
          .order('points_cost', { ascending: true });

        if (error) throw error;
        setRewards(data || []);
      } catch (error) {
        console.error('Error fetching rewards:', error);
        // Fallback demo data
        setRewards([
          {
            id: '1',
            name: '$5 PayPal International',
            description: 'Instant cash transfer to your PayPal account.',
            points_cost: 5000,
            category: 'gift_card',
            status: 'active'
          },
          {
            id: '2',
            name: '$5 Virtual Visa Card',
            description: 'A prepaid virtual card for global online shopping.',
            points_cost: 5000,
            category: 'gift_card',
            status: 'active'
          },
          {
            id: '3',
            name: '$5 Apple Gift Card',
            description: 'Redeem for apps, games, music, movies, and more.',
            points_cost: 5000,
            category: 'gift_card',
            status: 'active'
          },
          {
            id: '4',
            name: '$5 Google Play Card',
            description: 'Get your favorite apps and games on the Play Store.',
            points_cost: 5000,
            category: 'gift_card',
            status: 'active'
          },
          {
            id: '5',
            name: '$10 Amazon Gift Card',
            description: 'Shop millions of items on Amazon.com.',
            points_cost: 10000,
            category: 'gift_card',
            status: 'active'
          },
          {
            id: '6',
            name: 'Mastering AI Course',
            description: 'Lifetime access to the "Future of AI" masterclass.',
            points_cost: 25000,
            category: 'course',
            status: 'active'
          },
          {
            id: '7',
            name: 'Flowva Pro Yearly',
            description: 'A full year of premium Flowva Hub features.',
            points_cost: 50000,
            category: 'premium',
            status: 'coming_soon'
          },
          {
            id: '8',
            name: 'Tech Gadget Lucky Box',
            description: 'A mystery box containing premium tech accessories.',
            points_cost: 100000,
            category: 'premium',
            status: 'coming_soon'
          }
        ]);
      }
    }

    fetchRewards();
  }, [isDemoMode]);

  const handleCheckIn = async () => {
    try {
      if (isDemoMode) {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 3000);
        showToast("Check-in Successful!", "+5 PTS earned • Demo Mode", "success");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showToast("Authentication Required", "Please sign in to check in", "error");
        return;
      }

      const { data, error } = await supabase.rpc('claim_daily_checkin', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data.success) {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 3000);
        showToast(data.message, `+${data.points_earned} PTS earned`, "success");
        
        // Refresh profile
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (updatedProfile) setProfile(updatedProfile);
      } else {
        showToast(data.message, "Try again tomorrow", "info");
      }
    } catch (error) {
      console.error('Check-in error:', error);
      showToast("Check-in Failed", "Please try again later", "error");
    }
  };

  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleClaimReward = async (rewardId: string) => {
    setIsModalOpen(false);
    
    try {
      if (isDemoMode) {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 3000);
        showToast("Insufficient Points", "Earn more points to claim this reward • Demo Mode", "error");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showToast("Authentication Required", "Please sign in to claim rewards", "error");
        return;
      }

      const { data, error } = await supabase.rpc('redeem_reward', {
        user_id_param: user.id,
        reward_id_param: rewardId
      });

      if (error) throw error;

      if (data.success) {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 3000);
        showToast(data.message, `Remaining: ${data.remaining_points} pts`, "success");
        
        // Refresh profile
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (updatedProfile) setProfile(updatedProfile);
      } else {
        showToast(data.message, "Unable to process reward", "error");
      }
    } catch (error) {
      console.error('Claim error:', error);
      showToast("Claim Failed", "Please try again later", "error");
    }
  };

  const handleCopyReferral = () => {
    const referralLink = `https://app.flowvahub.com/signup/?ref=${profile?.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Code Copied!", "Referral link copied to clipboard", "success");
  };

  const filteredRewards = rewards.filter(reward => {
    if (rewardFilter === 'all') return true;
    if (rewardFilter === 'unlocked') return profile && profile.total_points >= reward.points_cost && reward.status === 'active';
    if (rewardFilter === 'locked') return profile && profile.total_points < reward.points_cost && reward.status === 'active';
    if (rewardFilter === 'coming_soon') return reward.status === 'coming_soon';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9013FE] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto space-y-8 lg:space-y-12 text-[#111827]">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 rounded-full blur-[100px] -ml-40 -mb-40" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
           <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-[#6B7280] mb-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9013FE] to-[#FF8687]" />
              Rewards Hub
           </div>
           <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111827] tracking-tight">
             Earn points, unlock rewards
           </h1>
           <p className="text-[#6B7280] mt-2">Celebrate your progress and redeem exclusive perks!</p>
        </div>


        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('earn')}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-all relative",
              activeTab === 'earn'
                ? "text-[#9013FE]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            Earn Points
            {activeTab === 'earn' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9013FE] to-[#FF8687]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-all relative",
              activeTab === 'redeem'
                ? "text-[#9013FE]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            Redeem Rewards
            {activeTab === 'redeem' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9013FE] to-[#FF8687]"
              />
            )}
          </button>
        </div>
      </div>


      {activeTab === 'earn' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          <VaultCard className="lg:col-span-7 bg-[#111827] text-white border-transparent overflow-hidden">
             <div className="flex flex-col h-full justify-between">
                <div>
                   <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Total Balance</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl lg:text-7xl font-black">{profile?.total_points || 0}</span>
                      <span className="text-xl text-[#FF8687] font-bold">PTS</span>
                   </div>
                </div>
                <div className="mt-8">
                   <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Level 4</span>
                      <span>{profile?.total_points || 0} / 5000</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((profile?.total_points || 0) / 5000) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#9013FE] to-[#FF8687] rounded-full"
                      />
                   </div>
                </div>
             </div>
          </VaultCard>

          <VaultCard className="lg:col-span-5 bg-white">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-[#F5EBFF] text-[#9013FE] flex items-center justify-center">
                   <Icon icon="solar:fire-bold" width={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-[#111827]">Current Streak</h3>
                   <p className="text-sm text-[#6B7280]">{profile?.streak_count || 0} Days</p>
                </div>
             </div>
             <StreakModule 
               streakCount={profile?.streak_count || 0}
               lastCheckIn={profile?.last_check_in_date || null}
               onCheckIn={handleCheckIn}
             />
          </VaultCard>

          <VaultCard className="lg:col-span-8 p-0 border-0 overflow-hidden bg-[#0A0A0A] text-white min-h-[360px] relative group/feature">
             <img 
               src="https://images.unsplash.com/photo-1506784919141-935049918630?auto=format&fit=crop&q=80&w=2000" 
               className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover/feature:scale-105"
               alt="Reclaim.ai Background"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
             <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#9013FE] animate-pulse" />
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#FF8687]">Ecosystem Partner</div>
                </div>
                <h3 className="text-4xl lg:text-5xl font-black mb-3 text-white tracking-tighter">Reclaim.ai</h3>
                <p className="text-white/80 text-sm lg:text-base max-w-sm mb-8 leading-relaxed font-medium">Connect the world's best AI scheduler to your hub and unlock exclusive rewards.</p>
                <div className="flex flex-wrap gap-4">
                   <button className="h-14 px-8 rounded-2xl bg-white text-[#111827] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Connect Node</button>
                   <button className="h-14 px-8 rounded-2xl bg-white/10 text-white text-xs font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all">Learn More</button>
                </div>
             </div>
          </VaultCard>

          <VaultCard className="lg:col-span-4 bg-white flex flex-col justify-center items-center text-center p-8">
             <div className="h-16 w-16 rounded-2xl bg-[#F5EBFF] text-[#9013FE] flex items-center justify-center mb-6">
                <Icon icon="solar:share-bold" width={32} />
             </div>
             <h3 className="text-xl font-bold text-[#111827] mb-2">Share Your Stack</h3>
             <p className="text-sm text-[#6B7280] mb-8">Show off your productivity tools and earn <span className="text-[#9013FE] font-bold">+25 PTS</span>.</p>
             <button className="w-full h-12 rounded-xl border border-[#E5E7EB] text-sm font-bold text-[#111827] hover:bg-zinc-50 transition-all">
                Share Now
             </button>
          </VaultCard>

          <VaultCard className="lg:col-span-12 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                   <h2 className="text-3xl lg:text-4xl font-bold text-[#111827] mb-4">Invite Your Friends</h2>
                   <p className="text-[#6B7280] max-w-xl">
                      Share your unique referral link and earn <span className="text-[#9013FE] font-bold">1,000 PTS</span> for every friend who joins the Flowva community.
                   </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-50 p-2 rounded-2xl border border-[#E5E7EB]">
                   <div className="px-6 py-3 font-mono font-bold text-[#111827]">
                      {profile?.referral_code || "FLOW-HUB"}
                   </div>
                   <PurpleButton 
                     onClick={handleCopyReferral}
                     className="whitespace-nowrap rounded-xl"
                   >
                     {copied ? 'Copied!' : 'Copy Link'}
                   </PurpleButton>
                </div>
             </div>

             <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#E5E7EB]">
                <div>
                   <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Total Referrals</p>
                   <p className="text-2xl font-bold text-[#111827]">{profile?.total_referrals || 0}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Points Earned</p>
                   <p className="text-2xl font-bold text-[#9013FE]">{profile?.referral_points_earned || 0}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                   {["solar:share-bold", "solar:letter-bold", "solar:chat-round-bold"].map((icon, i) => (
                      <button key={i} className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-zinc-50 transition-all">
                         <Icon icon={icon} width={18} />
                      </button>
                   ))}
                </div>
             </div>
          </VaultCard>

        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'unlocked', 'locked', 'coming_soon'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRewardFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  rewardFilter === filter
                    ? "bg-gradient-to-r from-[#9013FE] to-[#FF8687] text-white shadow-lg"
                    : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#9013FE]/30"
                )}
              >
                {filter === 'all' ? 'All Rewards' : 
                 filter === 'unlocked' ? 'Unlocked' :
                 filter === 'locked' ? 'Locked' :
                 'Coming Soon'}
              </button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={profile?.total_points || 0}
                onClaim={handleRewardClick}
              />
            ))}
          </div>

          <RewardModal
            reward={selectedReward}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleClaimReward}
            userPoints={profile?.total_points || 0}
          />

          <Celebration isOpen={isCelebrating} />


          {filteredRewards.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="solar:gift-bold-duotone" width={64} className="mx-auto text-[#9CA3AF] mb-4" />
              <p className="text-[#6B7280]">No rewards found in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
}
