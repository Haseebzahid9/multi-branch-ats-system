require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Branch = require('./models/Branch');
const Job = require('./models/Job');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Branch.deleteMany();
  await Job.deleteMany();

  // Admin
  const admin = await User.create({
    name: 'Haseeb Zahid',
    email: 'haseebzahid4998@gmail.com',
    password: 'Admin@123',
    phone: '03184006367',
    role: 'admin',
    branch: 'Islamabad',
  });

  // HR
  const hr = await User.create({
    name: 'HR Manager',
    email: 'f230644@cfd.nu.edu.pk',
    password: 'Hr@12345',
    phone: '03001234567',
    role: 'hr',
    branch: 'Islamabad',
  });

  // Branches
  await Branch.insertMany([
    { branchName: 'Islamabad', location: 'Blue Area, Islamabad', manager: 'Haseeb Zahid' },
    { branchName: 'Lahore', location: 'Gulberg III, Lahore', manager: 'Sara Ali' },
    { branchName: 'Karachi', location: 'Clifton, Karachi', manager: 'Omar Sheikh' },
    { branchName: 'Remote', location: 'Pakistan (Remote)', manager: 'Fatima Noor' },
  ]);

  // Jobs
  await Job.insertMany([
    {
      title: 'Software Engineer (MERN)',
      description: 'Develop and maintain web applications using the MERN stack. Work in an agile team to deliver high-quality software solutions.',
      department: 'Information Technology',
      branch: 'Islamabad',
      seats: 5,
      requirements: 'React.js, Node.js, MongoDB, Express.js, REST APIs',
      qualifications: 'BS Computer Science or equivalent',
      salary: 'PKR 80,000 - 120,000',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      postedBy: hr._id,
    },
    {
      title: 'Project Manager',
      description: 'Lead software development projects across multiple teams and branches. Coordinate with stakeholders and ensure timely delivery.',
      department: 'Project Management',
      branch: 'Lahore',
      seats: 2,
      requirements: 'PMP certification, 5+ years experience, Agile/Scrum',
      qualifications: 'MBA or BS in relevant field',
      salary: 'PKR 150,000 - 200,000',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      postedBy: hr._id,
    },
    {
      title: 'UI/UX Designer',
      description: 'Design intuitive and modern user interfaces for our web and mobile applications. Create wireframes, prototypes and high-fidelity designs.',
      department: 'Design',
      branch: 'Remote',
      seats: 3,
      requirements: 'Figma, Adobe XD, CSS, User Research',
      qualifications: 'BS Design or Computer Science',
      salary: 'PKR 70,000 - 100,000',
      jobType: 'Contract',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      postedBy: hr._id,
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage CI/CD pipelines, cloud infrastructure, and deployment automation. Ensure system reliability and scalability.',
      department: 'Infrastructure',
      branch: 'Karachi',
      seats: 2,
      requirements: 'Docker, Kubernetes, AWS/Azure, GitHub Actions',
      qualifications: 'BS Computer Science',
      salary: 'PKR 120,000 - 180,000',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      postedBy: admin._id,
    },
    {
      title: 'Data Analyst',
      description: 'Analyze recruitment data and generate actionable insights for the HR team. Build dashboards and reports.',
      department: 'Analytics',
      branch: 'Islamabad',
      seats: 3,
      requirements: 'Python, SQL, Power BI or Tableau',
      qualifications: 'BS Statistics or Computer Science',
      salary: 'PKR 90,000 - 130,000',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      postedBy: hr._id,
    },
    {
      title: 'Business Analyst',
      description: 'Bridge the gap between technical teams and business stakeholders. Gather requirements, write documentation and support delivery.',
      department: 'Business',
      branch: 'Lahore',
      seats: 2,
      requirements: 'Requirements gathering, documentation, Agile, JIRA',
      qualifications: 'BBA or BS in relevant field',
      salary: 'PKR 80,000 - 110,000',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      postedBy: hr._id,
    },
  ]);

  console.log('\n✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin → haseebzahid4998@gmail.com / Admin@123');
  console.log('HR    → f230644@cfd.nu.edu.pk / Hr@12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
