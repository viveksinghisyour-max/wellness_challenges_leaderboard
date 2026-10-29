import React, { useState, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import MyProgress from './pages/MyProgress';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import Toast from './components/common/Toast';
import Button from './components/common/Button';
import challengesCatalog from './data/challenges.json';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS, clearAllWellnessData } from './utils/storage';
import { calculateSummaryStats, calculateChallengeProgress, getTodayDateString, getDateStringDaysAgo } from './utils/progress';
import { computeUserScore } from './utils/scoring';
import { rankLeaderboard } from './utils/leaderboard';
import { ACTIVITY_UNITS } from './utils/validation';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  // Persistent user-driven data - starts clean with NO sample fake activity data
  const [activities, setActivities] = useLocalStorage(STORAGE_KEYS.ACTIVITIES, []);
  const [enrollments, setEnrollments] = useLocalStorage(STORAGE_KEYS.ENROLLMENTS, []);
  const [userProfile, setUserProfile] = useLocalStorage(STORAGE_KEYS.PROFILE, {
    id: 'user_alex_01',
    name: 'Alex Rivera',
    avatar: 'AR',
    streakDays: 0
  });
  const [participants, setParticipants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, []);

  // Quick Log Modal & Reset Dialog state
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState('steps');
  const [quickLogVal, setQuickLogVal] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Toast notification dispatcher
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. Calculate Summary Stats for Current User
  const summaryStats = useMemo(() => {
    return calculateSummaryStats(activities);
  }, [activities]);

  // 2. Calculate Challenge Progress for all challenges
  const challengeProgressMap = useMemo(() => {
    const map = {};
    challengesCatalog.forEach(ch => {
      map[ch.id] = calculateChallengeProgress(ch, activities, userProfile);
    });
    return map;
  }, [activities, userProfile]);

  // 3. Enrolled Challenges with Progress objects
  const enrolledChallengesWithProgress = useMemo(() => {
    return challengesCatalog
      .filter(ch => enrollments.some(e => e.challengeId === ch.id))
      .map(ch => ({
        challenge: ch,
        progress: challengeProgressMap[ch.id] || { current: 0, target: ch.target, percentage: 0, isCompleted: false }
      }));
  }, [enrollments, challengeProgressMap]);

  // 4. Compute User's Verified Score
  const currentUserScoreObj = useMemo(() => {
    return computeUserScore(activities, enrollments, userProfile);
  }, [activities, enrollments, userProfile]);

  // 5. Current User Leaderboard Entry
  const currentUserEntry = useMemo(() => {
    // Generate 7-day metric snapshot for modal inspection
    const last7Days = summaryStats.last7Days || [];
    return {
      id: userProfile.id || 'user_alex_01',
      name: userProfile.name || 'Alex Rivera',
      avatar: userProfile.avatar || 'AR',
      city: 'Austin, TX',
      streakDays: currentUserScoreObj.streakDays,
      completedChallenges: currentUserScoreObj.completedChallengesCount,
      score: currentUserScoreObj.totalScore,
      steps: currentUserScoreObj.totalSteps,
      activeMinutes: currentUserScoreObj.totalActiveMinutes,
      scoreDetails: currentUserScoreObj,
      dailyActivities: last7Days
    };
  }, [userProfile, currentUserScoreObj, summaryStats]);

  // 6. Ranked Leaderboard
  const rankedLeaderboard = useMemo(() => {
    return rankLeaderboard(currentUserEntry, participants);
  }, [currentUserEntry, participants]);

  // --- ACTIONS ---

  // Challenge Join & Leave with duplicate prevention
  const handleJoinChallenge = (challengeId, challengeName) => {
    if (enrollments.some(e => e.challengeId === challengeId)) {
      showToast(`Already enrolled in "${challengeName}".`, 'warning');
      return;
    }

    setEnrollments(prev => [
      ...prev,
      {
        challengeId,
        enrolledAt: getTodayDateString(),
        completed: false
      }
    ]);

    showToast(`Successfully joined "${challengeName}"! 🎯`, 'success');
  };

  const handleLeaveChallenge = (challengeId, challengeName) => {
    setEnrollments(prev => prev.filter(e => e.challengeId !== challengeId));
    showToast(`Unenrolled from "${challengeName}".`, 'info');
  };

  // Activity CRUD Operations
  const handleAddActivity = (newRecord) => {
    setActivities(prev => [newRecord, ...prev]);

    // Update streak if activity recorded
    setUserProfile(prev => ({
      ...prev,
      streakDays: Math.max(1, (prev.streakDays || 0) + 1)
    }));

    showToast(`Logged ${newRecord.value.toLocaleString()} ${newRecord.unit}! 🚀`, 'success');
  };

  const handleUpdateActivity = (updatedRecord) => {
    setActivities(prev =>
      prev.map(item => (item.id === updatedRecord.id ? updatedRecord : item))
    );
    showToast('Activity record updated successfully! ✨', 'success');
  };

  const handleDeleteActivity = (id) => {
    setActivities(prev => prev.filter(item => item.id !== id));
    showToast('Activity record deleted.', 'info');
  };

  // Quick Log Submission
  const handleQuickLogSubmit = (e) => {
    e.preventDefault();
    const val = Number(quickLogVal);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid positive number.', 'error');
      return;
    }

    handleAddActivity({
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: quickLogType,
      value: val,
      unit: ACTIVITY_UNITS[quickLogType] || 'units',
      date: getTodayDateString(),
      notes: 'Quick logged via navigation bar',
      source: 'manual',
      createdAt: new Date().toISOString()
    });

    setQuickLogVal('');
    setQuickLogOpen(false);
  };

  // Seed 20 Demo Competitors (Optional button for user testing)
  const handleSeedDemoCompetitors = () => {
    const demo = [
      {
        id: 'p1',
        name: 'Samantha Reed',
        avatar: 'SR',
        city: 'Boulder, CO',
        score: 3240,
        steps: 115000,
        activeMinutes: 480,
        completedChallenges: 5,
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 16500, activeMinutes: 70, water: 9, sleep: 8.0 }
        ]
      },
      {
        id: 'p2',
        name: 'Liam Chen',
        avatar: 'LC',
        city: 'Seattle, WA',
        score: 2950,
        steps: 98000,
        activeMinutes: 420,
        completedChallenges: 4,
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 14800, activeMinutes: 62, water: 8, sleep: 7.8 }
        ]
      },
      {
        id: 'p3',
        name: 'Priya Patel',
        avatar: 'PP',
        city: 'Austin, TX',
        score: 2680,
        steps: 88000,
        activeMinutes: 390,
        completedChallenges: 4,
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 13200, activeMinutes: 58, water: 8, sleep: 8.0 }
        ]
      },
      {
        id: 'p4',
        name: 'Marcus Turbo',
        avatar: 'MT',
        city: 'San Francisco, CA',
        score: 2450,
        steps: 76000,
        activeMinutes: 310,
        completedChallenges: 3,
        // INTENTIONAL ANOMALY: Impossible step cadence (28k steps in 20 mins = 1400 steps/min)
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 28000, activeMinutes: 20, water: 8, sleep: 7.5 }
        ]
      },
      {
        id: 'p5',
        name: 'Dave Speed',
        avatar: 'DS',
        city: 'Phoenix, AZ',
        score: 2280,
        steps: 94000,
        activeMinutes: 360,
        completedChallenges: 3,
        // INTENTIONAL ANOMALY: 62k steps in single day exceeds ceiling
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 62000, activeMinutes: 280, water: 10, sleep: 6.5 }
        ]
      },
      {
        id: 'p6',
        name: 'Chloe Sparks',
        avatar: 'CS',
        city: 'Los Angeles, CA',
        score: 2150,
        steps: 68000,
        activeMinutes: 300,
        completedChallenges: 2,
        // INTENTIONAL ANOMALY: 960 active minutes in a single day
        dailyActivities: [
          { date: getDateStringDaysAgo(0), steps: 18000, activeMinutes: 960, water: 10, sleep: 4.0 }
        ]
      },
      { id: 'p7', name: 'Jordan Miller', avatar: 'JM', city: 'Denver, CO', score: 2050, steps: 72000, activeMinutes: 310, completedChallenges: 2 },
      { id: 'p8', name: 'Sofia Rossi', avatar: 'SR', city: 'Boston, MA', score: 1980, steps: 69000, activeMinutes: 290, completedChallenges: 2 },
      { id: 'p9', name: 'Carlos Mendez', avatar: 'CM', city: 'Miami, FL', score: 1890, steps: 64000, activeMinutes: 275, completedChallenges: 2 },
      { id: 'p10', name: 'Aisha Khan', avatar: 'AK', city: 'Chicago, IL', score: 1820, steps: 61000, activeMinutes: 260, completedChallenges: 2 },
      { id: 'p11', name: 'Lucas Silva', avatar: 'LS', city: 'Salt Lake City, UT', score: 1740, steps: 58000, activeMinutes: 250, completedChallenges: 2 },
      { id: 'p12', name: 'Maya Tanaka', avatar: 'MT', city: 'San Diego, CA', score: 1680, steps: 56000, activeMinutes: 240, completedChallenges: 2 },
      { id: 'p13', name: 'Emily Watson', avatar: 'EW', city: 'Portland, OR', score: 1590, steps: 53000, activeMinutes: 230, completedChallenges: 1 },
      { id: 'p14', name: 'Nina Kowalski', avatar: 'NK', city: 'Minneapolis, MN', score: 1520, steps: 50000, activeMinutes: 220, completedChallenges: 1 },
      { id: 'p15', name: 'Ethan Brooks', avatar: 'EB', city: 'Atlanta, GA', score: 1460, steps: 48000, activeMinutes: 210, completedChallenges: 1 },
      { id: 'p16', name: 'Olivia Taylor', avatar: 'OT', city: 'Nashville, TN', score: 1390, steps: 46000, activeMinutes: 200, completedChallenges: 1 },
      { id: 'p17', name: 'Noah Davis', avatar: 'ND', city: 'Raleigh, NC', score: 1310, steps: 43000, activeMinutes: 190, completedChallenges: 1 },
      { id: 'p18', name: 'Hannah Kim', avatar: 'HK', city: 'San Jose, CA', score: 1240, steps: 41000, activeMinutes: 180, completedChallenges: 1 },
      { id: 'p19', name: 'Daniel Brown', avatar: 'DB', city: 'Columbus, OH', score: 1180, steps: 39000, activeMinutes: 170, completedChallenges: 1 },
      { id: 'p20', name: 'Jessica White', avatar: 'JW', city: 'Philadelphia, PA', score: 1100, steps: 36000, activeMinutes: 160, completedChallenges: 1 }
    ];

    setParticipants(demo);
    showToast('Loaded 20 demo competitors with normal & anomaly test cases! 🏆', 'success');
  };

  // Reset all data to clean initial state
  const handleConfirmReset = () => {
    clearAllWellnessData();
    setActivities([]);
    setEnrollments([]);
    setUserProfile({
      id: 'user_alex_01',
      name: 'Alex Rivera',
      avatar: 'AR',
      streakDays: 0
    });
    setParticipants([]);
    setResetModalOpen(false);
    showToast('All local data cleared. Clean slate restored! 🔄', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenQuickLog={() => setQuickLogOpen(true)}
        onResetData={() => setResetModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            summaryStats={summaryStats}
            enrolledChallengesWithProgress={enrolledChallengesWithProgress}
            recentActivities={activities}
            topLeaderboard={rankedLeaderboard}
            onNavigate={setActiveTab}
            onOpenQuickLog={() => setQuickLogOpen(true)}
          />
        )}

        {activeTab === 'challenges' && (
          <Challenges
            challenges={challengesCatalog}
            enrollments={enrollments}
            challengeProgressMap={challengeProgressMap}
            onJoinChallenge={handleJoinChallenge}
            onLeaveChallenge={handleLeaveChallenge}
          />
        )}

        {activeTab === 'progress' && (
          <MyProgress
            activities={activities}
            summaryStats={summaryStats}
            enrolledChallengesWithProgress={enrolledChallengesWithProgress}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onNavigateToChallenges={() => setActiveTab('challenges')}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            rankedParticipants={rankedLeaderboard}
            onSeedDemoCompetitors={handleSeedDemoCompetitors}
          />
        )}

        {!['dashboard', 'challenges', 'progress', 'leaderboard'].includes(activeTab) && (
          <NotFound onGoHome={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Quick Log Modal */}
      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Quick Log Activity</h3>
              <button
                type="button"
                onClick={() => setQuickLogOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleQuickLogSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Activity Type
                </label>
                <select
                  value={quickLogType}
                  onChange={(e) => setQuickLogType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="steps">Steps (steps)</option>
                  <option value="active-minutes">Active Cardio (minutes)</option>
                  <option value="water">Hydration (glasses of water)</option>
                  <option value="sleep">Rest & Sleep (hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recorded Value ({ACTIVITY_UNITS[quickLogType]})
                </label>
                <input
                  type="number"
                  step="any"
                  value={quickLogVal}
                  onChange={(e) => setQuickLogVal(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setQuickLogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={PlusCircle}>
                  Save Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Clear Local Data?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This will remove all user-logged activity records, challenge enrollments, and competitors from localStorage.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => setResetModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReset}>
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-700">WellnessPulse Experience</strong> &bull; React, Vite, Tailwind CSS, Recharts & Framer Motion.
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-700">Dashboard</button>
            <button type="button" onClick={() => setActiveTab('challenges')} className="hover:text-emerald-700">Challenges</button>
            <button type="button" onClick={() => setActiveTab('progress')} className="hover:text-emerald-700">Progress</button>
            <button type="button" onClick={() => setActiveTab('leaderboard')} className="hover:text-emerald-700">Leaderboard</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
