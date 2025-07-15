// Database seeding script for AfyaHub
// This script creates sample data for the health information platform

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "afyahub"

const sampleUsers = [
  {
    name: "Dr. Sarah Wanjiku",
    email: "admin@afyahub.co.ke",
    password: "admin123", // Will be hashed
    role: "admin",
  },
  {
    name: "John Kamau",
    email: "john@example.com",
    password: "user123", // Will be hashed
    role: "user",
  },
]

const sampleArticles = [
  {
    title: "Understanding Malaria Prevention in Kenya",
    content: `
      <p>Malaria remains one of the leading causes of illness in Kenya, particularly affecting children under five and pregnant women. Understanding prevention methods is crucial for protecting your family.</p>
      
      <h3>Prevention Methods:</h3>
      <ul>
        <li>Use insecticide-treated bed nets (ITNs) every night</li>
        <li>Apply mosquito repellent containing DEET</li>
        <li>Wear long-sleeved clothing during peak mosquito hours</li>
        <li>Remove standing water around your home</li>
      </ul>
      
      <h3>Symptoms to Watch For:</h3>
      <ul>
        <li>Fever and chills</li>
        <li>Headache and body aches</li>
        <li>Nausea and vomiting</li>
        <li>Fatigue and weakness</li>
      </ul>
      
      <p>If you experience these symptoms, seek medical attention immediately. Early treatment is essential for preventing complications.</p>
    `,
    category: "Disease Prevention",
    author: "Dr. Sarah Wanjiku",
    featured: true,
  },
  {
    title: "Maternal Health: Antenatal Care Guidelines",
    content: `
      <p>Regular antenatal care is essential for ensuring a healthy pregnancy and safe delivery. Here's what every expectant mother in Kenya should know.</p>
      
      <h3>Recommended Antenatal Visits:</h3>
      <ul>
        <li>First visit: As soon as pregnancy is confirmed</li>
        <li>Monthly visits until 28 weeks</li>
        <li>Bi-weekly visits from 28-36 weeks</li>
        <li>Weekly visits from 36 weeks until delivery</li>
      </ul>
      
      <h3>Essential Tests and Screenings:</h3>
      <ul>
        <li>Blood pressure monitoring</li>
        <li>Urine tests for protein and glucose</li>
        <li>Blood tests for anemia and infections</li>
        <li>HIV testing and counseling</li>
        <li>Ultrasound scans</li>
      </ul>
      
      <h3>Nutrition During Pregnancy:</h3>
      <p>Eat a balanced diet rich in iron, folic acid, and calcium. Take prescribed supplements and avoid alcohol and smoking.</p>
    `,
    category: "Maternal Health",
    author: "Dr. Sarah Wanjiku",
    featured: true,
  },
  {
    title: "Child Nutrition: First 1000 Days",
    content: `
      <p>The first 1000 days of a child's life (from conception to age 2) are critical for proper growth and development. Good nutrition during this period sets the foundation for lifelong health.</p>
      
      <h3>Breastfeeding Guidelines:</h3>
      <ul>
        <li>Exclusive breastfeeding for the first 6 months</li>
        <li>Continue breastfeeding alongside complementary foods until 2 years</li>
        <li>Breastfeed on demand, day and night</li>
      </ul>
      
      <h3>Introducing Complementary Foods (6 months+):</h3>
      <ul>
        <li>Start with iron-rich foods like fortified cereals</li>
        <li>Introduce one new food at a time</li>
        <li>Include fruits, vegetables, and protein sources</li>
        <li>Avoid honey, whole nuts, and choking hazards</li>
      </ul>
      
      <h3>Signs of Malnutrition:</h3>
      <ul>
        <li>Poor weight gain or weight loss</li>
        <li>Delayed development milestones</li>
        <li>Frequent infections</li>
        <li>Changes in behavior or mood</li>
      </ul>
    `,
    category: "Child Health",
    author: "Dr. Sarah Wanjiku",
    featured: false,
  },
  {
    title: "Mental Health Awareness in Kenya",
    content: `
      <p>Mental health is as important as physical health. In Kenya, mental health challenges affect people of all ages, but with proper awareness and support, recovery is possible.</p>
      
      <h3>Common Mental Health Conditions:</h3>
      <ul>
        <li>Depression and anxiety disorders</li>
        <li>Substance abuse disorders</li>
        <li>Post-traumatic stress disorder (PTSD)</li>
        <li>Bipolar disorder</li>
      </ul>
      
      <h3>Warning Signs:</h3>
      <ul>
        <li>Persistent sadness or hopelessness</li>
        <li>Withdrawal from social activities</li>
        <li>Changes in sleep or appetite</li>
        <li>Difficulty concentrating</li>
        <li>Thoughts of self-harm</li>
      </ul>
      
      <h3>Seeking Help:</h3>
      <p>Mental health services are available at most health facilities in Kenya. Don't hesitate to seek help from qualified mental health professionals.</p>
      
      <h3>Support Resources:</h3>
      <ul>
        <li>Kenya Association for the Welfare of Mental Health</li>
        <li>Befrienders Kenya: 0722 178 177</li>
        <li>Local community health workers</li>
      </ul>
    `,
    category: "Mental Health",
    author: "Dr. Sarah Wanjiku",
    featured: true,
  },
  {
    title: "Diabetes Management and Prevention",
    content: `
      <p>Diabetes is becoming increasingly common in Kenya. Understanding how to prevent and manage diabetes is crucial for maintaining good health.</p>
      
      <h3>Types of Diabetes:</h3>
      <ul>
        <li>Type 1: Usually develops in childhood, requires insulin</li>
        <li>Type 2: Most common, often preventable through lifestyle changes</li>
        <li>Gestational: Develops during pregnancy</li>
      </ul>
      
      <h3>Risk Factors:</h3>
      <ul>
        <li>Family history of diabetes</li>
        <li>Obesity and physical inactivity</li>
        <li>Age over 45 years</li>
        <li>High blood pressure</li>
      </ul>
      
      <h3>Prevention Strategies:</h3>
      <ul>
        <li>Maintain a healthy weight</li>
        <li>Exercise regularly (at least 30 minutes daily)</li>
        <li>Eat a balanced diet low in sugar and processed foods</li>
        <li>Regular health check-ups</li>
      </ul>
      
      <h3>Management Tips:</h3>
      <ul>
        <li>Monitor blood sugar levels regularly</li>
        <li>Take medications as prescribed</li>
        <li>Follow a diabetic-friendly diet</li>
        <li>Regular foot care and eye exams</li>
      </ul>
    `,
    category: "General Health",
    author: "Dr. Sarah Wanjiku",
    featured: false,
  },
  {
    title: "Water, Sanitation, and Hygiene (WASH)",
    content: `
      <p>Good hygiene practices are fundamental to preventing diseases and maintaining health. Simple practices can significantly reduce the risk of infections.</p>
      
      <h3>Hand Hygiene:</h3>
      <ul>
        <li>Wash hands with soap and clean water for at least 20 seconds</li>
        <li>Wash before eating, after using the toilet, and after coughing/sneezing</li>
        <li>Use alcohol-based hand sanitizer when soap is not available</li>
      </ul>
      
      <h3>Safe Water Practices:</h3>
      <ul>
        <li>Drink only treated or boiled water</li>
        <li>Store water in clean, covered containers</li>
        <li>Use safe water for cooking and food preparation</li>
      </ul>
      
      <h3>Food Safety:</h3>
      <ul>
        <li>Cook food thoroughly and eat while hot</li>
        <li>Wash fruits and vegetables before eating</li>
        <li>Store food properly to prevent contamination</li>
        <li>Avoid street food from unreliable sources</li>
      </ul>
      
      <h3>Environmental Sanitation:</h3>
      <ul>
        <li>Use proper toilet facilities</li>
        <li>Dispose of waste properly</li>
        <li>Keep living areas clean and well-ventilated</li>
      </ul>
    `,
    category: "Disease Prevention",
    author: "Dr. Sarah Wanjiku",
    featured: true,
  },
]

