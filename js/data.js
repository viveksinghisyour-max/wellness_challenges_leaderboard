/**
 * js/data.js
 * Bundled dataset for Wellness Challenges & Leaderboard Experience
 * Provides simulated challenges, initial activity logs, and 22 participant profiles.
 */

(function () {
  'use strict';

  // Helper to format ISO date strings for past N days relative to today
  function getDateString(daysAgo = 0) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  const currentUser = {
    id: 'user_alex_01',
    name: 'Alex Rivera',
    handle: '@alexrivera',
    email: 'alex.rivera@example.com',
    avatar: 'AR',
    bio: 'Wellness enthusiast & aspiring 10k runner',
    streakDays: 7,
    joinedDate: '2026-10-01',
    isCurrentUser: true
  };

  const initialChallenges = [
    {
      id: 'daily-steps',
      name: 'Daily Step Challenge',
      category: 'Steps',
      description: 'Hit at least 8,000 steps every day to build a steady cardiovascular foundation.',
      target: 8000,
      unit: 'steps',
      duration: 'Daily',
      difficulty: 'Easy',
      badgeColor: 'emerald',
      participantsCount: 342,
      pointsReward: 150,
      icon: 'walk'
    },
    {
      id: 'ten-k-steps',
      name: '10,000 Steps a Day',
      category: 'Steps',
      description: 'The gold standard of daily activity. Walk or run your way to 10k daily steps.',
      target: 10000,
      unit: 'steps',
      duration: 'Daily',
      difficulty: 'Medium',
      badgeColor: 'teal',
      participantsCount: 518,
      pointsReward: 250,
      icon: 'trophy'
    },
    {
      id: 'weekly-walking',
      name: 'Weekly Walking Challenge',
      category: 'Steps',
      description: 'Accumulate a massive 60,000 steps over 7 days through active commuting and weekend strolls.',
      target: 60000,
      unit: 'steps',
      duration: 'Weekly',
      difficulty: 'Medium',
      badgeColor: 'blue',
      participantsCount: 289,
      pointsReward: 350,
      icon: 'map'
    },
    {
      id: 'active-minutes',
      name: 'Active Minutes Challenge',
      category: 'Activity',
      description: 'Elevate your heart rate for at least 45 minutes every day with any workout.',
      target: 45,
      unit: 'minutes',
      duration: 'Daily',
      difficulty: 'Medium',
      badgeColor: 'amber',
      participantsCount: 195,
      pointsReward: 200,
      icon: 'fire'
    },
    {
      id: 'hydration-habit',
      name: 'Hydration Habit Challenge',
      category: 'Hydration',
      description: 'Stay energized and focused by drinking at least 8 glasses (approx. 2 liters) of water daily.',
      target: 8,
      unit: 'glasses',
      duration: 'Daily',
      difficulty: 'Easy',
      badgeColor: 'cyan',
      participantsCount: 410,
      pointsReward: 100,
      icon: 'droplet'
    },
    {
      id: 'sleep-routine',
      name: 'Consistent Sleep Routine',
      category: 'Sleep',
      description: 'Give your body restorative sleep by logging 8 hours of quality rest each night.',
      target: 8,
      unit: 'hours',
      duration: 'Daily',
      difficulty: 'Hard',
      badgeColor: 'indigo',
      participantsCount: 175,
      pointsReward: 200,
      icon: 'moon'
    },
    {
      id: 'weekend-movement',
      name: 'Weekend Movement Challenge',
      category: 'Activity',
      description: 'Fight sedentary weekend habits! Clock 120 total active minutes between Saturday and Sunday.',
      target: 120,
      unit: 'minutes',
      duration: 'Weekend',
      difficulty: 'Medium',
      badgeColor: 'orange',
      participantsCount: 230,
      pointsReward: 300,
      icon: 'zap'
    },
    {
      id: 'wellness-streak',
      name: 'Seven-Day Wellness Streak',
      category: 'Streak',
      description: 'Log any wellness activity every single day for 7 consecutive days without breaking your streak.',
      target: 7,
      unit: 'days',
      duration: 'Weekly',
      difficulty: 'Hard',
      badgeColor: 'purple',
      participantsCount: 140,
      pointsReward: 400,
      icon: 'sparkles'
    },
    {
      id: 'core-power',
      name: 'Core & Cardio Blast',
      category: 'Activity',
      description: 'Focus on high-intensity or core training for at least 30 active minutes per day.',
      target: 30,
      unit: 'minutes',
      duration: 'Daily',
      difficulty: 'Easy',
      badgeColor: 'emerald',
      participantsCount: 215,
      pointsReward: 180,
      icon: 'activity'
    },
    {
      id: 'mindful-hydration',
      name: 'Hydration Marathon',
      category: 'Hydration',
      description: 'Peak hydration for endurance sports! Log 10 full glasses of pure water.',
      target: 10,
      unit: 'glasses',
      duration: 'Daily',
      difficulty: 'Medium',
      badgeColor: 'cyan',
      participantsCount: 168,
      pointsReward: 150,
      icon: 'droplet'
    }
  ];

  // Default challenge enrollments for Alex Rivera
  const defaultEnrollments = [
    {
      challengeId: 'ten-k-steps',
      enrolledAt: getDateString(6),
      completed: false
    },
    {
      challengeId: 'active-minutes',
      enrolledAt: getDateString(6),
      completed: false
    },
    {
      challengeId: 'hydration-habit',
      enrolledAt: getDateString(5),
      completed: true
    },
    {
      challengeId: 'daily-steps',
      enrolledAt: getDateString(4),
      completed: true
    }
  ];

  // Initial user activity logs for the last 7 days
  const initialUserActivities = [
    // Today
    {
      id: 'act_demo_01',
      date: getDateString(0),
      type: 'steps',
      value: 8450,
      unit: 'steps',
      notes: 'Morning neighborhood brisk walk & errand sprint',
      source: 'manual',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act_demo_02',
      date: getDateString(0),
      type: 'active-minutes',
      value: 40,
      unit: 'minutes',
      notes: 'HIIT bodyweight session at home',
      source: 'manual',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act_demo_03',
      date: getDateString(0),
      type: 'water',
      value: 7,
      unit: 'glasses',
      notes: 'Infused lemon water throughout work hours',
      source: 'manual',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act_demo_04',
      date: getDateString(0),
      type: 'sleep',
      value: 7.8,
      unit: 'hours',
      notes: 'Deep uninterrupted sleep',
      source: 'manual',
      createdAt: new Date().toISOString()
    },
    // Yesterday
    {
      id: 'act_demo_05',
      date: getDateString(1),
      type: 'steps',
      value: 10820,
      unit: 'steps',
      notes: 'Evening park run and stairs',
      source: 'manual',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'act_demo_06',
      date: getDateString(1),
      type: 'active-minutes',
      value: 52,
      unit: 'minutes',
      notes: 'Outdoor 5k tempo run',
      source: 'manual',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'act_demo_07',
      date: getDateString(1),
      type: 'water',
      value: 9,
      unit: 'glasses',
      notes: 'Well hydrated post workout',
      source: 'manual',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'act_demo_08',
      date: getDateString(1),
      type: 'sleep',
      value: 8.2,
      unit: 'hours',
      notes: 'Rest day recovery sleep',
      source: 'manual',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    // 2 days ago
    {
      id: 'act_demo_09',
      date: getDateString(2),
      type: 'steps',
      value: 9640,
      unit: 'steps',
      notes: 'Campus walking and grocery loop',
      source: 'manual',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'act_demo_10',
      date: getDateString(2),
      type: 'active-minutes',
      value: 45,
      unit: 'minutes',
      notes: 'Spin bike intervals',
      source: 'manual',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'act_demo_11',
      date: getDateString(2),
      type: 'water',
      value: 8,
      unit: 'glasses',
      notes: 'Target hit precisely',
      source: 'manual',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'act_demo_12',
      date: getDateString(2),
      type: 'sleep',
      value: 7.5,
      unit: 'hours',
      notes: 'Woke up refreshed with alarm',
      source: 'manual',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    // 3 days ago
    {
      id: 'act_demo_13',
      date: getDateString(3),
      type: 'steps',
      value: 11450,
      unit: 'steps',
      notes: 'Long hiking trail circuit',
      source: 'manual',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: 'act_demo_14',
      date: getDateString(3),
      type: 'active-minutes',
      value: 60,
      unit: 'minutes',
      notes: 'Uphill trail march',
      source: 'manual',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: 'act_demo_15',
      date: getDateString(3),
      type: 'water',
      value: 10,
      unit: 'glasses',
      notes: 'Hydrated with electrolytes',
      source: 'manual',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: 'act_demo_16',
      date: getDateString(3),
      type: 'sleep',
      value: 8.0,
      unit: 'hours',
      notes: 'Early to bed after trail exhaustion',
      source: 'manual',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    // 4 days ago
    {
      id: 'act_demo_17',
      date: getDateString(4),
      type: 'steps',
      value: 8900,
      unit: 'steps',
      notes: 'Standard workday commute steps',
      source: 'manual',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: 'act_demo_18',
      date: getDateString(4),
      type: 'active-minutes',
      value: 35,
      unit: 'minutes',
      notes: 'Resistance band & core workout',
      source: 'manual',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: 'act_demo_19',
      date: getDateString(4),
      type: 'water',
      value: 8,
      unit: 'glasses',
      notes: 'Consistent sipping',
      source: 'manual',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: 'act_demo_20',
      date: getDateString(4),
      type: 'sleep',
      value: 7.2,
      unit: 'hours',
      notes: 'Mildly delayed bedtime reading',
      source: 'manual',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    },
    // 5 days ago
    {
      id: 'act_demo_21',
      date: getDateString(5),
      type: 'steps',
      value: 10300,
      unit: 'steps',
      notes: 'Evening neighborhood group run',
      source: 'manual',
      createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    {
      id: 'act_demo_22',
      date: getDateString(5),
      type: 'active-minutes',
      value: 48,
      unit: 'minutes',
      notes: 'Running intervals',
      source: 'manual',
      createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    {
      id: 'act_demo_23',
      date: getDateString(5),
      type: 'water',
      value: 9,
      unit: 'glasses',
      notes: 'Water + mineral hydration',
      source: 'manual',
      createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    {
      id: 'act_demo_24',
      date: getDateString(5),
      type: 'sleep',
      value: 7.9,
      unit: 'hours',
      notes: 'Great sleep metrics',
      source: 'manual',
      createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    // 6 days ago
    {
      id: 'act_demo_25',
      date: getDateString(6),
      type: 'steps',
      value: 9150,
      unit: 'steps',
      notes: 'Weekly prep & walking',
      source: 'manual',
      createdAt: new Date(Date.now() - 518400000).toISOString()
    },
    {
      id: 'act_demo_26',
      date: getDateString(6),
      type: 'active-minutes',
      value: 38,
      unit: 'minutes',
      notes: 'Bodyweight mobility and yoga flow',
      source: 'manual',
      createdAt: new Date(Date.now() - 518400000).toISOString()
    },
    {
      id: 'act_demo_27',
      date: getDateString(6),
      type: 'water',
      value: 8,
      unit: 'glasses',
      notes: 'Hydration goal reached',
      source: 'manual',
      createdAt: new Date(Date.now() - 518400000).toISOString()
    },
    {
      id: 'act_demo_28',
      date: getDateString(6),
      type: 'sleep',
      value: 7.6,
      unit: 'hours',
      notes: 'Solid recovery sleep',
      source: 'manual',
      createdAt: new Date(Date.now() - 518400000).toISOString()
    }
  ];

  /**
   * 22 Synthetic participants for the leaderboard.
   * Includes 3 intentional anomaly cases to exercise anti-cheat detection:
   * - part_07: Marcus Turbo (cadence anomaly: 28k steps in 20 active minutes)
   * - part_11: Dave Speed (step threshold anomaly: 62k steps in single day)
   * - part_15: Chloe Sparks (extreme duration anomaly: 960 active minutes in a day)
   */
  const sampleParticipants = [
    {
      id: 'part_01',
      name: 'Samantha Reed',
      avatar: 'SR',
      city: 'Boulder, CO',
      completedChallenges: 6,
      streakDays: 14,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 17200, activeMinutes: 75, water: 9, sleep: 8.1 },
        { date: getDateString(1), steps: 18500, activeMinutes: 80, water: 10, sleep: 8.0 },
        { date: getDateString(2), steps: 16900, activeMinutes: 70, water: 9, sleep: 7.9 },
        { date: getDateString(3), steps: 19100, activeMinutes: 85, water: 10, sleep: 8.2 },
        { date: getDateString(4), steps: 17800, activeMinutes: 75, water: 9, sleep: 8.0 },
        { date: getDateString(5), steps: 18200, activeMinutes: 80, water: 10, sleep: 8.1 },
        { date: getDateString(6), steps: 16400, activeMinutes: 70, water: 8, sleep: 7.8 }
      ]
    },
    {
      id: 'part_02',
      name: 'Liam Chen',
      avatar: 'LC',
      city: 'Seattle, WA',
      completedChallenges: 5,
      streakDays: 11,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 15400, activeMinutes: 65, water: 8, sleep: 7.8 },
        { date: getDateString(1), steps: 16800, activeMinutes: 72, water: 9, sleep: 8.0 },
        { date: getDateString(2), steps: 15900, activeMinutes: 68, water: 9, sleep: 7.9 },
        { date: getDateString(3), steps: 17200, activeMinutes: 75, water: 9, sleep: 8.1 },
        { date: getDateString(4), steps: 15100, activeMinutes: 64, water: 8, sleep: 7.7 },
        { date: getDateString(5), steps: 16500, activeMinutes: 70, water: 9, sleep: 8.0 },
        { date: getDateString(6), steps: 14800, activeMinutes: 60, water: 8, sleep: 7.6 }
      ]
    },
    {
      id: 'part_03',
      name: 'Priya Patel',
      avatar: 'PP',
      city: 'Austin, TX',
      completedChallenges: 5,
      streakDays: 9,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 13200, activeMinutes: 60, water: 8, sleep: 8.0 },
        { date: getDateString(1), steps: 14100, activeMinutes: 64, water: 9, sleep: 8.1 },
        { date: getDateString(2), steps: 12800, activeMinutes: 58, water: 8, sleep: 7.9 },
        { date: getDateString(3), steps: 13900, activeMinutes: 62, water: 8, sleep: 8.0 },
        { date: getDateString(4), steps: 12500, activeMinutes: 55, water: 8, sleep: 7.8 },
        { date: getDateString(5), steps: 13600, activeMinutes: 60, water: 9, sleep: 8.1 },
        { date: getDateString(6), steps: 12100, activeMinutes: 52, water: 7, sleep: 7.7 }
      ]
    },
    {
      id: 'part_04',
      name: 'Jordan Miller',
      avatar: 'JM',
      city: 'Denver, CO',
      completedChallenges: 4,
      streakDays: 8,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 12400, activeMinutes: 55, water: 8, sleep: 7.8 },
        { date: getDateString(1), steps: 13000, activeMinutes: 58, water: 8, sleep: 7.9 },
        { date: getDateString(2), steps: 11900, activeMinutes: 52, water: 7, sleep: 7.6 },
        { date: getDateString(3), steps: 12800, activeMinutes: 56, water: 8, sleep: 7.8 },
        { date: getDateString(4), steps: 11500, activeMinutes: 50, water: 7, sleep: 7.5 },
        { date: getDateString(5), steps: 12600, activeMinutes: 54, water: 8, sleep: 7.7 },
        { date: getDateString(6), steps: 11200, activeMinutes: 48, water: 7, sleep: 7.6 }
      ]
    },
    {
      id: 'part_05',
      name: 'Sofia Rossi',
      avatar: 'SR',
      city: 'Boston, MA',
      completedChallenges: 4,
      streakDays: 7,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 11800, activeMinutes: 50, water: 8, sleep: 7.7 },
        { date: getDateString(1), steps: 12400, activeMinutes: 54, water: 8, sleep: 7.8 },
        { date: getDateString(2), steps: 11300, activeMinutes: 48, water: 7, sleep: 7.5 },
        { date: getDateString(3), steps: 12100, activeMinutes: 52, water: 8, sleep: 7.6 },
        { date: getDateString(4), steps: 10900, activeMinutes: 46, water: 7, sleep: 7.4 },
        { date: getDateString(5), steps: 11700, activeMinutes: 50, water: 8, sleep: 7.7 },
        { date: getDateString(6), steps: 10600, activeMinutes: 45, water: 7, sleep: 7.5 }
      ]
    },
    {
      id: 'part_06',
      name: 'Emily Watson',
      avatar: 'EW',
      city: 'Portland, OR',
      completedChallenges: 4,
      streakDays: 6,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 10900, activeMinutes: 45, water: 8, sleep: 7.9 },
        { date: getDateString(1), steps: 11500, activeMinutes: 48, water: 8, sleep: 8.0 },
        { date: getDateString(2), steps: 10400, activeMinutes: 42, water: 7, sleep: 7.6 },
        { date: getDateString(3), steps: 11200, activeMinutes: 46, water: 8, sleep: 7.8 },
        { date: getDateString(4), steps: 10100, activeMinutes: 40, water: 7, sleep: 7.5 },
        { date: getDateString(5), steps: 10800, activeMinutes: 44, water: 8, sleep: 7.7 },
        { date: getDateString(6), steps: 9800, activeMinutes: 38, water: 7, sleep: 7.4 }
      ]
    },
    {
      id: 'part_07',
      name: 'Marcus Turbo',
      avatar: 'MT',
      city: 'San Francisco, CA',
      completedChallenges: 4,
      streakDays: 5,
      isCurrentUser: false,
      dailyActivities: [
        // INTENTIONAL ANOMALY: 28,000 steps logged in 20 active minutes (1400 steps/minute impossible cadence)
        { date: getDateString(0), steps: 28000, activeMinutes: 20, water: 8, sleep: 7.5 },
        { date: getDateString(1), steps: 12200, activeMinutes: 50, water: 8, sleep: 7.8 },
        { date: getDateString(2), steps: 11500, activeMinutes: 48, water: 8, sleep: 7.6 },
        { date: getDateString(3), steps: 12000, activeMinutes: 52, water: 8, sleep: 7.7 },
        { date: getDateString(4), steps: 11000, activeMinutes: 45, water: 7, sleep: 7.4 },
        { date: getDateString(5), steps: 11800, activeMinutes: 49, water: 8, sleep: 7.6 },
        { date: getDateString(6), steps: 10500, activeMinutes: 42, water: 7, sleep: 7.5 }
      ]
    },
    {
      id: 'part_08',
      name: 'Carlos Mendez',
      avatar: 'CM',
      city: 'Miami, FL',
      completedChallenges: 3,
      streakDays: 6,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 10200, activeMinutes: 46, water: 8, sleep: 7.6 },
        { date: getDateString(1), steps: 10800, activeMinutes: 48, water: 8, sleep: 7.8 },
        { date: getDateString(2), steps: 9900, activeMinutes: 44, water: 7, sleep: 7.5 },
        { date: getDateString(3), steps: 10500, activeMinutes: 47, water: 8, sleep: 7.7 },
        { date: getDateString(4), steps: 9500, activeMinutes: 40, water: 7, sleep: 7.4 },
        { date: getDateString(5), steps: 10100, activeMinutes: 45, water: 8, sleep: 7.6 },
        { date: getDateString(6), steps: 9200, activeMinutes: 38, water: 7, sleep: 7.3 }
      ]
    },
    {
      id: 'part_09',
      name: 'Aisha Khan',
      avatar: 'AK',
      city: 'Chicago, IL',
      completedChallenges: 3,
      streakDays: 5,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 9800, activeMinutes: 42, water: 8, sleep: 7.8 },
        { date: getDateString(1), steps: 10300, activeMinutes: 45, water: 8, sleep: 7.9 },
        { date: getDateString(2), steps: 9500, activeMinutes: 40, water: 7, sleep: 7.6 },
        { date: getDateString(3), steps: 10000, activeMinutes: 44, water: 8, sleep: 7.7 },
        { date: getDateString(4), steps: 9100, activeMinutes: 38, water: 7, sleep: 7.5 },
        { date: getDateString(5), steps: 9700, activeMinutes: 42, water: 8, sleep: 7.6 },
        { date: getDateString(6), steps: 8900, activeMinutes: 36, water: 7, sleep: 7.4 }
      ]
    },
    {
      id: 'part_10',
      name: 'Maya Tanaka',
      avatar: 'MT',
      city: 'San Diego, CA',
      completedChallenges: 3,
      streakDays: 5,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 9400, activeMinutes: 40, water: 7, sleep: 7.5 },
        { date: getDateString(1), steps: 9900, activeMinutes: 42, water: 8, sleep: 7.7 },
        { date: getDateString(2), steps: 9100, activeMinutes: 38, water: 7, sleep: 7.4 },
        { date: getDateString(3), steps: 9600, activeMinutes: 41, water: 8, sleep: 7.6 },
        { date: getDateString(4), steps: 8800, activeMinutes: 36, water: 7, sleep: 7.3 },
        { date: getDateString(5), steps: 9300, activeMinutes: 39, water: 7, sleep: 7.5 },
        { date: getDateString(6), steps: 8500, activeMinutes: 34, water: 6, sleep: 7.2 }
      ]
    },
    {
      id: 'part_11',
      name: 'Dave Speed',
      avatar: 'DS',
      city: 'Phoenix, AZ',
      completedChallenges: 3,
      streakDays: 4,
      isCurrentUser: false,
      dailyActivities: [
        // INTENTIONAL ANOMALY: 62,000 steps in one day (exceeds human limit 45k)
        { date: getDateString(0), steps: 62000, activeMinutes: 280, water: 12, sleep: 6.5 },
        { date: getDateString(1), steps: 10400, activeMinutes: 45, water: 8, sleep: 7.8 },
        { date: getDateString(2), steps: 9800, activeMinutes: 40, water: 7, sleep: 7.5 },
        { date: getDateString(3), steps: 10100, activeMinutes: 42, water: 8, sleep: 7.6 },
        { date: getDateString(4), steps: 9500, activeMinutes: 38, water: 7, sleep: 7.4 },
        { date: getDateString(5), steps: 9900, activeMinutes: 41, water: 8, sleep: 7.5 },
        { date: getDateString(6), steps: 9200, activeMinutes: 36, water: 7, sleep: 7.3 }
      ]
    },
    {
      id: 'part_12',
      name: 'Lucas Silva',
      avatar: 'LS',
      city: 'Salt Lake City, UT',
      completedChallenges: 3,
      streakDays: 4,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 9100, activeMinutes: 38, water: 7, sleep: 7.6 },
        { date: getDateString(1), steps: 9500, activeMinutes: 40, water: 8, sleep: 7.8 },
        { date: getDateString(2), steps: 8800, activeMinutes: 36, water: 7, sleep: 7.5 },
        { date: getDateString(3), steps: 9200, activeMinutes: 39, water: 7, sleep: 7.7 },
        { date: getDateString(4), steps: 8500, activeMinutes: 34, water: 6, sleep: 7.4 },
        { date: getDateString(5), steps: 9000, activeMinutes: 38, water: 7, sleep: 7.6 },
        { date: getDateString(6), steps: 8200, activeMinutes: 32, water: 6, sleep: 7.3 }
      ]
    },
    {
      id: 'part_13',
      name: 'Nina Kowalski',
      avatar: 'NK',
      city: 'Minneapolis, MN',
      completedChallenges: 2,
      streakDays: 4,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 8700, activeMinutes: 35, water: 7, sleep: 7.8 },
        { date: getDateString(1), steps: 9100, activeMinutes: 38, water: 8, sleep: 7.9 },
        { date: getDateString(2), steps: 8400, activeMinutes: 34, water: 7, sleep: 7.6 },
        { date: getDateString(3), steps: 8900, activeMinutes: 36, water: 7, sleep: 7.7 },
        { date: getDateString(4), steps: 8100, activeMinutes: 32, water: 6, sleep: 7.5 },
        { date: getDateString(5), steps: 8600, activeMinutes: 35, water: 7, sleep: 7.6 },
        { date: getDateString(6), steps: 7800, activeMinutes: 30, water: 6, sleep: 7.4 }
      ]
    },
    {
      id: 'part_14',
      name: 'Ethan Brooks',
      avatar: 'EB',
      city: 'Atlanta, GA',
      completedChallenges: 2,
      streakDays: 4,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 8400, activeMinutes: 34, water: 7, sleep: 7.5 },
        { date: getDateString(1), steps: 8800, activeMinutes: 36, water: 7, sleep: 7.7 },
        { date: getDateString(2), steps: 8100, activeMinutes: 32, water: 6, sleep: 7.4 },
        { date: getDateString(3), steps: 8500, activeMinutes: 35, water: 7, sleep: 7.6 },
        { date: getDateString(4), steps: 7900, activeMinutes: 30, water: 6, sleep: 7.3 },
        { date: getDateString(5), steps: 8300, activeMinutes: 33, water: 7, sleep: 7.5 },
        { date: getDateString(6), steps: 7600, activeMinutes: 28, water: 6, sleep: 7.2 }
      ]
    },
    {
      id: 'part_15',
      name: 'Chloe Sparks',
      avatar: 'CS',
      city: 'Los Angeles, CA',
      completedChallenges: 2,
      streakDays: 3,
      isCurrentUser: false,
      dailyActivities: [
        // INTENTIONAL ANOMALY: 960 active minutes (16 hours) recorded in a single day
        { date: getDateString(0), steps: 18500, activeMinutes: 960, water: 10, sleep: 4.0 },
        { date: getDateString(1), steps: 8200, activeMinutes: 32, water: 7, sleep: 7.5 },
        { date: getDateString(2), steps: 7800, activeMinutes: 30, water: 6, sleep: 7.4 },
        { date: getDateString(3), steps: 8100, activeMinutes: 31, water: 7, sleep: 7.6 },
        { date: getDateString(4), steps: 7600, activeMinutes: 28, water: 6, sleep: 7.3 },
        { date: getDateString(5), steps: 8000, activeMinutes: 30, water: 6, sleep: 7.5 },
        { date: getDateString(6), steps: 7400, activeMinutes: 26, water: 6, sleep: 7.2 }
      ]
    },
    {
      id: 'part_16',
      name: 'Olivia Taylor',
      avatar: 'OT',
      city: 'Nashville, TN',
      completedChallenges: 2,
      streakDays: 3,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 8100, activeMinutes: 32, water: 7, sleep: 7.6 },
        { date: getDateString(1), steps: 8400, activeMinutes: 34, water: 7, sleep: 7.7 },
        { date: getDateString(2), steps: 7800, activeMinutes: 30, water: 6, sleep: 7.5 },
        { date: getDateString(3), steps: 8200, activeMinutes: 33, water: 7, sleep: 7.6 },
        { date: getDateString(4), steps: 7600, activeMinutes: 29, water: 6, sleep: 7.4 },
        { date: getDateString(5), steps: 8000, activeMinutes: 31, water: 7, sleep: 7.5 },
        { date: getDateString(6), steps: 7300, activeMinutes: 27, water: 6, sleep: 7.3 }
      ]
    },
    {
      id: 'part_17',
      name: 'Noah Davis',
      avatar: 'ND',
      city: 'Raleigh, NC',
      completedChallenges: 2,
      streakDays: 3,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 7700, activeMinutes: 30, water: 6, sleep: 7.4 },
        { date: getDateString(1), steps: 8000, activeMinutes: 32, water: 7, sleep: 7.6 },
        { date: getDateString(2), steps: 7400, activeMinutes: 28, water: 6, sleep: 7.3 },
        { date: getDateString(3), steps: 7800, activeMinutes: 30, water: 6, sleep: 7.5 },
        { date: getDateString(4), steps: 7200, activeMinutes: 26, water: 6, sleep: 7.2 },
        { date: getDateString(5), steps: 7600, activeMinutes: 29, water: 6, sleep: 7.4 },
        { date: getDateString(6), steps: 7000, activeMinutes: 25, water: 5, sleep: 7.1 }
      ]
    },
    {
      id: 'part_18',
      name: 'Hannah Kim',
      avatar: 'HK',
      city: 'San Jose, CA',
      completedChallenges: 1,
      streakDays: 3,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 7300, activeMinutes: 28, water: 6, sleep: 7.7 },
        { date: getDateString(1), steps: 7600, activeMinutes: 30, water: 7, sleep: 7.8 },
        { date: getDateString(2), steps: 7100, activeMinutes: 26, water: 6, sleep: 7.5 },
        { date: getDateString(3), steps: 7400, activeMinutes: 28, water: 6, sleep: 7.6 },
        { date: getDateString(4), steps: 6900, activeMinutes: 25, water: 5, sleep: 7.4 },
        { date: getDateString(5), steps: 7200, activeMinutes: 27, water: 6, sleep: 7.5 },
        { date: getDateString(6), steps: 6600, activeMinutes: 23, water: 5, sleep: 7.2 }
      ]
    },
    {
      id: 'part_19',
      name: 'Daniel Brown',
      avatar: 'DB',
      city: 'Columbus, OH',
      completedChallenges: 1,
      streakDays: 2,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 6900, activeMinutes: 25, water: 6, sleep: 7.3 },
        { date: getDateString(1), steps: 7200, activeMinutes: 27, water: 6, sleep: 7.5 },
        { date: getDateString(2), steps: 6700, activeMinutes: 24, water: 5, sleep: 7.2 },
        { date: getDateString(3), steps: 7000, activeMinutes: 26, water: 6, sleep: 7.4 },
        { date: getDateString(4), steps: 6500, activeMinutes: 22, water: 5, sleep: 7.1 },
        { date: getDateString(5), steps: 6800, activeMinutes: 25, water: 6, sleep: 7.3 },
        { date: getDateString(6), steps: 6200, activeMinutes: 20, water: 5, sleep: 7.0 }
      ]
    },
    {
      id: 'part_20',
      name: 'Jessica White',
      avatar: 'JW',
      city: 'Philadelphia, PA',
      completedChallenges: 1,
      streakDays: 2,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 6400, activeMinutes: 22, water: 5, sleep: 7.5 },
        { date: getDateString(1), steps: 6700, activeMinutes: 24, water: 6, sleep: 7.6 },
        { date: getDateString(2), steps: 6200, activeMinutes: 20, water: 5, sleep: 7.3 },
        { date: getDateString(3), steps: 6500, activeMinutes: 23, water: 5, sleep: 7.4 },
        { date: getDateString(4), steps: 6000, activeMinutes: 19, water: 5, sleep: 7.2 },
        { date: getDateString(5), steps: 6300, activeMinutes: 22, water: 6, sleep: 7.3 },
        { date: getDateString(6), steps: 5800, activeMinutes: 18, water: 4, sleep: 7.0 }
      ]
    },
    {
      id: 'part_21',
      name: 'Tyler Green',
      avatar: 'TG',
      city: 'Detroit, MI',
      completedChallenges: 1,
      streakDays: 2,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 5800, activeMinutes: 20, water: 5, sleep: 7.2 },
        { date: getDateString(1), steps: 6100, activeMinutes: 22, water: 5, sleep: 7.4 },
        { date: getDateString(2), steps: 5600, activeMinutes: 18, water: 4, sleep: 7.1 },
        { date: getDateString(3), steps: 5900, activeMinutes: 21, water: 5, sleep: 7.3 },
        { date: getDateString(4), steps: 5400, activeMinutes: 17, water: 4, sleep: 7.0 },
        { date: getDateString(5), steps: 5700, activeMinutes: 19, water: 5, sleep: 7.2 },
        { date: getDateString(6), steps: 5100, activeMinutes: 15, water: 4, sleep: 6.9 }
      ]
    },
    {
      id: 'part_22',
      name: 'Grace Hopper',
      avatar: 'GH',
      city: 'Arlington, VA',
      completedChallenges: 1,
      streakDays: 1,
      isCurrentUser: false,
      dailyActivities: [
        { date: getDateString(0), steps: 5200, activeMinutes: 18, water: 5, sleep: 7.0 },
        { date: getDateString(1), steps: 5500, activeMinutes: 20, water: 5, sleep: 7.1 },
        { date: getDateString(2), steps: 5000, activeMinutes: 16, water: 4, sleep: 6.9 },
        { date: getDateString(3), steps: 5300, activeMinutes: 19, water: 5, sleep: 7.0 },
        { date: getDateString(4), steps: 4800, activeMinutes: 15, water: 4, sleep: 6.8 },
        { date: getDateString(5), steps: 5100, activeMinutes: 17, water: 4, sleep: 6.9 },
        { date: getDateString(6), steps: 4600, activeMinutes: 14, water: 4, sleep: 6.7 }
      ]
    }
  ];

  // Expose on global window object
  window.WellnessData = {
    currentUser,
    initialChallenges,
    defaultEnrollments,
    initialUserActivities,
    sampleParticipants,
    getDateString
  };
})();
