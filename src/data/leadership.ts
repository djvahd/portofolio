export interface LeadershipRole {
  title: string
  org: string
  period: string
  note: string
}

export interface Recognition {
  title: string
  year: string
  note: string
}

export const leadership: LeadershipRole[] = [
  {
    title: 'Student Council President',
    org: 'SMAN 5 Magelang',
    period: '2024 to 2025',
    note: 'Led 45 members to deliver 14 work programs.',
  },
  {
    title: 'General Chairperson',
    org: 'Forum Komunikasi OSIS Kota Magelang',
    period: '2024 to 2025',
    note: 'Led 40 members to deliver 18 work programs. Named 2nd Best OSIS Forum in Central Java (2025).',
  },
  {
    title: 'Project Supervisor',
    org: 'IFEST 2026',
    period: '',
    note: 'Supervised four divisions: Event Management, IT Competition, Technopreneur, and National Seminar.',
  },
  {
    title: 'Head of Event Division',
    org: 'Kebaktian Pengucapan Syukur 2026',
    period: '',
    note: 'Led a 12-person team for a service of around 1,100 participants.',
  },
  {
    title: 'Head of Music Production',
    org: 'Konser Gemerlap 2026',
    period: '',
    note: 'Led a 6-person team and worked with around 60 performers and 12 arrangers.',
  },
  {
    title: 'Head of Publication, Design & Documentation',
    org: 'Wind and Fire Conference, Youth Worship Night',
    period: '2026',
    note: 'Led posters, social media, promo videos, after-movies, and live streaming.',
  },
]

export const recognition: Recognition[] = [
  {
    title: 'Finalist, International Canvas Bizplan Competition',
    year: '2026',
    note: 'International level',
  },
  {
    title: '2nd Place, FLS2N Short Film',
    year: '2024',
    note: 'Magelang City level. 3rd place in 2023.',
  },
  {
    title: '1st Place, OSEAN Band Competition',
    year: '2026',
    note: '',
  },
]