async function seedDatabase() {
  let client

  try {
    console.log("Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)

    // Clear existing data
    console.log("Clearing existing data...")
    await db.collection("users").deleteMany({})
    await db.collection("articles").deleteMany({})
    await db.collection("contacts").deleteMany({})

    // Hash passwords and insert users
    console.log("Creating users...")
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    const userResult = await db.collection("users").insertMany(usersWithHashedPasswords)
    console.log(`Successfully inserted ${userResult.insertedCount} users`)

    // Insert articles
    console.log("Creating articles...")
    const articlesWithDates = sampleArticles.map((article) => ({
      ...article,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const articleResult = await db.collection("articles").insertMany(articlesWithDates)
    console.log(`Successfully inserted ${articleResult.insertedCount} articles`)

    // Create indexes for better performance
    console.log("Creating indexes...")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("articles").createIndex({ title: "text", content: "text", category: "text" })
    await db.collection("articles").createIndex({ category: 1 })
    await db.collection("articles").createIndex({ featured: 1 })
    await db.collection("articles").createIndex({ createdAt: -1 })
    await db.collection("contacts").createIndex({ createdAt: -1 })
    await db.collection("contacts").createIndex({ status: 1 })

    console.log("Database seeding completed successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin: admin@afyahub.co.ke / admin123")
    console.log("User: john@example.com / user123")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

// Run the seeding function
seedDatabase()
