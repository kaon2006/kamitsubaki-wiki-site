export const navItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'DATABASE', href: '#database' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'LOG', href: '#log' },
];

export const databaseJumpLinks = [
  { label: '>> V.W.P [WITCHES]', href: '#cat-vwp' },
  { label: '>> SOLO ARTISTS', href: '#cat-solo' },
  { label: '>> CREATORS', href: '#cat-creator' },
  { label: '>> MUSICAL ISOTOPES', href: '#cat-isotope' },
];

export const artistCategories = [
  {
    id: 'cat-vwp',
    title: '仮想世代の魔女達',
    subtitle: 'VIRTUAL WITCH PHENOMENON',
    items: [
      {
        code: '01',
        name: '花谱',
        romanizedName: 'KAF',
        meta: 'DEBUT: 2018.10.18',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=KAF',
      },
      {
        code: '02',
        name: '理芽',
        romanizedName: 'RIM',
        meta: 'DEBUT: 2019.10.18',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=RIM',
      },
      {
        code: '03',
        name: '春猿火',
        romanizedName: 'HARUSARUHI',
        meta: 'DEBUT: 2019.11.15',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=HARUSARUHI',
      },
      {
        code: '04',
        name: 'ヰ世界情绪',
        romanizedName: 'ISEKAIJOUCHO',
        meta: 'DEBUT: 2019.12.09',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=ISEKAIJOUCHO',
      },
      {
        code: '05',
        name: '幸祜',
        romanizedName: 'KOKO',
        meta: 'DEBUT: 2020.10.25',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=KOKO',
      },
    ],
  },
  {
    id: 'cat-solo',
    title: 'ソロ / ユニット',
    subtitle: 'SOLO ARTISTS & UNITS',
    items: [
      {
        code: '06',
        name: 'CIEL',
        romanizedName: 'CIEL',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=CIEL',
      },
      {
        code: '07',
        name: 'Albemuth',
        romanizedName: 'ALBEMUTH',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=ALBEMUTH',
      },
    ],
  },
  {
    id: 'cat-creator',
    title: 'クリエイター',
    subtitle: 'CREATORS / COMPOSERS / ILLUSTRATORS',
    items: [
      {
        code: 'C1',
        name: 'カンザキイオリ',
        romanizedName: 'KANZAKI IORI',
        meta: 'ROLE: COMPOSER',
        statusLabel: 'STATUS',
        status: 'GRADUATED',
        inactive: true,
        image: 'https://placehold.co/1200x800/111/333?text=KANZAKI+IORI',
      },
      {
        code: 'C2',
        name: 'Guiano',
        romanizedName: 'GUIANO',
        meta: 'ROLE: COMPOSER',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=GUIANO',
      },
      {
        code: 'C3',
        name: 'PALOW.',
        romanizedName: 'PALOW.',
        meta: 'ROLE: ILLUSTRATOR',
        statusLabel: 'STATUS',
        status: 'ACTIVE',
        image: 'https://placehold.co/1200x800/111/333?text=PALOW.',
      },
    ],
  },
  {
    id: 'cat-isotope',
    title: '音楽的同位体',
    subtitle: 'MUSICAL ISOTOPE',
    items: [
      {
        code: 'M1',
        name: '可不',
        romanizedName: 'KAFU',
        meta: 'ORIGIN: KAF',
        statusLabel: 'TYPE',
        status: 'CeVIO AI',
        image: 'https://placehold.co/1200x800/111/333?text=KAFU',
      },
      {
        code: 'M2',
        name: '星界',
        romanizedName: 'SEKAI',
        meta: 'ORIGIN: ISEKAIJOUCHO',
        statusLabel: 'TYPE',
        status: 'CeVIO AI',
        image: 'https://placehold.co/1200x800/111/333?text=SEKAI',
      },
    ],
  },
];

export const projects = [
  {
    kind: 'PROJECT_ARG',
    title: '神椿市建設中。',
    description:
      'オリジナルIPプロジェクト。プレイヤー参加型の代替現実ゲーム(ARG)として展開された神椿市の記録。',
  },
  {
    kind: 'PROJECT_LABEL',
    title: 'SINSAEKAI STUDIO',
    description: '神椿スタジオから派生した、新たなクリエイティブレーベル。深脊界。',
  },
  {
    kind: 'PROJECT_EXHIBITION',
    title: '魔女展',
    description: 'V.W.Pの軌跡を辿る特別展覧会。衣装、設定資料、アートワークの物理展示記録。',
  },
];

export const logEntries = [
  {
    date: '2024.06.01',
    type: 'UPDATE',
    message: 'V.W.P 3rd ONE-MAN LIVE SETLIST DATA APPENDED.',
  },
  {
    date: '2024.05.15',
    type: 'SYS_MSG',
    message: 'KAMITSUBAKI CITY TIMELINE SYNCHRONIZED.',
  },
  {
    date: '2024.04.30',
    type: 'APPEND',
    message: 'RIM 3rd ALBUM LYRIC INTERPRETATION NODE CREATED.',
  },
];
