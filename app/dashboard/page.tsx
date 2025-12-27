export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#111827]">Welcome back, Jeremiah</h1>
        <p className="text-[#6B7280]">Here's what's happening with your Flowva account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Stats */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-bold tracking-wider">Library</p>
              <p className="text-2xl font-bold text-[#111827]">24</p>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">Tools saved</p>
        </div>

        <div className="bg-gradient-to-br from-[#9013FE] to-[#FF8687] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase font-bold tracking-wider">Points</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
          <p className="text-xs text-white/80">Total earned</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-bold tracking-wider">Streak</p>
              <p className="text-2xl font-bold text-[#111827]">1</p>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">Day streak</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#9013FE]/30 hover:bg-[#F5EBFF] transition-all group">
            <div className="h-12 w-12 rounded-full bg-[#F5EBFF] group-hover:bg-gradient-to-br group-hover:from-[#9013FE] group-hover:to-[#FF8687] flex items-center justify-center transition-all">
              <span className="text-2xl group-hover:grayscale-0 transition-all">🎁</span>
            </div>
            <span className="text-sm font-medium text-[#111827]">Earn Rewards</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#9013FE]/30 hover:bg-[#F5EBFF] transition-all group">
            <div className="h-12 w-12 rounded-full bg-[#F5EBFF] group-hover:bg-gradient-to-br group-hover:from-[#9013FE] group-hover:to-[#FF8687] flex items-center justify-center transition-all">
              <span className="text-2xl">🔍</span>
            </div>
            <span className="text-sm font-medium text-[#111827]">Discover Tools</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#9013FE]/30 hover:bg-[#F5EBFF] transition-all group">
            <div className="h-12 w-12 rounded-full bg-[#F5EBFF] group-hover:bg-gradient-to-br group-hover:from-[#9013FE] group-hover:to-[#FF8687] flex items-center justify-center transition-all">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-sm font-medium text-[#111827]">View Stack</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#9013FE]/30 hover:bg-[#F5EBFF] transition-all group">
            <div className="h-12 w-12 rounded-full bg-[#F5EBFF] group-hover:bg-gradient-to-br group-hover:from-[#9013FE] group-hover:to-[#FF8687] flex items-center justify-center transition-all">
              <span className="text-2xl">⚙️</span>
            </div>
            <span className="text-sm font-medium text-[#111827]">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9013FE] to-[#FF8687] flex items-center justify-center text-white font-bold text-sm">
              +5
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">Daily check-in bonus</p>
              <p className="text-xs text-[#6B7280]">Today at 8:45 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F9FAFB] transition-colors">
            <div className="h-10 w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">Saved new tool to library</p>
              <p className="text-xs text-[#6B7280]">Yesterday at 3:20 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F9FAFB] transition-colors">
            <div className="h-10 w-10 rounded-full bg-[#F5EBFF] flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">Completed profile setup</p>
              <p className="text-xs text-[#6B7280]">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
