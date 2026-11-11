// Usage: npm run seed            (fills empty collections only)
//        npm run seed -- --reset (replaces profile, skills, services, projects; keeps users, certificates, messages)
require('../config/env');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Project = require('../models/Project');

// Fill in your real links here (or later in the admin dashboard). Empty values are simply hidden on the site.
const profile = {
  name: 'Santanu Manna',
  title: 'Aspiring Backend Developer | Node.js Developer',
  intro: 'I enjoy building the parts of web applications users never see: APIs, authentication, and databases. I am focused on writing scalable, well-structured backend code with Node.js.',
  location: 'India',
  email: '',
  github: '',
  linkedin: '',
  instagram: '',
  stats: [
    { label: 'Projects Completed', value: 2 },
    { label: 'Technologies Learned', value: 22 },
    { label: 'Certificates Earned', value: 0 },
    { label: 'Years of Coding', value: 0 },
  ],
  about: {
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
  },
};

const skillGroups = {
  'Programming Languages': ['JavaScript', 'Java', 'Python'],
  'Backend Development': ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'Middleware', 'MVC Architecture'],
  Database: ['MongoDB', 'Mongoose', 'SQL'],
  Tools: ['Git', 'GitHub', 'Postman', 'VS Code', 'Docker', 'AWS EC2', 'Nginx'],
  Frontend: ['HTML', 'CSS', 'React.js'],
};
const skills = Object.entries(skillGroups).flatMap(([category, names]) => names.map((name, order) => ({ name, category, order })));

const services = [
  { icon: 'server', title: 'Backend Development', description: 'Building backend applications using Node.js and Express.js.' },
  { icon: 'network', title: 'REST API Development', description: 'Creating secure and structured REST APIs.' },
  { icon: 'database', title: 'Database Management', description: 'MongoDB database design and integration.' },
  { icon: 'shield', title: 'Authentication Systems', description: 'JWT authentication and secure login/signup systems.' },
  { icon: 'bug', title: 'Bug Fixing & API Integration', description: 'Debugging backend issues and integrating APIs.' },
  { icon: 'layers', title: 'Basic Full-Stack Development', description: 'Developing functional applications using React and Node.js.' },
].map((s, order) => ({ ...s, order }));

const projects = [
  { title: 'Stream Box', description: 'A video uploading and streaming platform.', technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer', 'JWT'], features: ['User authentication', 'Video uploading', 'Media management', 'Video streaming'], categories: ['Backend', 'Full Stack', 'JavaScript'], order: 0 },
  { title: 'Blog Application', description: 'A blogging application with accounts and full post management.', technologies: ['Node.js', 'Express.js', 'MongoDB'], features: ['User authentication', 'CRUD operations', 'Profile management'], categories: ['Backend', 'JavaScript'], order: 1 },
];

(async () => {
  const reset = process.argv.includes('--reset');
  await connectDB();
  const plan = [[Profile, [profile], 'profile'], [Skill, skills, 'skills'], [Service, services, 'services'], [Project, projects, 'projects']];
  for (const [Model, docs, label] of plan) {
    if (reset) await Model.deleteMany({});
    if ((await Model.countDocuments()) === 0) {
      await Model.insertMany(docs);
      console.log(`Seeded ${label}: ${docs.length}`);
    } else {
      console.log(`Skipped ${label} (already has data; use --reset to replace)`);
    }
  }
  await mongoose.connection.close();
})().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); });
