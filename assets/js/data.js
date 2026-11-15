// Initial Portfolio & Default Blog Data
const PortfolioData = {
  profile: {
    name: "Shahinur Rahman Khan",
    title: "Software Developer & Entrepreneur",
    bio: "Passionate software engineer and tech entrepreneur specializing in full-stack architecture, scalable cloud systems, and building innovative digital ventures from concept to market.",
    location: "Dhaka, Bangladesh (Open for Global Remote)",
    email: "srkhancucse@gmail.com",
    phone: "+880 1903 516116",
    experienceYears: "5+",
    completedProjects: "25+",
    happyClients: "15+",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me/8801903516116"
    }
  },

  skills: [
    // Frontend
    { name: "React.js & Next.js", category: "frontend", level: 92, icon: "code" },
    { name: "TypeScript / JavaScript", category: "frontend", level: 95, icon: "code" },
    { name: "Tailwind CSS & Modern UI", category: "frontend", level: 90, icon: "sparkles" },
    { name: "HTML5 / CSS3 / Animations", category: "frontend", level: 95, icon: "layers" },

    // Backend & Database
    { name: "Node.js & Express", category: "backend", level: 90, icon: "cpu" },
    { name: "Python & FastAPI / Django", category: "backend", level: 85, icon: "cpu" },
    { name: "PostgreSQL & Prisma / Supabase", category: "backend", level: 88, icon: "database" },
    { name: "MongoDB & Redis Caching", category: "backend", level: 86, icon: "database" },
    { name: "RESTful & GraphQL APIs", category: "backend", level: 92, icon: "cpu" },

    // DevOps & Cloud
    { name: "Docker & Containerization", category: "devops", level: 82, icon: "layers" },
    { name: "Git, GitHub Actions & CI/CD", category: "devops", level: 90, icon: "rocket" },
    { name: "AWS & Vercel Cloud Hosting", category: "devops", level: 84, icon: "rocket" },
    { name: "Linux Server Administration", category: "devops", level: 80, icon: "cpu" },

    // Entrepreneurship
    { name: "Product Strategy & MVP", category: "business", level: 94, icon: "briefcase" },
    { name: "Tech Startup Building", category: "business", level: 90, icon: "rocket" },
    { name: "System Architecture Design", category: "business", level: 92, icon: "layers" },
    { name: "Agile Team & Project Delivery", category: "business", level: 88, icon: "briefcase" }
  ],

  projects: [
    {
      id: "proj-1",
      title: "OmniSaaS - Multi-tenant Cloud Platform",
      category: "software",
      categoryName: "Software Product",
      summary: "A production-grade multi-tenant B2B SaaS platform featuring role-based access control, billing automation, and real-time operational analytics.",
      technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Stripe API"],
      featured: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: "proj-2",
      title: "CommerceFlow - Scalable E-Commerce Engine",
      category: "ventures",
      categoryName: "Entrepreneurial Venture",
      summary: "High-performance headless e-commerce store with real-time stock sync, bKash & card payment gateway integration, and automated invoice delivery.",
      technologies: ["React", "Express.js", "MongoDB", "Redis", "Tailwind CSS"],
      featured: true,
      image: "https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: "proj-3",
      title: "DevSprint - Agile Task & Sprint Orchestrator",
      category: "software",
      categoryName: "Software Product",
      summary: "Kanban and sprint planning application built for fast-moving remote development teams, featuring real-time WebSocket updates and GitHub sync.",
      technologies: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Socket.io"],
      featured: true,
      image: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: "proj-4",
      title: "FinPulse - Automated Financial Dashboard",
      category: "client",
      categoryName: "Client Solution",
      summary: "Enterprise financial visualization portal handling multi-currency reconciliations, automated tax calculations, and exportable executive reports.",
      technologies: ["Python", "FastAPI", "React", "Chart.js", "PostgreSQL"],
      featured: false,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    }
  ],

  experiences: [
    {
      role: "Founder & Lead Software Architect",
      company: "Tech Venture Studio",
      period: "2023 - Present",
      description: "Leading tech product direction, architecting scalable cloud software, mentoring developer teams, and launching client-ready MVPs."
    },
    {
      role: "Senior Full Stack Software Engineer",
      company: "Digital Solutions Inc.",
      period: "2021 - 2023",
      description: "Engineered scalable REST & GraphQL microservices, boosted web application performance by 40%, and collaborated with cross-functional global teams."
    },
    {
      role: "Full Stack Developer",
      company: "Innovate Labs",
      period: "2019 - 2021",
      description: "Developed user-facing SPAs with React, integrated payment gateways, and created automated CI/CD deployment pipelines."
    }
  ],

  defaultBlogs: [
    {
      id: "blog-1",
      title: "সফটওয়্যার ডেভেলপার থেকে সফল উদ্যোক্তা: আমার শেখা ৫টি মূল শিক্ষা",
      category: "Entrepreneurship",
      tags: ["Entrepreneurship", "Startup", "Mindset"],
      date: "নভেম্বর ০৫, ২০২৬",
      readTime: "৫ মিনিট পাঠ",
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      summary: "শুধু কোড লিখলেই স্টার্টআপ সফল হয় না। একজন সফটওয়্যার ইঞ্জিনিয়ার হিসেবে কিভাবে ব্যবসায়িক দৃষ্টিভঙ্গি গড়ে তুলতে হয় এবং সঠিক প্রোডাক্ট তৈরি করতে হয়, তার বিস্তারিত আলোচনা।",
      content: `## সূচনা: কোডিং থেকে বিজনেসে রূপান্তর

একজন সফটওয়্যার ডেভেলপার হিসেবে আমরা সাধারণত ক্লিন কোড, পারফরম্যান্স, এবং আধুনিক ফ্রেমওয়ার্ক নিয়ে বেশি চিন্তা করি। কিন্তু যখন আপনি একজন উদ্যোক্তা (Entrepreneur) হতে যাবেন, তখন সবচেয়ে গুরুত্বপূর্ণ হয়ে দাঁড়ায়: **"আমার তৈরি প্রোডাক্ট মানুষের কোন সমস্যার সমাধান করছে এবং তারা এর জন্য পে করতে রাজি কি না?"**

---

### ১. নিখুঁত কোডের চেয়ে 'কাজের প্রোডাক্ট' আগে দরকার (MVP First)
শুরুতেই পারফেক্ট আর্কিটেকচার বানাতে গিয়ে অনেক ডেভেলপার মাসকে মাস পার করে দেন। কিন্তু স্টার্টআপে সবচেয়ে জরুরি হলো **Minimum Viable Product (MVP)** যত দ্রুত সম্ভব গ্রাহকের হাতে তুলে দেওয়া। 
- গ্রাহক কী চায় জানুন।
- ফিডব্যাক নিয়ে দ্রুত ইম্প্রুভ করুন।

---

### ২. ইউজার ফিডব্যাকই আসল কম্পাস
গ্রাহকের সাথে কথা না বলে শুধু নিজের কল্পনায় ফিচার যোগ করলে প্রোডাক্ট ব্যর্থ হতে বাধ্য। ব্যবহারকারীদের সমস্যা শুনুন এবং ডাটা দেখে সিদ্ধান্ত নিন।

---

### ৩. কোডিং একা কোনো বিজনেস তৈরি করে না
একটি সফটওয়্যার কোম্পানি চালাতে দরকার:
- মার্কেটিং ও সেলস
- গ্রাহক সেবা (Customer Support)
- ফিন্যান্সিয়াল ম্যানেজমেন্ট

> "Great code with zero distribution equals zero revenue. Distribution and user empathy are everything."

---

### উপসংহার
ডেভেলপমেন্ট স্কিল আপনার সবচেয়ে বড় শক্তি। এর সাথে উদ্যোক্তা সুলভ মননশীলতা যুক্ত করতে পারলে আপনি যেকোনো স্বপ্নকে সফল প্রডাক্টে রূপান্তর করতে পারবেন।`
    },
    {
      id: "blog-2",
      title: "Building Scalable Modern Web Applications in 2026",
      category: "Tech",
      tags: ["Architecture", "Next.js", "FullStack", "Performance"],
      date: "অক্টোবর ২৮, ২০২৬",
      readTime: "৭ মিনিট পাঠ",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      summary: "Architecting high-scale web platforms using Next.js Server Components, Edge caching, and resilient database access patterns.",
      content: `## Modern Web Architecture Overview

Building web platforms today demands both speed and maintainability. In this post, we explore architectural patterns that help startups scale from zero to millions of requests without rewriting everything.

---

### 1. Edge-First Rendering and Caching
Leveraging CDN edge runtimes drastically reduces Time to First Byte (TTFB). By combining static pre-rendering (SSG) with on-demand incremental cache revalidation (ISR), we get instantaneous page loads while preserving real-time data freshness.

\`\`\`typescript
// Example: On-demand cache revalidation in Next.js
export async function revalidateProduct(id: string) {
  await revalidateTag(\`product-\${id}\`);
  return { revalidated: true, timestamp: Date.now() };
}
\`\`\`

---

### 2. Database Connection Pooling & Serverless Safety
Serverless functions can quickly exhaust database connections. Using connection poolers like Prisma Accelerate, PgBouncer, or Supabase connection pooling prevents cold-boot bottlenecks.

---

### 3. Key Takeaways
- Decouple your business logic from UI components.
- Choose type-safety across the entire stack (TypeScript + Zod + Prisma).
- Monitor Core Web Vitals continually.`
    },
    {
      id: "blog-3",
      title: "কেন প্রতিটি সফটওয়্যার ডেভেলপারের নিজের পার্সোনাল ব্র্যান্ড ও ব্লগ থাকা উচিত",
      category: "Career",
      tags: ["Career", "Blogging", "Branding"],
      date: "অক্টোবর ১৫, ২০২৬",
      readTime: "৪ মিনিট পাঠ",
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
      summary: "আপনার জ্ঞান অন্যের সাথে ভাগ করে নেওয়ার মাধ্যমে কিভাবে নতুন ক্লায়েন্ট, ইনভেস্টর এবং শীর্ষস্থানীয় জবের সুযোগ তৈরি হতে পারে।",
      content: `## নিজের ব্র্যান্ড কেন জরুরি?

রেজুমে বা সিভিতে আপনি যা লেখেন, তার চেয়ে অনেক বেশি বিশ্বাসযোগ্য হলো একটি সক্রিয় পোর্টফোলিও এবং সেখানে প্রকাশিত প্রযুক্তিগত ব্লগ।

### ব্লগের ৩টি প্রধান সুবিধা:
1. **শেখার গভীরতা বাড়ে:** যখন আপনি কোনো বিষয় কাউকে বোঝানোর জন্য লেখেন, তখন নিজের কনসেপ্ট ক্রিস্টাল ক্লিয়ার হয়ে যায়।
2. **ইনবাউন্ড অপরচুনিটি:** কোম্পানি বা ক্লায়েন্টরা যখন আপনার ব্লগ এবং সমস্যা সমাধানের কৌশল দেখে, তখন তারা সরাসরি আপনাকে হায়ার করার প্রস্তাব দেয়।
3. **কমিউনিটিতে গ্রহণযোগ্যতা:** ডেভেলপার ও উদ্যোক্তা কমিউনিটিতে আপনি একজন চিন্তাশীল প্রফেশনাল হিসেবে পরিচিতি পান।

> "Don't just write code in private; share your learnings in public. The internet rewards builders who teach."`
    }
  ]
};

