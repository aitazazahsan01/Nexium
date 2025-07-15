**Blog Summarizer AI 🚀**
A web application built with the Next.js App Router that scrapes content from a blog URL, generates a summary, translates it to Urdu, and showcases a modern, animated user interface. This project was created as an assignment for the Nexium Remote Internship.

**✨ Live Demo**
(https://code-aitazaz-blog-summarizer.vercel.app/)

**🌟 Key Features**
Blog Scraping: Extracts the main text content from any provided public blog post URL.

**AI-Simulated Summary:** Uses a frequency-based algorithm to generate an extractive summary of the article.

**Urdu Translation:** Translates the generated summary into Urdu using a third-party service.

**Dual Database Storage:**

Saves the English and Urdu summaries to a Supabase PostgreSQL database.

Saves the full scraped text to a MongoDB Atlas collection.

**Recent History:** Displays a list of the most recently summarized articles on the homepage.

**Modern UI/UX**: Built with ShadCN UI and Framer Motion for a sleek, animated, and responsive interface.

**🛠️ Tech Stack**
**Technology**

Description

Next.js 14

Full-Stack React Framework (App Router)

TypeScript

Static Typing for JavaScript

Tailwind CSS

Utility-First CSS Framework

ShadCN UI

Re-usable UI components

Framer Motion

Animation library for React

Supabase

PostgreSQL database for storing summaries

MongoDB

NoSQL database for storing full blog text

Vercel

Hosting and Serverless Deployment


**Export to Sheets**
🚀 Getting Started
Follow these instructions to set up and run the project locally on your machine.

Prerequisites
Node.js (v18 or later)

A free Supabase account

A free MongoDB Atlas account

npm or yarn package manager

**1. Clone the Repository**
Bash

git clone https://github.com/aitazazahsan01/Nexium.git
cd Nexium
**2. Install Dependencies**
Bash

npm install
**3. Set Up Environment Variables**
Create a new file named .env.local in the root of your project directory and add the following variables.

Code snippet

# Supabase - Get from Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# MongoDB - Get from Database > Connect > Drivers
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB_NAME=blog_data
Note: For the MONGODB_URI, make sure to replace <password> with your actual database user password.

**4. Set Up Databases**
Supabase
Go to your Supabase project dashboard.

Navigate to the SQL Editor.

Click New query and run the following script to create the summaries table:

SQL

CREATE TABLE summaries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  url TEXT NOT NULL,
  summary_en TEXT,
  summary_ur TEXT
);
MongoDB
No setup is required other than creating a free cluster on MongoDB Atlas. The database (blog_data) and collection (full_texts) will be created automatically when the first document is inserted.

Important: Ensure you have configured Network Access in MongoDB Atlas to allow connections from your local IP and from anywhere (0.0.0.0/0) for Vercel deployment.

**5. Run the Development Server**
Now you can start the local development server.

Bash

npm run dev
Open http://localhost:3000 in your browser to see the application running.

**🌐 Deployment
**This project is deployed on Vercel. Any push to the main branch on GitHub will automatically trigger a new deployment, ensuring continuous integration and delivery.

✍️ Author
**Muhammad Aitazaz Ahsan**

**GitHub: @aitazazahsan01**

**Project for: Nexium Remote Internship**



**Landing Page**
<img width="1322" height="608" alt="image" src="https://github.com/user-attachments/assets/b4eb3e10-4c47-4b20-b422-6d55db58d500" />
**Paste Bllog URL**
<img width="946" height="470" alt="image" src="https://github.com/user-attachments/assets/d3fee6db-32f2-4295-b48f-49c44cb53358" />
**Recently Summarized Blogs**
<img width="939" height="375" alt="image" src="https://github.com/user-attachments/assets/eceedf77-6796-4e44-921f-b90ec8ca16cf" />
