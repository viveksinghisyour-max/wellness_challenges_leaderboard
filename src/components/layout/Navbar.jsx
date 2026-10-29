import React, { useState } from 'react';
import {
  LayoutDashboard,
  Trophy,
  Activity,
  Award,
  PlusCircle,
  Menu,
  X,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import Button from '../common/Button';

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenQuickLog,
  onResetData,
  userProfile,
  onOpenProfile
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'progress', label: 'My Progress', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award }
  ];

  function handleSelect(id) {
    onTabChange(id);
    setMobileMenuOpen(false);
  }

  const colorGradients = {
    emerald: 'from-emerald-600 to-teal-500',
    teal: 'from-teal-600 to-cyan-500',
    indigo: 'from-indigo-600 to-purple-500',
    rose: 'from-rose-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500'
  };

  const gradientClass = colorGradients[userProfile?.avatarColor] || colorGradients.emerald;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">WellnessPulse</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block -mt-1">Experience</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSelect(link.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onResetData}
              title="Reset Demo Data"
              className="hidden sm:inline-flex text-slate-600 border-slate-200"
            >
              Reset
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={onOpenQuickLog}
            >
              Log Activity
            </Button>

            {/* Clickable User Profile Badge */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              title="Click to edit participant profile"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${gradientClass} text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0`}>
                {userProfile?.avatar || 'VP'}
              </div>
              <div className="hidden lg:block leading-tight text-xs pr-1">
                <span className="font-bold text-slate-800 block truncate max-w-[120px]">
                  {userProfile?.name || 'Create Profile'}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Profile
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSelect(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={UserCheck}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="w-full justify-center"
            >
              My Profile Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setMobileMenuOpen(false);
                onResetData();
              }}
              className="w-full justify-center"
            >
              Reset Data
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
