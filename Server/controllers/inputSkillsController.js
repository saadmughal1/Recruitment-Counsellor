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
  "PHP",
  "Swift",
  "Kotlin",
  "R",

  // 🌐 Frontend Technologies
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",

  // 🧩 Frontend Frameworks/Libraries
  "React",
  "Next.js",
  "Angular",
  "Vue.js",

  // 🛠️ Backend Technologies
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",

  // 📱 Mobile App Development
  "React Native",
  "Flutter",
  "Swift (iOS)",
  "Kotlin (Android)",
  "Java (Android)",

  // 🧠 AI/ML/DL
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "OpenCV",
  "Hugging Face",
  "Transformers",

  // 🧾 Data Analysis & Engineering
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Power BI",
  "Tableau",
  "Apache Spark",
  "Apache Kafka",
  "Airflow",

  // 🗃️ Databases (SQL & NoSQL)
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "MongoDB",
  "Firebase",
  "Redis",

  // 📡 APIs
  "REST API",
  "GraphQL",

  // 🌐 Web Standards
  "SEO",
  "PWA",
  "WCAG",

  // 📦 CMS & E-Commerce
  "WordPress",
  "Shopify",
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
