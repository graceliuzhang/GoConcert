// data.js — shared static data

export const GROUPS = [
  {
    name: 'Tame Impala Gang',
    event: 'Tame Impala',
    venue: 'The Forum',
    date: 'Mar 15',
    emoji: '🌀',
    avatarStyle: {},
    desc: 'Front row fanatics. We pre-game at Bar 101 and split Uber costs!',
    members: [
      { name: 'Alex Rivera', handle: '@alexr_music', avi: '🎸' },
      { name: 'Sam K.', handle: '@samkmusic', avi: '🥁' },
      { name: 'Jamie Chen', handle: '@jamiec', avi: '🎵' },
      { name: 'Taylor M.', handle: '@taylorm', avi: '🎹' },
    ],
  },
  {
    name: 'Billie Besties',
    event: 'Billie Eilish',
    venue: 'Kia Forum',
    date: 'Apr 2',
    emoji: '🌿',
    avatarStyle: { background: 'linear-gradient(135deg,#0a4020,#20a060)' },
    desc: 'All the Billie fans unite! We meet at 6 PM outside Gate B.',
    members: [
      { name: 'Jordan P.', handle: '@jordanp', avi: '🎤' },
      { name: 'Casey W.', handle: '@caseyw', avi: '🎸' },
    ],
  },
  {
    name: 'Solar Power Crew',
    event: 'Lorde',
    venue: 'Hollywood Bowl',
    date: 'Apr 18',
    emoji: '🌙',
    avatarStyle: { background: 'linear-gradient(135deg,#300a50,#8040c0)' },
    desc: 'Lorde stans who want to experience Solar Power live together.',
    members: [
      { name: 'Morgan L.', handle: '@morganl', avi: '🌟' },
      { name: 'Riley T.', handle: '@rileyt', avi: '🎵' },
      { name: 'Quinn A.', handle: '@quinna', avi: '🎸' },
    ],
  },
];

export const EVENTS = [
  { title: 'Tame Impala', venue: 'The Forum', meta: 'Mar 15 · Los Angeles, CA', emoji: '🌀', groups: 12, emojiStyle: {} },
  { title: 'Billie Eilish', venue: 'Kia Forum', meta: 'Apr 2 · Los Angeles, CA', emoji: '🌿', groups: 7, emojiStyle: { background: 'linear-gradient(135deg,#0a2014,#1a6035)' } },
  { title: 'Lorde', venue: 'Hollywood Bowl', meta: 'Apr 18 · Los Angeles, CA', emoji: '🌙', groups: 5, emojiStyle: { background: 'linear-gradient(135deg,#1a0a30,#6030a0)' } },
  { title: 'Hozier', venue: 'Greek Theatre', meta: 'May 1 · Los Angeles, CA', emoji: '🍂', groups: 9, emojiStyle: { background: 'linear-gradient(135deg,#1a1008,#6b4020)' } },
  { title: 'Mitski', venue: 'Wiltern Theatre', meta: 'May 14 · Los Angeles, CA', emoji: '🌸', groups: 4, emojiStyle: { background: 'linear-gradient(135deg,#2a0a1a,#a03060)' } },
  { title: 'Arctic Monkeys', venue: 'Crypto.com Arena', meta: 'Jun 3 · Los Angeles, CA', emoji: '🎸', groups: 15, emojiStyle: { background: 'linear-gradient(135deg,#0a0a18,#303080)' } },
];