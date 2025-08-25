
import React, { useState, useContext, createContext, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---

type ReaderProgress = {
  [key: number]: number;
};

type Reader = {
  id: number;
  name: string;
  avatar: string;
  ageRange: 'kids' | 'teens' | 'adults';
  joinedChallengeIds: number[];
  progress: ReaderProgress;
};

type Book = {
  id: number;
  readerId: number;
  title: string;
  author?: string;
  status: 'reading' | 'finished' | 'to-read';
  challengeId?: number | null;
  progressMinutes: number;
};

// --- MOCK DATA ---

const translations = {
  en: {
    appTitle: "Georges River Reads",
    logReading: "Log Reading",
    challenges: "Challenges",
    badges: "Badges",
    events: "Events",
    profile: "Profile",
    home: "Home",
    currentReader: "Current Reader",
    switchReader: "Switch Reader",
    activeChallenge: "Your Active Challenge",
    activeChallenges: "Your Active Challenges",
    logYourReading: "Log Your Reading",
    minutesRead: "Minutes Read",
    save: "Save",
    cancel: "Cancel",
    availableChallenges: "Available Challenges",
    upcomingEvents: "Upcoming Events",
    familyMembers: "Family Members",
    accountSettings: "Account Settings",
    goal: "Goal",
    progress: "Progress",
    addReader: "Add Reader",
    newReaderName: "New Reader's Name",
    chooseAvatar: "Choose an Avatar",
    explorer: "Explorer",
    explorerPassport: "Georges River Explorer Passport",
    scanNewCode: "Scan New QR Code",
    readyToScan: "Ready to Scan",
    simulateScanAt: "Simulate Scan at {libraryName}",
    forChildren: "For Children (Ages 4-10)",
    forTeens: "For Teens (Ages 11-18)",
    forAdults: "For Adults",
    generalChallenges: "General Challenges",
    books: "books",
    mins: "mins",
    ageRange: "Age range",
    ageKids: "Kids (Ages 0-13)",
    ageTeens: "Teens (Ages 13-18)",
    ageAdults: "Adults",
    joinChallenge: "Join Challenge",
    joined: "Joined",
    noActiveChallenge: "No Active Challenge",
    browseChallengesPrompt: "Browse the challenges page to start a new adventure!",
    manageChallenge: "Manage",
    whosJoining: "Who is joining this challenge?",
    applyToChallenge: "Apply to which challenge(s)?",
    pleaseSelectOneChallenge: "Please select at least one challenge to log your reading for.",
    noBadges: "No Badges Earned Yet!",
    noBadgesPrompt: "Complete a challenge to see your first badge here.",
    challengeBadges: "Challenge Badges",
    bookClub: "Book Club",
    virtualBookClub: "Spring Book Clubs",
    thisMonthsPick: "Spring Book Clubs",
    bookClubDescription: "Read along with us! Join our online discussion to share your thoughts and connect with fellow readers from the Georges River community.",
    joinTheDiscussion: "Join the Discussion",
    bookOfTheMonth: "Book of the Month",
    recommended: "Recommended",
    forKids: "For Kids",
    findAtLibrary: "Find at Library",
    // New translations for logging flow
    title: "Title",
    authorOptional: "Author (optional)",
    next: "Next",
    back: "Back",
    loggingFor: "Logging for:",
    // New translations for "Currently Reading" feature
    whatWillYouReadNext: "What will you read next? Tap the '+' to start a new book!",
    addANewBook: "Add a New Book",
    linkToChallenge: "Link to a Challenge",
    startReading: "Start Reading",
    logTime: "Log Time",
    imFinished: "I'm Finished",
    howManyMinutes: "How many minutes did you read today?",
    congratulations: "Congratulations!",
    markAsFinished: "Mark '{bookTitle}' as finished?",
    yesImFinished: "Yes, I'm Finished!",
    notYet: "Not Yet",
    currentlyReading: "Currently Reading",
    linkedTo: "Linked to:",
    startNewBook: "Start a New Book",
    completedBooks: "Completed Books",
    noCompletedBooks: "No Completed Books Yet!",
    noCompletedBooksPrompt: "Finish a book to add it to your collection.",
    noJoinedChallenges: "No Joined Challenges Yet!",
    noJoinedChallengesPrompt: "You can start a book without a challenge, or go to the Challenges page to join one.",
  },
  zh: {
    appTitle: "乔治河阅读",
    logReading: "记录阅读",
    challenges: "挑战",
    badges: "徽章",
    events: "活动",
    profile: "个人资料",
    home: "主页",
    currentReader: "当前读者",
    switchReader: "切换读者",
    activeChallenge: "您的当前挑战",
    activeChallenges: "您的当前挑战",
    logYourReading: "记录您的阅读",
    minutesRead: "阅读分钟",
    save: "保存",
    cancel: "取消",
    availableChallenges: "可参与的挑战",
    upcomingEvents: "近期活动",
    familyMembers: "家庭成员",
    accountSettings: "账户设置",
    goal: "目标",
    progress: "进度",
    addReader: "添加读者",
    newReaderName: "新读者姓名",
    chooseAvatar: "选择头像",
    explorer: "探索",
    explorerPassport: "乔治河探索者护照",
    scanNewCode: "扫描新二维码",
    readyToScan: "准备扫描",
    simulateScanAt: "模拟在 {libraryName} 扫描",
    forChildren: "儿童挑战 (4-10岁)",
    forTeens: "青少年挑战 (11-18岁)",
    forAdults: "成人挑战",
    generalChallenges: "通用挑战",
    books: "书籍",
    mins: "分钟",
    ageRange: "年龄范围",
    ageKids: "儿童 (0-13岁)",
    ageTeens: "青少年 (13-18岁)",
    ageAdults: "成人",
    joinChallenge: "加入挑战",
    joined: "已加入",
    noActiveChallenge: "没有进行中的挑战",
    browseChallengesPrompt: "浏览挑战页面，开始新的冒险吧！",
    manageChallenge: "管理",
    whosJoining: "谁要参加这个挑战？",
    applyToChallenge: "应用于挑战",
    pleaseSelectOneChallenge: "请至少选择一个挑战来记录您的阅读时间。",
    noBadges: "尚未获得徽章！",
    noBadgesPrompt: "完成一个挑战，在这里查看你的第一个徽章。",
    challengeBadges: "挑战徽章",
    bookClub: "读书俱乐部",
    virtualBookClub: "春季读书俱乐部",
    thisMonthsPick: "春季读书俱乐部",
    bookClubDescription: "与我们一起阅读！加入我们的在线讨论，分享您的想法，并与乔治河社区的其他读者联系。",
    joinTheDiscussion: "加入讨论",
    bookOfTheMonth: "本月之书",
    recommended: "推荐",
    forKids: "儿童推荐",
    findAtLibrary: "在图书馆查找",
     // New translations for logging flow
    title: "书名",
    authorOptional: "作者（选填）",
    next: "下一步",
    back: "返回",
    loggingFor: "记录:",
    // New translations for "Currently Reading" feature
    whatWillYouReadNext: "接下来要读什么？点击“+”开始一本新书！",
    addANewBook: "添加新书",
    linkToChallenge: "关联一个挑战",
    startReading: "开始阅读",
    logTime: "记录时间",
    imFinished: "我读完了",
    howManyMinutes: "今天你读了多少分钟？",
    congratulations: "恭喜！",
    markAsFinished: "确定将《{bookTitle}》标记为已读完吗？",
    yesImFinished: "是的，我读完了！",
    notYet: "还没",
    currentlyReading: "正在阅读",
    linkedTo: "关联于:",
    startNewBook: "开始一本新书",
    completedBooks: "已完成的书籍",
    noCompletedBooks: "还没有完成的书！",
    noCompletedBooksPrompt: "完成一本书，将其添加到您的收藏中。",
    noJoinedChallenges: "尚未加入任何挑战！",
    noJoinedChallengesPrompt: "您可以直接开始阅读，或前往“挑战”页面加入一个新挑战。",
  },
};

const initialReaders: Reader[] = [
  { id: 1, name: 'Dad', avatar: '👨‍🦰', ageRange: 'adults', joinedChallengeIds: [1, 15], progress: { 1: 120, 15: 1 } },
  { id: 2, name: 'Maya', avatar: '👧', ageRange: 'kids', joinedChallengeIds: [4, 7, 14], progress: { 4: 12, 7: 1, 14: 1 } },
  { id: 3, name: 'Leo', avatar: '👦', ageRange: 'kids', joinedChallengeIds: [5], progress: { 5: 4 } },
];

const initialBooks: Book[] = [
  { id: 1, readerId: 1, title: 'Journey to the West', author: 'Wu Cheng\'en', status: 'reading', challengeId: 1, progressMinutes: 120 },
  { id: 2, readerId: 2, title: 'The Peasant Prince', author: 'Li Cunxin', status: 'reading', challengeId: 4, progressMinutes: 30 },
  { id: 3, readerId: 2, title: 'I am a Dragon', author: 'Ying Chang Compestine', status: 'finished', challengeId: 4, progressMinutes: 60 },
  { id: 4, readerId: 3, title: 'Bilingual Bookworm Stories', author: 'Author', status: 'reading', challengeId: 5, progressMinutes: 0 },
];

const initialChallenges = [
  // General Challenges
  { id: 1, title: 'Summer Reading Quest', description: 'Read for 10 hours this summer.', goal: 600, badge: '🏆', unit: 'mins', category: 'general' },
  { id: 2, title: 'Around the World', description: 'Read books from 5 different countries.', goal: 5, badge: '🌍', unit: 'books', category: 'general' },
  { id: 3, title: 'Fantasy Fanatic', description: 'Finish 3 fantasy novels.', goal: 3, badge: '🧙‍♂️', unit: 'books', category: 'general' },
  
  // Children Challenges
  { id: 4, title: 'The Great Zodiac Race', description: 'Read 12 books over the year, one for each animal of the Chinese zodiac.', goal: 12, badge: '🐲', unit: 'books', category: 'children' },
  { id: 5, title: 'Bilingual Bookworm', description: 'Read 5 picture books in English and 5 in Mandarin or Cantonese.', goal: 10, badge: '🐛', unit: 'books', category: 'children' },
  { id: 6, title: 'Dumpling Discovery', description: 'Read a book that features cooking or a delicious meal.', goal: 1, badge: '🥟', unit: 'books', category: 'children' },
  { id: 7, title: 'My First Legend', description: 'Read a book that tells a classic Chinese legend, like the story of Mulan or the Weaving Girl.', goal: 1, badge: '📜', unit: 'books', category: 'children' },

  // Teen Challenges
  { id: 8, title: 'Three Kingdoms Strategist', description: 'Read a book (fiction or non-fiction) about the Three Kingdoms period.', goal: 1, badge: '⚔️', unit: 'books', category: 'teens' },
  { id: 9, title: 'Asian-Australian Voices', description: 'Read two books by prominent Asian-Australian authors.', goal: 2, badge: '🇦🇺', unit: 'books', category: 'teens' },
  { id: 10, title: 'Silk Road Traveller', description: 'Read a book (fiction or non-fiction) about the Silk Road.', goal: 1, badge: '🐫', unit: 'books', category: 'teens' },
  { id: 11, title: 'Future Shock', description: 'Read a Chinese science-fiction novel.', goal: 1, badge: '🚀', unit: 'books', category: 'teens' },
  { id: 12, title: 'Dynasty Dive', description: 'Pick one Chinese dynasty and read one historical fiction book set within it.', goal: 1, badge: '🏯', unit: 'books', category: 'teens' },
  { id: 13, title: 'Poetry & Power', description: 'Read a collection of classical Chinese poetry.', goal: 1, badge: '✒️', unit: 'books', category: 'teens' },
  { id: 14, title: 'Taste of Home', description: 'Read a book where food plays a central role in the story\'s culture and family connections.', goal: 1, badge: '🍜', unit: 'books', category: 'teens' },

  // Adult Challenges
  { id: 15, title: 'The Four Classics Challenge', description: 'Read the Four Great Classical Novels of China.', goal: 4, badge: '📚', unit: 'books', category: 'adults', isBookOfTheMonth: true },
  { id: 16, title: 'Modern Literary Masters', description: 'Read a book by modern Chinese authors, like Mo Yan or Yu Hua.', goal: 1, badge: '✍️', unit: 'books', category: 'adults' },
  { id: 17, title: 'Generational Journey', description: 'Read a family saga that spans multiple generations.', goal: 1, badge: '👨‍👩‍👧‍👦', unit: 'books', category: 'adults' },
  { id: 18, title: 'Philosophical Pathways', description: 'Read a book about the core teachings of Taoism or Confucianism.', goal: 1, badge: '☯️', unit: 'books', category: 'adults' },
  { id: 19, title: 'Non-Fiction Navigator', description: 'Read an in-depth non-fiction book about a specific period in Chinese history.', goal: 1, badge: '📖', unit: 'books', category: 'adults' },
  { id: 20, title: 'Culinary Heritage', description: 'Read a memoir or biography where food and family recipes are central to the story.', goal: 1, badge: '🍲', unit: 'books', category: 'adults' },
  { id: 21, title: 'Cross-Cultural Connection', description: 'Read a book by a Western author set in China and one by a Chinese author set in a Western country.', goal: 2, badge: '🤝', unit: 'books', category: 'adults' },
];

const events = [
  { id: 1, title: 'Bilingual Story Time', location: 'Hurstville Library', date: 'Sat, Aug 30 @ 10:00 AM' },
  { id: 2, title: 'Author Visit: Sarah Chen', location: 'Kogarah Library', date: 'Tue, Sep 2 @ 6:00 PM' },
  { id: 3, title: 'Library Craft Corner', location: 'Oatley Library', date: 'Fri, Sep 5 @ 3:30 PM' },
];

const libraries = [
  { id: 1, name: 'Hurstville Library', location: 'Hurstville', qrCodeValue: 'GR_HURSTVILLE_2025' },
  { id: 3, name: 'Oatley Library', location: 'Oatley', qrCodeValue: 'GR_OATLEY_2025' },
  { id: 4, name: 'Penshurst Library', location: 'Penshurst', qrCodeValue: 'GR_PENSHURST_2025' },
  { id: 5, name: 'South Hurstville Library', location: 'S. Hurstville', qrCodeValue: 'GR_SOUTH_HURSTVILLE_2025' },
  { id: 6, name: 'Clive James Library, Kogarah', location: 'Kogarah', qrCodeValue: 'GR_CLIVE_JAMES_2025' },
];

const recommendations = {
  kids: [
    { id: 1, title: 'The Peasant Prince', author: 'Li Cunxin', description: 'The inspiring story of a young boy from rural China who becomes a world-famous ballet dancer. Based on the author\'s own life.', emoji: '🕺' },
    { id: 2, title: 'I am a Dragon', author: 'Ying Chang Compestine', description: 'A fun and vibrant story celebrating the Chinese New Year and the traditions of the zodiac animals.', emoji: '🐲' },
    { id: 3, title: 'Whose Dumplings?', author: 'Gillian Sze', description: 'A heartwarming tale about a young girl who tries to figure out which family in her apartment building is making her favorite dumplings.', emoji: '🥟' },
  ],
  teens: [
    { id: 4, title: 'The Surprising Power of a Good Dumpling', author: 'Wai Chim', description: 'A moving story about a Chinese-Australian teen who has to care for her mother struggling with mental illness, while navigating school, friends, and her family\'s restaurant.', emoji: '❤️' },
    { id: 5, title: 'Tiger Daughter', author: 'Rebecca Lim', description: 'An award-winning novel about the friendship between two Chinese-Australian teens and their struggle against family expectations and cultural pressures.', emoji: '🐅' },
    { id: 6, title: 'Iron Widow', author: 'Xiran Jay Zhao', description: 'A sci-fi reimagining of Chinese history featuring giant mechs, fierce female pilots, and a challenge to patriarchal traditions.', emoji: '🤖' },
  ],
  adults: [
    { id: 7, title: 'Wild Swans: Three Daughters of China', author: 'Jung Chang', description: 'A powerful and epic historical account of three generations of women in China, from the last emperor to the era of Mao.', emoji: '🦢' },
    { id: 8, title: 'Balzac and the Little Chinese Seamstress', author: 'Dai Sijie', description: 'A beautiful novel about two city boys sent for "re-education" in a remote mountain village during the Cultural Revolution, and how their discovery of a suitcase full of forbidden Western novels changes their lives.', emoji: '🎻' },
    { id: 9, title: 'The Fortunes', author: 'Peter Ho Davies', description: 'A sweeping novel that examines 150 years of Chinese-American history through the lives of four distinct characters.', emoji: '📜' },
  ],
};

const bookClubs = [
  {
    id: 1,
    name: "History Buffs Book Club",
    currentBook: "Wild Swans: Three Daughters of China",
    author: "Jung Chang",
    description: "Explore pivotal moments in history through compelling non-fiction and historical fiction.",
    emoji: '📜',
    joinLink: 'https://www.facebook.com/GeorgesRiverLibraries/'
  },
  {
    id: 2,
    name: "Modern Fiction Circle",
    currentBook: "The Surprising Power of a Good Dumpling",
    author: "Wai Chim",
    description: "Discuss contemporary novels and discover new voices in the literary world.",
    emoji: '🥟',
    joinLink: 'https://www.facebook.com/GeorgesRiverLibraries/'
  },
  {
    id: 3,
    name: "Young Adult Fantasy Fans",
    currentBook: "Iron Widow",
    author: "Xiran Jay Zhao",
    description: "Dive into magical realms, epic quests, and imaginative storytelling for teens and adults alike.",
    emoji: '🤖',
    joinLink: 'https://www.facebook.com/GeorgesRiverLibraries/'
  }
];

// --- CONTEXT FOR STATE MANAGEMENT ---

const AppContext = createContext(null);

const AppProvider = (props) => {
  const [currentReader, setCurrentReader] = useState<Reader>(initialReaders[0]);
  const [activePage, setActivePage] = useState('home');
  const [language, setLanguage] = useState('en');
  const [isAddReaderModalOpen, setIsAddReaderModalOpen] = useState(false);
  const [readers, setReaders] = useState<Reader[]>(initialReaders);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [collectedStamps, setCollectedStamps] = useState([]);
  const [isExplorerScannerModalOpen, setIsExplorerScannerModalOpen] = useState(false);
  const [isJoinChallengeModalOpen, setIsJoinChallengeModalOpen] = useState(false);
  const [managingChallengeId, setManagingChallengeId] = useState(null);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isStartReadingFlowActive, setIsStartReadingFlowActive] = useState(false);


  const t = translations[language];

  const addReader = (name: string, avatar: string, ageRange: 'kids' | 'teens' | 'adults') => {
    const newReader: Reader = {
      id: Date.now(), // simple unique id
      name,
      avatar,
      ageRange,
      joinedChallengeIds: [],
      progress: {},
    };
    setReaders([...readers, newReader]);
  };
  
  const updateChallengeParticipants = (challengeId, participatingReaderIds) => {
    setReaders(prevReaders => {
      const newReaders = prevReaders.map(reader => {
        const hasJoined = reader.joinedChallengeIds.includes(challengeId);
        const shouldJoin = participatingReaderIds.includes(reader.id);

        if (shouldJoin && !hasJoined) {
          return { ...reader, joinedChallengeIds: [...reader.joinedChallengeIds, challengeId] };
        } else if (!shouldJoin && hasJoined) {
          return { ...reader, joinedChallengeIds: reader.joinedChallengeIds.filter(id => id !== challengeId) };
        }
        return reader;
      });

      const updatedCurrentReader = newReaders.find(r => r.id === currentReader.id);
      if (updatedCurrentReader) {
        setCurrentReader(updatedCurrentReader);
      }
      return newReaders;
    });
  };

  const updateChallengeProgress = (challengeId, value) => {
    let updatedReader;
    setReaders(prevReaders =>
      prevReaders.map(reader => {
        if (reader.id === currentReader.id && reader.joinedChallengeIds.includes(challengeId)) {
          const challenge = challenges.find(c => c.id === challengeId);
          if (!challenge) return reader;

          const currentProgress = reader.progress?.[challengeId] || 0;
          const newProgress = currentProgress + value;
          
          updatedReader = {
            ...reader,
            progress: {
              ...reader.progress,
              [challengeId]: Math.min(newProgress, challenge.goal),
            },
          };
          return updatedReader;
        }
        return reader;
      })
    );

    if (updatedReader) {
        setCurrentReader(updatedReader);
    }
  };
  
  const startReading = (bookDetails, challengeId) => {
      const newBook: Book = {
        id: Date.now(),
        readerId: currentReader.id,
        title: bookDetails.title,
        author: bookDetails.author,
        status: 'reading',
        challengeId,
        progressMinutes: 0,
      };
      setBooks(prevBooks => [...prevBooks, newBook]);
      
      // Auto-join the challenge if one is selected and the reader hasn't joined it yet
      if (challengeId && !currentReader.joinedChallengeIds.includes(challengeId)) {
        setReaders(prevReaders => {
          const newReaders = prevReaders.map(reader => {
            if (reader.id === currentReader.id) {
              return { ...reader, joinedChallengeIds: [...reader.joinedChallengeIds, challengeId] };
            }
            return reader;
          });

          // Also update the currentReader in context to keep it in sync
          const updatedCurrentReader = newReaders.find(r => r.id === currentReader.id);
          if (updatedCurrentReader) {
            setCurrentReader(updatedCurrentReader);
          }
          return newReaders;
        });
      }
  };

  const logProgress = (bookId, minutes) => {
      let bookToUpdate;
      setBooks(prevBooks =>
        prevBooks.map(book => {
          if (book.id === bookId) {
            bookToUpdate = {
              ...book,
              progressMinutes: book.progressMinutes + minutes,
            };
            return bookToUpdate;
          }
          return book;
        })
      );
  
      if (bookToUpdate?.challengeId) {
        const challenge = challenges.find(c => c.id === bookToUpdate.challengeId);
        if (challenge && challenge.unit === 'mins') {
          updateChallengeProgress(bookToUpdate.challengeId, minutes);
        }
      }
  };
  
  const finishBook = (bookId) => {
      let finishedBook;
      setBooks(prevBooks =>
        prevBooks.map(book => {
          if (book.id === bookId) {
            finishedBook = { ...book, status: 'finished' };
            return finishedBook;
          }
          return book;
        })
      );

      if (finishedBook?.challengeId) {
        const challenge = challenges.find(c => c.id === finishedBook.challengeId);
        if (challenge && challenge.unit === 'books') {
          updateChallengeProgress(finishedBook.challengeId, 1);
        }
      }
  };

  const collectStamp = (qrCodeValue) => {
    setCollectedStamps(prevStamps => {
        if (prevStamps.includes(qrCodeValue)) {
            return prevStamps;
        }
        return [...prevStamps, qrCodeValue];
    });
  };

  const value = {
    currentReader, setCurrentReader,
    activePage, setActivePage,
    language, setLanguage,
    isAddReaderModalOpen, setIsAddReaderModalOpen,
    readers, addReader,
    challenges, events,
    libraries,
    collectedStamps, collectStamp,
    isExplorerScannerModalOpen, setIsExplorerScannerModalOpen,
    isJoinChallengeModalOpen, setIsJoinChallengeModalOpen,
    managingChallengeId, setManagingChallengeId,
    updateChallengeParticipants,
    books, startReading, logProgress, finishBook,
    isStartReadingFlowActive, setIsStartReadingFlowActive,
    t, // translations
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);


// --- REUSABLE COMPONENTS ---

const Header = () => {
  const { t, language, setLanguage } = useAppContext();
  const logoUrl = 'https://georgesriver.spydus.com/api/maintenance/1.0/imagebrowser/image?blobName=a31cf63f-7e24-41d5-b1f8-c206bde45ce6.png';

  return (
    <header className="bg-primary-dark p-4 flex items-center sticky top-0 z-10">
      <div className="shrink-0">
        <img src={logoUrl} alt="Georges River Council Logo" className="h-10" />
      </div>

      <div className="flex-1 mx-2 sm:mx-4">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white text-center">{t.appTitle}</h1>
      </div>
      
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-sm font-sans font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-white text-primary-dark' : 'bg-primary text-white hover:bg-secondary'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('zh')}
          className={`px-3 py-1 text-sm font-sans font-semibold rounded-full transition-colors ${language === 'zh' ? 'bg-white text-primary-dark' : 'bg-primary text-white hover:bg-secondary'}`}
        >
          CH
        </button>
      </div>
    </header>
  );
};

const HomeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const ChallengesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const BadgesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L12.99 18l1.188-.648a2.25 2.25 0 011.423-1.423l1.188-.648.648 1.188a2.25 2.25 0 011.423 1.423l.648 1.188-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
  </svg>
);

const RecommendedIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const BookClubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.55c0 2.43.834 4.67 2.25 6.337V21.75l5.25-2.95c.747.134 1.52.2 2.25.2z" />
  </svg>
);

const EventsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const OpenBookIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


const BottomNav = () => {
  const { activePage, setActivePage, t } = useAppContext();
  
  const navItems = [
    { id: 'home', label: t.home, icon: HomeIcon },
    { id: 'challenges', label: t.challenges, icon: ChallengesIcon },
    { id: 'badges', label: t.badges, icon: BadgesIcon },
    { id: 'recommended', label: t.recommended, icon: RecommendedIcon },
    { id: 'bookclub', label: t.bookClub, icon: BookClubIcon },
    { id: 'events', label: t.events, icon: EventsIcon },
    { id: 'profile', label: t.profile, icon: ProfileIcon },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-10">
      {navItems.map(item => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 text-xs font-sans font-medium rounded-lg p-1 transition-colors ${activePage === item.id ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <IconComponent className="w-6 h-6" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </footer>
  );
};

const ReaderSelector = () => {
  const { currentReader, setCurrentReader, readers, t } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectReader = (reader) => {
    setCurrentReader(reader);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
      <h2 className="text-sm font-sans font-medium text-gray-500 mb-2">{t.currentReader}</h2>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center gap-4 w-full">
        <span className="text-5xl">{currentReader.avatar}</span>
        <span className="text-3xl font-display font-bold text-gray-800">{currentReader.name}</span>
        <span className="text-gray-400">▼</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-xl mt-2 z-20">
          {readers.map(reader => (
            <button
              key={reader.id}
              onClick={() => selectReader(reader)}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-lightest"
            >
              <span className="text-3xl">{reader.avatar}</span>
              <span className="text-lg font-sans text-gray-800">{reader.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChallengeCard = ({ challenge, isJoined = false, onManage = () => {}, showJoinButton = false, progress = 0, isBookOfTheMonth = false, totalMinutes, totalBooks }) => {
  const { t } = useAppContext();
  const percentage = challenge.goal > 0 ? Math.min(100, Math.round((progress / challenge.goal) * 100)) : 0;
  const unitLabel = challenge.unit === 'books' ? t.books : t.mins;
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 relative overflow-hidden">
       {isBookOfTheMonth && (
        <div className="absolute top-4 -right-10 w-32 transform rotate-45 bg-accent text-white text-xs font-bold uppercase tracking-wider text-center py-1 shadow-lg">
            {t.bookOfTheMonth}
        </div>
       )}
      <div className="flex items-start gap-4">
        <div className="text-4xl">{challenge.badge}</div>
        <div className="flex-1">
          <h3 className="font-sans font-bold text-lg text-primary">{challenge.title}</h3>
          <p className="text-sm font-sans text-gray-600 mb-3">{challenge.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
            <div className="flex items-center gap-1.5 bg-lightest px-2 py-1 rounded-md" title={`${totalMinutes} ${t.mins} read in this challenge`}>
              <ClockIcon className="w-4 h-4 text-secondary" />
              <span className="font-semibold">{totalMinutes}</span>
              <span className="text-xs text-gray-600">{t.mins}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-lightest px-2 py-1 rounded-md" title={`${totalBooks} ${t.books} finished in this challenge`}>
              <OpenBookIcon className="w-4 h-4 text-secondary" />
              <span className="font-semibold">{totalBooks}</span>
              <span className="text-xs text-gray-600">{t.books}</span>
            </div>
          </div>
          
          <div className="w-full bg-lighter rounded-full h-2.5">
            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="text-xs font-sans text-gray-500 mt-1 flex justify-end">
              <span>{t.goal}: {challenge.goal} {unitLabel}</span>
          </div>
        </div>
      </div>
      {showJoinButton && (
        <button 
            onClick={onManage}
            className={`w-full font-sans font-bold py-2 rounded-lg transition-colors ${
                isJoined 
                ? 'bg-lighter text-primary hover:bg-light' 
                : 'bg-secondary text-white hover:bg-secondary-dark'
            }`}
        >
            {isJoined ? t.manageChallenge : t.joinChallenge}
        </button>
      )}
    </div>
  );
};

const EventCard = (props) => {
  const { event } = props;
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-sans font-bold text-lg text-primary">{event.title}</h3>
      <p className="text-sm font-sans text-gray-600">{event.location}</p>
      <p className="text-sm font-sans font-medium text-secondary mt-1">{event.date}</p>
    </div>
  );
};

const AddReaderModal = () => {
    const { isAddReaderModalOpen, setIsAddReaderModalOpen, addReader, t } = useAppContext();
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('😀');
    const [ageRange, setAgeRange] = useState<'kids' | 'teens' | 'adults'>('kids');
    
    const avatars = ['😀', '👧', '👦', '👩‍🦰', '👨‍🦰', '👵', '👴', '🐶', '🐱', '🦄', '🤖'];

    if (!isAddReaderModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && selectedAvatar) {
            addReader(name.trim(), selectedAvatar, ageRange);
            setName('');
            setSelectedAvatar('😀');
            setAgeRange('kids');
            setIsAddReaderModalOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" role="dialog" aria-modal="true" aria-labelledby="add-reader-modal-title">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                <form onSubmit={handleSubmit}>
                    <h2 id="add-reader-modal-title" className="font-display text-2xl font-bold text-primary mb-4">{t.addReader}</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="readerName" className="block text-sm font-sans font-medium text-gray-700">{t.newReaderName}</label>
                            <input
                                type="text"
                                id="readerName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                placeholder="e.g., Grandma"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ageRange" className="block text-sm font-sans font-medium text-gray-700">{t.ageRange}</label>
                            <select
                                id="ageRange"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value as 'kids' | 'teens' | 'adults')}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                            >
                                <option value="kids">{t.ageKids}</option>
                                <option value="teens">{t.ageTeens}</option>
                                <option value="adults">{t.ageAdults}</option>
                            </select>
                        </div>
                    </div>


                    <p className="block text-sm font-sans font-medium text-gray-700 mt-4 mb-2">{t.chooseAvatar}</p>
                    <div className="grid grid-cols-6 gap-2">
                        {avatars.map(avatar => (
                            <button
                                type="button"
                                key={avatar}
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`text-3xl p-2 rounded-full transition-all ${selectedAvatar === avatar ? 'bg-accent ring-2 ring-primary' : 'bg-lighter hover:bg-light'}`}
                                aria-label={`Select avatar ${avatar}`}
                            >
                                {avatar}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddReaderModalOpen(false)} className="px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light">{t.cancel}</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark">{t.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ExplorerScannerModal = () => {
    const { isExplorerScannerModalOpen, setIsExplorerScannerModalOpen, collectStamp, libraries, t } = useAppContext();

    if (!isExplorerScannerModalOpen) return null;

    const handleScan = (qrCodeValue) => {
        collectStamp(qrCodeValue);
        setIsExplorerScannerModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" role="dialog" aria-modal="true" aria-labelledby="scanner-modal-title">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center">
                <h2 id="scanner-modal-title" className="font-display text-2xl font-bold text-primary mb-6">{t.readyToScan}</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {libraries.map(library => (
                        <button
                            key={library.id}
                            onClick={() => handleScan(library.qrCodeValue)}
                            className="w-full bg-lighter text-primary font-sans font-bold py-3 rounded-lg text-md hover:bg-light transition-colors"
                        >
                            {t.simulateScanAt.replace('{libraryName}', library.name)}
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsExplorerScannerModalOpen(false)} className="mt-6 text-sm text-gray-600 hover:underline">
                    {t.cancel}
                </button>
            </div>
        </div>
    );
};

const JoinChallengeModal = () => {
    const { 
        isJoinChallengeModalOpen, 
        setIsJoinChallengeModalOpen, 
        managingChallengeId, 
        setManagingChallengeId, 
        readers, 
        challenges, 
        updateChallengeParticipants, 
        t 
    } = useAppContext();
    
    const [selectedReaderIds, setSelectedReaderIds] = useState([]);

    const challenge = challenges.find(c => c.id === managingChallengeId);

    useEffect(() => {
        if (challenge) {
            const participatingIds = readers
                .filter(r => r.joinedChallengeIds.includes(challenge.id))
                .map(r => r.id);
            setSelectedReaderIds(participatingIds);
        } else {
            setSelectedReaderIds([]);
        }
    }, [challenge, readers, isJoinChallengeModalOpen]);


    if (!isJoinChallengeModalOpen || !challenge) return null;

    const handleToggleReader = (readerId) => {
        setSelectedReaderIds(prevIds => 
            prevIds.includes(readerId)
                ? prevIds.filter(id => id !== readerId)
                : [...prevIds, readerId]
        );
    };

    const handleSave = () => {
        updateChallengeParticipants(managingChallengeId, selectedReaderIds);
        handleClose();
    };

    const handleClose = () => {
        setIsJoinChallengeModalOpen(false);
        setManagingChallengeId(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" role="dialog" aria-modal="true" aria-labelledby="join-challenge-modal-title">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                <h2 id="join-challenge-modal-title" className="font-display text-2xl font-bold text-primary mb-2">{challenge.title}</h2>
                <p className="font-sans text-gray-600 mb-4">{t.whosJoining}</p>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {readers.map(reader => {
                        const isSelected = selectedReaderIds.includes(reader.id);
                        return (
                            <div 
                                key={reader.id} 
                                onClick={() => handleToggleReader(reader.id)}
                                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleToggleReader(reader.id)}}
                                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-accent text-white' : 'bg-lighter hover:bg-light'}`}
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={0}
                            >
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isSelected ? 'bg-white border-white' : 'border-gray-400'}`}>
                                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                </div>
                                <span className="text-4xl">{reader.avatar}</span>
                                <span className={`text-lg font-sans font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>{reader.name}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light">{t.cancel}</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark">{t.save}</button>
                </div>
            </div>
        </div>
    );
};

// --- NEW BOOK MANAGEMENT COMPONENTS ---

const LogTimeModal = ({ book, onSave, onClose, t }) => {
  const minutesInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const minutes = parseInt(minutesInputRef.current.value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      onSave(minutes);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
        <form onSubmit={handleSubmit}>
          <h2 className="font-display text-xl font-bold text-primary mb-2 text-center">{t.logTime}</h2>
          <p className="text-center font-sans text-gray-600 mb-4 truncate">{book.title}</p>
          <label htmlFor="minutes" className="block text-sm font-sans font-medium text-gray-700">{t.howManyMinutes}</label>
          <input
            ref={minutesInputRef}
            type="number"
            id="minutes"
            name="minutes"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            placeholder="e.g., 30"
            required
            min={1}
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light">{t.cancel}</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FinishBookModal = ({ book, onConfirm, onClose, t }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center">
        <h2 className="font-display text-2xl font-bold text-primary mb-2">{t.congratulations} 🎉</h2>
        <p className="font-sans text-gray-700 mb-6">{t.markAsFinished.replace('{bookTitle}', book.title)}</p>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full px-4 py-3 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark">{t.yesImFinished}</button>
          <button onClick={onClose} className="w-full px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light">{t.notYet}</button>
        </div>
      </div>
    </div>
  );
};

const CurrentlyReadingCard = ({ book }) => {
  const { t, challenges, logProgress, finishBook } = useAppContext();
  const [activeModal, setActiveModal] = useState<'log' | 'finish' | null>(null);

  const linkedChallenge = challenges.find(c => c.id === book.challengeId);

  const handleLogSave = (minutes) => {
    logProgress(book.id, minutes);
    setActiveModal(null);
  };

  const handleFinishConfirm = () => {
    finishBook(book.id);
    setActiveModal(null);
  };
  
  const shouldShowProgressBar = linkedChallenge && linkedChallenge.unit === 'mins';
  const progressPercentage = shouldShowProgressBar 
    ? Math.min(100, Math.round((book.progressMinutes / linkedChallenge.goal) * 100)) 
    : 0;

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-24 bg-lighter rounded flex items-center justify-center text-4xl text-primary flex-shrink-0">
            {book.title.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-bold text-lg text-primary-dark truncate">{book.title}</h3>
            {book.author && <p className="text-sm font-sans text-gray-500 mb-2 truncate">by {book.author}</p>}
            {linkedChallenge && (
              <div className="text-xs font-sans text-gray-600 bg-lightest px-2 py-1 rounded inline-flex items-center gap-1">
                <span>{linkedChallenge.badge}</span>
                <span className="font-medium">{t.linkedTo}</span>
                <span className="truncate">{linkedChallenge.title}</span>
              </div>
            )}
            {shouldShowProgressBar && (
              <div className="mt-2">
                <div className="w-full bg-lighter rounded-full h-2.5">
                  <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="text-xs font-sans text-gray-500 mt-1 flex justify-end">
                    <span>{book.progressMinutes} / {linkedChallenge.goal} {t.mins}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-lighter">
          <button onClick={() => setActiveModal('log')} className="flex items-center justify-center gap-2 px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            <span>{t.logTime}</span>
          </button>
          <button onClick={() => setActiveModal('finish')} className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md font-sans font-semibold hover:bg-secondary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>{t.imFinished}</span>
          </button>
        </div>
      </div>
      {activeModal === 'log' && <LogTimeModal book={book} onSave={handleLogSave} onClose={() => setActiveModal(null)} t={t} />}
      {activeModal === 'finish' && <FinishBookModal book={book} onConfirm={handleFinishConfirm} onClose={() => setActiveModal(null)} t={t} />}
    </>
  );
};

const CurrentlyReadingShelf = () => {
    const { t, books, currentReader } = useAppContext();
    const currentlyReadingBooks = books.filter(b => b.readerId === currentReader.id && b.status === 'reading');
    
    return (
        <div>
            <h2 className="font-display text-2xl text-secondary mt-6 mb-3 pb-2 border-b-2 border-lighter text-center">{t.currentlyReading}</h2>
            {currentlyReadingBooks.length > 0 ? (
                <div className="space-y-4">
                    {currentlyReadingBooks.map(book => <CurrentlyReadingCard key={book.id} book={book} />)}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="font-sans text-lg text-primary mb-2">📖</p>
                    <p className="text-sm font-sans text-gray-600">{t.whatWillYouReadNext}</p>
                </div>
            )}
        </div>
    );
};

const CompletedBooksShelf = () => {
    const { t, books, currentReader, challenges } = useAppContext();
    const completedBooks = books.filter(b => b.readerId === currentReader.id && b.status === 'finished');

    return (
        <div>
            <h2 className="font-display text-2xl text-secondary mt-6 mb-3 pb-2 border-b-2 border-lighter text-center">{t.completedBooks}</h2>
            {completedBooks.length > 0 ? (
                <div className="space-y-4">
                    {completedBooks.map(book => {
                        const linkedChallenge = challenges.find(c => c.id === book.challengeId);
                        return (
                            <div key={book.id} className="bg-white p-4 rounded-lg shadow-md flex items-start gap-3">
                                <span className="text-green-500 mt-1 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans font-semibold text-primary-dark truncate">{book.title}</p>
                                    {book.author && <p className="text-sm font-sans text-gray-600 truncate">by {book.author}</p>}
                                    {linkedChallenge && (
                                        <div className="text-xs font-sans text-gray-600 bg-lightest px-2 py-1 rounded inline-flex items-center gap-1 mt-1">
                                            <span>{linkedChallenge.badge}</span>
                                            <span className="truncate">{linkedChallenge.title}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="font-sans font-bold text-gray-700">{t.noCompletedBooks}</p>
                    <p className="text-sm font-sans text-gray-500">{t.noCompletedBooksPrompt}</p>
                </div>
            )}
        </div>
    );
};


const ManualEntryFormNew = ({ onNext, onCancel, t }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onNext({ title: title.trim(), author: author.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 id="start-reading-title" className="font-display text-2xl font-bold text-primary mb-6 text-center">{t.startNewBook}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="bookTitle" className="block text-sm font-sans font-medium text-gray-700 mb-1">{t.title}</label>
          <input type="text" id="bookTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm text-gray-900" placeholder="e.g., The Very Hungry Caterpillar" required />
        </div>
        <div>
          <label htmlFor="bookAuthor" className="block text-sm font-sans font-medium text-gray-700 mb-1">{t.authorOptional}</label>
          <input type="text" id="bookAuthor" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm text-gray-900" placeholder="e.g., Eric Carle" />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-lighter text-primary rounded-md font-sans font-semibold hover:bg-light">{t.cancel}</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark flex items-center gap-2">
            {t.next} <span className="font-bold">→</span>
        </button>
      </div>
    </form>
  );
};

const ChallengeSelector = ({ onStartReading, onBack, t }) => {
  const { currentReader, challenges } = useAppContext();
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const joinedChallenges = challenges.filter(challenge => 
    currentReader.joinedChallengeIds.includes(challenge.id)
  );
  
  const renderCheckbox = (isSelected) => (
    <div className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
      isSelected
        ? 'bg-primary border-primary'
        : 'bg-white border-gray-400'
    }`}>
      {isSelected && (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="font-display text-xl font-bold text-primary mb-4 text-center">{t.linkToChallenge}</h2>
      {joinedChallenges.length > 0 ? (
        <div className="space-y-1">
          {joinedChallenges.map(challenge => (
            <div 
              key={challenge.id} 
              onClick={() => setSelectedChallengeId(challenge.id)} 
              className="flex items-center gap-4 py-2 px-3 rounded-lg cursor-pointer hover:bg-lighter"
              role="radio"
              aria-checked={selectedChallengeId === challenge.id}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setSelectedChallengeId(challenge.id)}}
            >
              {renderCheckbox(selectedChallengeId === challenge.id)}
              <span className="font-sans font-medium text-gray-800 truncate">{challenge.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 font-sans p-4 bg-lightest rounded-lg">
          <p className="font-semibold">{t.noJoinedChallenges}</p>
          <p className="text-sm mt-1">{t.noJoinedChallengesPrompt}</p>
        </div>
      )}
      <div className="mt-6 flex justify-between items-center gap-3">
        <button type="button" onClick={onBack} className="text-sm font-sans font-semibold text-gray-600 hover:text-primary">← {t.back}</button>
        <button type="button" onClick={() => onStartReading(selectedChallengeId)} className="px-5 py-2 bg-primary text-white rounded-md font-sans font-semibold hover:bg-primary-dark flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.755 2.138a.75.75 0 00-1.51 0l-1.83 5.51a.75.75 0 00.697 1.002h3.786a.75.75 0 00.697-1.002l-1.83-5.51zM10 13a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0010 13zM3.804 5.343A.75.75 0 003 6.25v.004c0 .414.336.75.75.75h.004a.75.75 0 00.75-.75V6.25a.75.75 0 00-.699-.907zM16.196 5.343a.75.75 0 00-.804.907V6.25a.75.75 0 00.75.75h.004a.75.75 0 00.75-.75v-.004a.75.75 0 00-.699-.907z" /><path fillRule="evenodd" d="M5.5 10a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zM2 10a.75.75 0 01.75-.75h1.25a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm15.25.75a.75.75 0 000-1.5h-1.25a.75.75 0 000 1.5h1.25z" clipRule="evenodd" /></svg>
            {t.startReading}
        </button>
      </div>
    </div>
  );
};

const StartReadingFlow = () => {
  const { isStartReadingFlowActive, setIsStartReadingFlowActive, startReading, t } = useAppContext();
  const [step, setStep] = useState('details'); // 'details' or 'challenge'
  const [bookDetails, setBookDetails] = useState({ title: '', author: '' });

  const handleNext = (details) => {
    setBookDetails(details);
    setStep('challenge');
  };

  const handleBack = () => {
    setStep('details');
  };

  const handleStartReading = (challengeId) => {
    startReading(bookDetails, challengeId);
    handleClose();
  };

  const handleClose = () => {
    setIsStartReadingFlowActive(false);
    setTimeout(() => {
      setStep('details');
      setBookDetails({ title: '', author: '' });
    }, 300);
  };
  
  if (!isStartReadingFlowActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" role="dialog" aria-modal="true" aria-labelledby="start-reading-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4">
        {step === 'details' ? (
          <ManualEntryFormNew onNext={handleNext} onCancel={handleClose} t={t} />
        ) : (
          <ChallengeSelector onStartReading={handleStartReading} onBack={handleBack} t={t} />
        )}
      </div>
    </div>
  );
};


const FloatingActionButton = () => {
    const { setIsStartReadingFlowActive, t } = useAppContext();
    return (
        <button
            onClick={() => setIsStartReadingFlowActive(true)}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 w-16 h-16 bg-primary rounded-full text-white shadow-lg flex items-center justify-center hover:bg-primary-dark active:scale-95 transition-all"
            aria-label={t.addANewBook}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
};


// --- PAGE COMPONENTS ---

const HomePage = () => {
  return (
    <div className="space-y-6">
      <ReaderSelector />
      <CurrentlyReadingShelf />
      <CompletedBooksShelf />
    </div>
  );
};

const ChallengesPage = () => {
  const { challenges, t, readers, books, setIsJoinChallengeModalOpen, setManagingChallengeId } = useAppContext();
  
  const handleManageChallenge = (challengeId) => {
    setManagingChallengeId(challengeId);
    setIsJoinChallengeModalOpen(true);
  };

  const renderChallengeSection = (title, challengesToRender) => {
    if (challengesToRender.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="font-display text-2xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{title}</h3>
        <div className="space-y-4">
          {challengesToRender.map(challenge => {
            const participatingReaderIds = readers
                .filter(r => r.joinedChallengeIds.includes(challenge.id))
                .map(r => r.id);

            const isFamilyJoined = participatingReaderIds.length > 0;
            
            const totalProgress = readers
                .filter(r => participatingReaderIds.includes(r.id))
                .reduce((sum, reader) => sum + (reader.progress?.[challenge.id] || 0), 0);

            // Calculate total minutes and books for this challenge across all participating family members
            const challengeBooks = books.filter(b => 
                b.challengeId === challenge.id && 
                participatingReaderIds.includes(b.readerId)
            );

            const totalMinutesRead = challengeBooks.reduce((sum, book) => sum + book.progressMinutes, 0);
            const totalBooksRead = challengeBooks.filter(b => b.status === 'finished').length;
            
            return (
                <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    isJoined={isFamilyJoined}
                    onManage={() => handleManageChallenge(challenge.id)}
                    showJoinButton={true}
                    progress={totalProgress}
                    totalMinutes={totalMinutesRead}
                    totalBooks={totalBooksRead}
                />
            );
          })}
        </div>
      </div>
    );
  };
  
  const generalChallenges = challenges.filter(c => c.category === 'general' || !c.category);
  const childrenChallenges = challenges.filter(c => c.category === 'children');
  const teenChallenges = challenges.filter(c => c.category === 'teens');
  const adultChallenges = challenges.filter(c => c.category === 'adults');

  return (
    <div>
      {renderChallengeSection(t.generalChallenges, generalChallenges)}
      {renderChallengeSection(t.forChildren, childrenChallenges)}
      {renderChallengeSection(t.forTeens, teenChallenges)}
      {renderChallengeSection(t.forAdults, adultChallenges)}
    </div>
  );
};

const CompletedChallengeBadge = ({ challenge, earners }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center gap-2 transform hover:scale-105 transition-transform duration-200">
            <div className="text-6xl">{challenge.badge}</div>
            <div className="flex-1 w-full">
                <h3 className="font-sans font-bold text-lg text-primary">{challenge.title}</h3>
            </div>
            {earners && earners.length > 0 && (
                <div className="flex justify-center items-center mt-2 pt-2 border-t border-lighter w-full">
                    <div className="flex -space-x-2">
                        {earners.map(reader => (
                            <div key={reader.id} className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-2xl border-2 border-white" title={reader.name}>
                                {reader.avatar}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Stamp = ({ library, isCollected }) => {
    const containerClasses = `bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center gap-2 transform hover:scale-105 transition-all duration-300 h-full`;

    // Define color palettes based on the theme to make each uncollected stamp unique
    const palettes = [
        { // Palette 1 (Original Teal)
            building: '#E2F2F2', // lightest
            roof: '#5DBFC0',     // accent
            base: '#007582',     // primary
            windows: '#9AD3D4',  // light
            door: '#005C68',     // primary-dark
            doorHandle: '#C8E6E6', // lighter
        },
        { // Palette 2 (Secondary Green focus)
            building: '#E2F2F2', // lightest
            roof: '#00A5A5',     // secondary
            base: '#005C68',     // primary-dark
            windows: '#C8E6E6',  // lighter
            door: '#007582',     // primary
            doorHandle: '#9AD3D4', // light
        },
        { // Palette 3 (Light Blue/Green)
            building: '#C8E6E6', // lighter
            roof: '#9AD3D4',     // light
            base: '#007582',     // primary
            windows: '#E2F2F2',  // lightest
            door: '#00A5A5',     // secondary
            doorHandle: '#FFFFFF',
        },
        { // Palette 4 (Darker base, Accent roof)
            building: '#C8E6E6', // lighter
            roof: '#5DBFC0',     // accent
            base: '#005C68',     // primary-dark
            windows: '#E2F2F2',  // lightest
            door: '#007582',     // primary
            doorHandle: '#9AD3D4', // light
        }
    ];

    // Select a palette based on the library ID to make them slightly different
    const colors = palettes[library.id % palettes.length];

    // Define different building shapes
    const buildingSvgs = [
        // Building 1 (Original A-Frame)
        ({ colors }) => (
            <g>
                <path fill={colors.building} d="M10 58h44V22L32 8 10 22v36z"/>
                <path fill={colors.roof} d="M54 22L32 8 10 22l22 8 22-8z"/>
                <path fill={colors.base} d="M8 58h48v4H8z"/>
                <path fill={colors.windows} d="M16 52V34h8v18H16zm14 0V34h8v18H30zm14 0V34h8v18H44z"/>
                <path fill={colors.door} d="M28 52h8v-9h-8v9z"/>
                <circle cx="34" cy="47.5" r="1" fill={colors.doorHandle}/>
            </g>
        ),
        // Building 2 (Flat Roof)
        ({ colors }) => (
            <g>
                <path fill={colors.building} d="M12 58V24h40v34z" />
                <path fill={colors.base} d="M10 58h44v4H10z" />
                <path fill={colors.roof} d="M12 20h40v4H12z" />
                <path fill={colors.windows} d="M18 50V40h8v10h-8zm16 0V40h8v10h-8zm-16-14V26h8v10h-8zm16 0V26h8v10h-8z" />
                <path fill={colors.door} d="M28 58v-12h8v12z" />
                <circle cx="30" cy="52" r="1" fill={colors.doorHandle} />
            </g>
        ),
        // Building 3 (Curved Roof)
        ({ colors }) => (
            <g>
                <path fill={colors.building} d="M10 58h44V28H10z"/>
                <path fill={colors.roof} d="M10,28 C10,18 54,18 54,28 Z" />
                <path fill={colors.base} d="M8 58h48v4H8z"/>
                <path fill={colors.windows} d="M16 50h32v-6H16zm0-10h32v-6H16z" />
                <path fill={colors.door} d="M28 58v-14h8v14z"/>
                <circle cx="30" cy="51" r="1" fill={colors.doorHandle} />
            </g>
        ),
        // Building 4 (Classical with Columns)
        ({ colors }) => (
             <g>
                <path fill={colors.roof} d="M32 8L8 24h48L32 8z" />
                <path fill={colors.roof} d="M10 28h44v-4H10z" />
                <path fill={colors.building} d="M14 58V32h36v26z"/>
                <path fill={colors.doorHandle} d="M16 54V34h4v20h-4zm8 0V34h4v20h-4zm8 0V34h4v20h-4zm8 0V34h4v20h-4z"/>
                <path fill={colors.base} d="M12 58h40v4H12z"/>
            </g>
        ),
        // Building 5 (Two-Story)
        ({ colors }) => (
            <g>
                <path fill={colors.building} d="M12 58V20h40v38z" />
                <path fill={colors.roof} d="M10 20h44v4H10z" />
                <path fill={colors.base} d="M10 58h44v4H10z" />
                <path fill={colors.windows} d="M18 34h8v-8h-8v8zm16 0h8v-8h-8v8z" />
                <path fill={colors.windows} d="M18 48h8v-8h-8v8z" />
                <path fill={colors.door} d="M38 58v-12h8v12z" />
                <circle cx="40" cy="52" r="1" fill={colors.doorHandle} />
            </g>
        ),
    ];
    
    // Select a building shape based on library ID
    const BuildingIcon = buildingSvgs[library.id % buildingSvgs.length];

    return (
        <div className={containerClasses}>
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                {isCollected ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" aria-label="Collected Stamp">
                        <path fill="#007582" d="M12,1.5l3.09,6.26l6.91,1.01l-5,4.87l1.18,6.88L12,17.25l-6.18,3.25l1.18-6.88l-5-4.87l6.91-1.01L12,1.5z"/>
                        <path fill="#5DBFC0" d="M12 4.5l2.2 4.46 4.92.72-3.56 3.46.84 4.9L12 15.75l-4.4 2.31.84-4.9-3.56 3.46 4.92.72L12 4.5z"/>
                        <path d="M8 12.3l2.7 2.7 5.3-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 64 64" aria-hidden="true">
                       <BuildingIcon colors={colors} />
                    </svg>
                )}
            </div>
            <div className="flex-1 w-full flex flex-col justify-center">
                <h3 className="font-sans font-bold text-lg text-primary">{library.name}</h3>
            </div>
        </div>
    );
};

const BadgesPage = () => {
    const { t, challenges, readers, libraries, collectedStamps, setIsExplorerScannerModalOpen } = useAppContext();

    const allCompletedBadges = challenges
        .map(challenge => {
            const earners = readers.filter(reader => 
                reader.joinedChallengeIds.includes(challenge.id) && 
                (reader.progress?.[challenge.id] || 0) >= challenge.goal
            );
            
            if (earners.length > 0) {
                return { challenge, earners };
            }
            return null;
        })
        .filter(Boolean);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-display text-2xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{t.challengeBadges}</h2>
                {allCompletedBadges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {allCompletedBadges.map(({ challenge, earners }) => (
                            <CompletedChallengeBadge key={challenge.id} challenge={challenge} earners={earners} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="font-sans font-bold text-lg text-primary mb-2">{t.noBadges}</p>
                        <p className="text-sm font-sans text-gray-600">{t.noBadgesPrompt}</p>
                    </div>
                )}
            </div>
            <div>
                <h2 className="font-display text-2xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{t.explorerPassport}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {libraries.map(lib => (
                        <Stamp key={lib.id} library={lib} isCollected={collectedStamps.includes(lib.qrCodeValue)} />
                    ))}
                </div>
                <button
                    onClick={() => setIsExplorerScannerModalOpen(true)}
                    className="w-full bg-secondary text-white font-sans font-bold py-4 rounded-lg shadow-lg text-xl hover:bg-secondary-dark transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{t.scanNewCode}</span>
                </button>
            </div>
        </div>
    );
};

const BookClubCard = ({ club }) => {
  const { t } = useAppContext();
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="text-5xl bg-lightest p-3 rounded-lg flex-shrink-0">{club.emoji}</div>
        <div className="flex-1">
          <h3 className="font-sans font-bold text-lg text-primary">{club.name}</h3>
          <p className="text-sm font-sans italic text-gray-600 mb-1">Currently reading: "{club.currentBook}" by {club.author}</p>
          <p className="text-sm font-sans text-gray-700 mb-3">{club.description}</p>
        </div>
      </div>
      <button
        onClick={() => window.open(club.joinLink, '_blank', 'noopener,noreferrer')}
        className="w-full bg-secondary text-white font-sans font-bold py-2 rounded-lg hover:bg-secondary-dark transition-colors"
      >
        {t.joinTheDiscussion}
      </button>
    </div>
  );
};


const BookClubPage = () => {
    const { t } = useAppContext();

    return (
        <div className="space-y-6">
            <h2 className="font-display text-3xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{t.virtualBookClub}</h2>
            <div className="space-y-4">
                {bookClubs.map(club => <BookClubCard key={club.id} club={club} />)}
            </div>
        </div>
    );
};

const EventsPage = () => {
  const { events, t } = useAppContext();
  return (
    <div>
      <h2 className="font-display text-2xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{t.upcomingEvents}</h2>
      <div className="space-y-4">
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { readers, t, setIsAddReaderModalOpen } = useAppContext();

  const getAgeRangeLabel = (ageRangeKey) => {
    switch (ageRangeKey) {
        case 'kids': return t.ageKids;
        case 'teens': return t.ageTeens;
        case 'adults': return t.ageAdults;
        default: return '';
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-secondary mb-3 pb-2 border-b-2 border-lighter text-center">{t.familyMembers}</h2>
      <div className="space-y-4">
        {readers.map(reader => (
          <div key={reader.id} className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4">
            <span className="text-4xl">{reader.avatar}</span>
            <div className="flex-grow">
                <span className="text-lg font-sans font-medium text-gray-800">{reader.name}</span>
                <span className="block text-sm text-gray-500 font-sans">{getAgeRangeLabel(reader.ageRange)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
         <button onClick={() => setIsAddReaderModalOpen(true)} className="w-full bg-secondary text-white font-sans font-bold py-3 rounded-lg hover:bg-secondary-dark">
            {t.addReader}
        </button>
      </div>
    </div>
  );
};

const BookCard = ({ book }) => {
    const { t } = useAppContext();
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-start">
            <div className="text-5xl bg-lightest p-3 rounded-lg flex-shrink-0">{book.emoji}</div>
            <div className="flex-1">
                <h4 className="font-sans font-bold text-lg text-primary-dark">{book.title}</h4>
                <p className="text-sm font-sans font-medium text-gray-500 mb-1">by {book.author}</p>
                <p className="text-sm font-sans text-gray-700 mb-3">{book.description}</p>
                <button className="text-sm font-sans font-semibold text-secondary hover:text-secondary-dark">
                    {t.findAtLibrary} →
                </button>
            </div>
        </div>
    );
};

const RecommendedPage = () => {
    const { t } = useAppContext();

    const renderBookSection = (title, books) => {
        if (!books || books.length === 0) return null;
        return (
            <section className="mb-8">
                <h3 className="font-display text-2xl text-secondary mb-4 pb-2 border-b-2 border-lighter text-center">{title}</h3>
                <div className="space-y-4">
                    {books.map(book => <BookCard key={book.id} book={book} />)}
                </div>
            </section>
        );
    };

    return (
        <div>
            {renderBookSection(t.forKids, recommendations.kids)}
            {renderBookSection(t.forTeens, recommendations.teens)}
            {renderBookSection(t.forAdults, recommendations.adults)}
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const { activePage } = useAppContext();

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage />;
      case 'challenges': return <ChallengesPage />;
      case 'badges': return <BadgesPage />;
      case 'recommended': return <RecommendedPage />;
      case 'bookclub': return <BookClubPage />;
      case 'events': return <EventsPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="bg-lightest min-h-screen">
      <Header />
      <main className="p-4 pb-24">
        {renderPage()}
      </main>
      <BottomNav />
      {activePage === 'home' && <FloatingActionButton />}
      <AddReaderModal />
      <ExplorerScannerModal />
      <JoinChallengeModal />
      <StartReadingFlow />
    </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
