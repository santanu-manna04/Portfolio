// Content shown until the backend serves it (Phase 3). Pages read it through useApi(),
// which prefers live API data and falls back to this when the API has none.
// Replace the social URLs below with your own; the admin Profile editor takes over in Phase 4.
export const defaultProfile = {
  name: 'Santanu Manna',
  title: 'Aspiring Backend Developer | Node.js Developer',
  intro:
    'I enjoy building the parts of web applications users never see: APIs, authentication, and databases. I am focused on writing scalable, well-structured backend code with Node.js.',
  location: 'India',
  email: '',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  instagram: 'https://www.instagram.com/',
  profileImage: '',
  resumeUrl: '',
  stats: [
    { label: 'Projects Completed', value: 2 },
    { label: 'Technologies Learned', value: 22 },
    { label: 'Certificates Earned', value: 0 },
    { label: 'Years of Coding', value: 0 },
  ],
};

export const typingRoles = ['Backend Developer', 'Node.js Developer', 'JavaScript Developer', 'Full Stack Developer'];

export const skillCategories = ['Programming Languages', 'Backend Development', 'Database', 'Tools', 'Frontend'];

const s = (category, names) => names.map((name) => ({ _id: `${category}-${name}`, name, category, level: null }));
export const defaultSkills = [
  ...s('Programming Languages', ['JavaScript', 'Java', 'Python']),
  ...s('Backend Development', ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'Middleware', 'MVC Architecture']),
  ...s('Database', ['MongoDB', 'Mongoose', 'SQL']),
  ...s('Tools', ['Git', 'GitHub', 'Postman', 'VS Code', 'Docker', 'AWS EC2', 'Nginx']),
  ...s('Frontend', ['HTML', 'CSS', 'React.js']),
];

export const projectFilters = ['All Projects', 'Backend', 'Full Stack', 'JavaScript', 'React'];
export const defaultProjects = [
  {
    _id: 'stream-box',
    title: 'Stream Box',
    description: 'A video uploading and streaming platform.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer', 'JWT'],
    features: ['User authentication', 'Video uploading', 'Media management', 'Video streaming'],
    categories: ['Backend', 'Full Stack', 'JavaScript'],
    githubUrl: '', liveUrl: '', thumbnail: '', screenshots: [],
  },
  {
    _id: 'blog-app',
    title: 'Blog Application',
    description: 'A blogging application with accounts and full post management.',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    features: ['User authentication', 'CRUD operations', 'Profile management'],
    categories: ['Backend', 'JavaScript'],
    githubUrl: '', liveUrl: '', thumbnail: '', screenshots: [],
  },
];

export const defaultCertificates = [];

export const defaultServices = [
  { _id: 'sv1', icon: 'server', title: 'Backend Development', description: 'Building backend applications using Node.js and Express.js.' },
  { _id: 'sv2', icon: 'network', title: 'REST API Development', description: 'Creating secure and structured REST APIs.' },
  { _id: 'sv3', icon: 'database', title: 'Database Management', description: 'MongoDB database design and integration.' },
  { _id: 'sv4', icon: 'shield', title: 'Authentication Systems', description: 'JWT authentication and secure login/signup systems.' },
  { _id: 'sv5', icon: 'bug', title: 'Bug Fixing & API Integration', description: 'Debugging backend issues and integrating APIs.' },
  { _id: 'sv6', icon: 'layers', title: 'Basic Full-Stack Development', description: 'Developing functional applications using React and Node.js.' },
];

export const defaultAbout = {
  bio: 'I am a Computer Science student who got into programming out of curiosity about how websites actually work behind the screen. That curiosity turned into a focus on backend development: designing APIs, handling authentication, and modelling data.',
  degree: 'B.Tech in Computer Science and Engineering (AI & ML)',
  university: 'Brainware University',
  goal: 'Backend Developer',
  interests: ['Backend architecture', 'REST API design', 'Authentication and security', 'Databases', 'Cloud deployment'],
  strengths: ['Breaking problems into small, testable steps', 'Reading documentation and debugging methodically', 'Learning new tools quickly by building with them'],
  hobbies: ['Building side projects', 'Exploring new technologies'],
  timeline: [
    { title: 'Started programming', text: 'Began with core programming concepts and JavaScript fundamentals.' },
    { title: 'B.Tech at Brainware University', text: 'Studying Computer Science and Engineering with a specialisation in AI & ML.' },
    { title: 'Backend with Node.js', text: 'Learned Express.js, MongoDB, JWT authentication and REST API design.' },
    { title: 'Building projects', text: 'Built Stream Box and a Blog Application to apply what I learned.' },
    { title: 'Deployment and tooling', text: 'Exploring Docker, Nginx and AWS EC2 to ship applications.' },
  ],
};
