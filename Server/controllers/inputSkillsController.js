const InputSkills = require("../models/inputSkillModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const skillsList = [
  // 🧑‍💻 Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Ruby",
  "PHP",
  "Rust",
  "Swift",
  "Kotlin",
  "R",
  "Perl",
  "Scala",
  "Dart",
  "Solidity",

  // 🌐 Frontend Technologies
  "HTML",
  "CSS",
  "SASS",
  "LESS",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",

  // 🧩 Frontend Frameworks/Libraries
  "React",
  "Next.js",
  "Angular",
  "Vue.js",
  "Nuxt.js",
  "Svelte",
  "SolidJS",
  "Preact",

  // 🛠️ Backend Technologies
  "Node.js",
  "Express.js",
  "NestJS",
  "Koa.js",
  "Hapi.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Ruby on Rails",
  "Laravel",
  "ASP.NET",
  "Phoenix (Elixir)",
  "Strapi",
  "Ghost",

  // 📱 Mobile App Development
  "React Native",
  "Flutter",
  "Swift (iOS)",
  "Kotlin (Android)",
  "Java (Android)",
  "Xamarin",
  "Ionic",
  "NativeScript",
  "Cordova",
  "Expo",

  // 🎮 Game Development
  "Unity",
  "Unreal Engine",
  "Godot",
  "Cocos2d",
  "GameMaker",
  "CryEngine",
  "Pygame",
  "LibGDX",

  // 🧠 AI/ML/DL
  "Machine Learning",
  "Deep Learning",
  "Reinforcement Learning",
  "Computer Vision",
  "NLP",
  "GANs",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "OpenCV",
  "XGBoost",
  "LightGBM",
  "CatBoost",
  "AutoML",
  "MLflow",
  "Hugging Face",
  "Transformers",
  "LangChain",
  "Label Studio",

  // 🧾 Data Analysis & Engineering
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Plotly",
  "Power BI",
  "Tableau",
  "Apache Spark",
  "Apache Kafka",
  "Hadoop",
  "Airflow",
  "BigQuery",
  "Snowflake",
  "Redshift",
  "Apache Beam",
  "Flink",
  "dbt",

  // 🗃️ Databases (SQL & NoSQL)
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "MariaDB",
  "Oracle DB",
  "SQL Server",
  "MongoDB",
  "Firebase",
  "Supabase",
  "Redis",
  "Cassandra",
  "CouchDB",
  "DynamoDB",
  "Neo4j",
  "Elasticsearch",
  "InfluxDB",

  // ☁️ DevOps & Cloud
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "GitHub Actions",
  "Bitbucket",
  "Travis CI",
  "CircleCI",
  "AWS",
  "Azure",
  "Google Cloud (GCP)",
  "Vercel",
  "Netlify",
  "Heroku",
  "DigitalOcean",
  "Terraform",
  "Ansible",
  "Prometheus",
  "Grafana",

  // 🔐 Security & Authentication
  "Ethical Hacking",
  "Penetration Testing",
  "OWASP",
  "JWT",
  "OAuth2",
  "SSO",
  "2FA",
  "MFA",

  // 🧪 Testing & QA
  "Jest",
  "Mocha",
  "Chai",
  "Cypress",
  "Playwright",
  "Selenium",
  "Postman Tests",
  "JUnit",
  "PyTest",

  // 🎨 Graphic Design
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Figma",
  "Sketch",
  "Canva",
  "CorelDRAW",
  "Inkscape",

  // 🧑‍🎨 UI/UX Design
  "Wireframing",
  "Prototyping",
  "User Flows",
  "Adobe XD",
  "Figma",
  "Zeplin",
  "Balsamiq",

  // 🎞️ Video Editing & 3D Animation
  "Adobe Premiere Pro",
  "Adobe After Effects",
  "Final Cut Pro",
  "DaVinci Resolve",
  "Filmora",
  "Camtasia",
  "Blender",
  "Maya",
  "Cinema 4D",

  // ⚙️ Build Tools & Package Managers
  "Webpack",
  "Vite",
  "Rollup",
  "Parcel",
  "Babel",
  "npm",
  "Yarn",
  "pnpm",

  // 📚 Documentation & Code Quality
  "ESLint",
  "Prettier",
  "JSDoc",
  "Swagger",
  "OpenAPI",
  "Storybook",

  // 📡 APIs
  "REST API",
  "GraphQL",
  "WebSockets",

  // 🌐 Web Standards
  "SEO",
  "PWA",
  "WAI-ARIA",
  "WCAG",
  "Web Performance Optimization",

  // 📱 Cross-Platform & Desktop
  "Electron.js",
  "Tauri",
  "Capacitor",

  // 📦 CMS & E-Commerce
  "WordPress",
  "Shopify",
  "Magento",
  "Contentful",
  "Sanity.io",

  // 🧩 Architecture & Concepts
  "Microservices",
  "Monorepo",
  "Serverless",
  "MVC",
  "TDD",
  "CI/CD",
  "Agile",
  "Scrum",
  "Kanban",

  // 🤝 Collaboration & Productivity
  "GitLab",
  "JIRA",
  "Confluence",
  "Asana",
  "Trello",
  "Notion",
  "ClickUp",
  "Slack",
  "Zoom",
  "Miro",

  // 🌍 Web3 & Blockchain
  "Web3",
  "Solidity",
  "Smart Contracts",
  "Metamask",
  "Hardhat",
  "Ethers.js",
  "Web3.js",

  // 🕶️ AR/VR & 3D Web
  "Three.js",
  "Babylon.js",
  "A-Frame",
  "ARKit",
  "ARCore",
  "Vuforia",
];

const addInputSkills = async (req, res) => {
  try {
    const skillCount = await InputSkills.countDocuments();

    if (skillCount === 0) {
      const formattedSkills = skillsList.map((skill) => ({ name: skill }));
      await InputSkills.insertMany(formattedSkills);
    }

    const allSkills = await InputSkills.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Skills loaded successfully",
      data: allSkills,
    });
  } catch (error) {
    console.error("Error loading input skills:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading input skills",
    });
  }
};

const getInputSkills = async (req, res) => {
  try {
    const skills = await InputSkills.find().sort({ name: 1 }); 
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching input skills:", error);
    res.status(500).json({ message: "Failed to fetch input skills" });
  }
};

module.exports = {
  addInputSkills,
  getInputSkills,
};
