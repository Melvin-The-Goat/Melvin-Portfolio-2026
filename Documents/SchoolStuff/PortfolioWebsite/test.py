import React, { useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Filter } from 'lucide-react';

// ProjectCard Component
const ProjectCard = ({ title, description, techStack, category, codeLink, featured }) => {
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 ${featured ? 'ring-2 ring-cyan-500' : ''}`}>
      <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-6xl opacity-20">{category === 'Game Dev' ? '🎮' : '💻'}</div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {codeLink && (
            <a href={codeLink} target="_blank" rel="noopener noreferrer" 
               className="text-cyan-400 hover:text-cyan-300 transition-colors">
              <Code2 size={20} />
            </a>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-gray-900 text-cyan-400 text-xs rounded-full border border-gray-700">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ArtCard Component
const ArtCard = ({ title, type, image }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="h-64 bg-gradient-to-br from-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-7xl opacity-30">{type === '3D Model' ? '🎨' : '✏️'}</div>
      </div>
      <div className="p-4">
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-500 text-xs mt-1">{type}</p>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('home');

  const projects = [
    {
      title: "A New Adventure",
      description: "Open-world MMORPG foundation on ROBLOX utilizing Lua & Blender. Created team structure, project scheduling, and developed User Interface, 3D models, and core programming systems.",
      techStack: ["Lua", "Roblox Studio", "Blender"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "#",
      featured: true
    },
    {
      title: "Monster Battle",
      description: "2D Pokemon-inspired game with full battle system, healing centers, and item management. Implemented comprehensive UML design with multiple interconnected classes.",
      techStack: ["Java", "GitHub", "Lucid"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "#"
    },
    {
      title: "Summoner Simulator",
      description: "Team-based 2D game featuring trainer battles, badge collection system, and strategic monster combat. Built with object-oriented design principles.",
      techStack: ["Java", "Paint.net", "AI Assets"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "#"
    },
    {
      title: "A Hero's Journey",
      description: "Latest iteration of Pokemon-style game with enhanced graphics, improved battle mechanics, and expanded world exploration features.",
      techStack: ["Java", "GitHub", "MindView"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "#"
    },
    {
      title: "Text-Based Bank System",
      description: "Object-oriented banking application with customer management, account creation (Savings/Checking), and transaction processing. Features unique account numbering and bonus system.",
      techStack: ["C++", "Replit"],
      category: "Software",
      engine: "C++",
      codeLink: "#"
    },
    {
      title: "Renewable Energy Optimization",
      description: "MATLAB-based optimization model analyzing renewable energy portfolios. Minimizes carbon emissions while meeting electricity demands through advanced algorithms.",
      techStack: ["MATLAB", "Research"],
      category: "Software",
      engine: "MATLAB",
      codeLink: "#"
    }
  ];

  const artworks = [
    { title: "Character Models", type: "3D Model" },
    { title: "Environment Assets", type: "3D Model" },
    { title: "Game UI Concepts", type: "Concept Art" },
    { title: "Low-Poly Props", type: "3D Model" },
    { title: "Lighting Studies", type: "Concept Art" },
    { title: "Outdoor Objects", type: "3D Model" }
  ];

  const filterOptions = ['All', 'Game Dev', 'Software', 'Roblox', 'Java', 'C++'];

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Game Dev' || activeFilter === 'Software') return project.category === activeFilter;
    return project.engine === activeFilter;
  });

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            MB
          </div>
          <div className="flex gap-8">
            {['Projects', 'Art', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                {item}
              </button>
            ))}
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Resume
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Melvin Boateng
            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 font-light">
              Game Developer & Technical Artist
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              MS Computer Science Student at University of the Pacific | Building immersive experiences with Lua, Java, and C++
            </p>
            <div className="pt-6">
              <button 
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                View Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-400">Game development, software engineering, and research projects</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Art Gallery */}
      <section id="art" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Art & Assets</h2>
            <p className="text-gray-400">3D models and concept art created with Blender and Paint.net</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art, i) => (
              <ArtCard key={i} {...art} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              I'm a Master's student in Computer Science at the University of the Pacific with a passion for creating 
              immersive game experiences and solving complex technical challenges. My work spans game development 
              on platforms like ROBLOX to optimization models for renewable energy research.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-cyan-400 font-semibold mb-3 text-lg">Education</h3>
                <p className="text-gray-400">MS Computer Science (Expected 2027)</p>
                <p className="text-gray-400">BS Computer Science - 3.85 GPA</p>
                <p className="text-gray-400">Minor in Media X</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-3 text-lg">Interests</h3>
                <p className="text-gray-400">Game Development</p>
                <p className="text-gray-400">3D Modeling & Animation</p>
                <p className="text-gray-400">Optimization & Algorithms</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Technical Toolkit</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {['Lua', 'Java', 'C++', 'MATLAB'].map((lang) => (
                    <span key={lang} className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-purple-400 font-semibold mb-3">Game Engines & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {['Roblox Studio', 'GitHub', 'Blender', 'Paint.net'].map((tool) => (
                    <span key={tool} className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-pink-400 font-semibold mb-3">Design & Planning</h4>
                <div className="flex flex-wrap gap-2">
                  {['Lucid (UML)', 'MindView', 'Adobe Firefly', 'Project Management'].map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Interested in collaborating or want to learn more about my work?
          </p>
          <div className="flex justify-center gap-6">
            <a href="mailto:m_boateng@u.pacific.edu" 
               className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-cyan-500 rounded-lg transition-colors border border-gray-700">
              <Mail size={20} />
              Email
            </a>
            <a href="#" 
               className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-purple-500 rounded-lg transition-colors border border-gray-700">
              <Github size={20} />
              GitHub
            </a>
            <a href="#" 
               className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-blue-500 rounded-lg transition-colors border border-gray-700">
              <Linkedin size={20} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500">
        <p>© 2026 Melvin Boateng. Built with React & Tailwind CSS.</p>
        <p className="text-sm mt-2">Stockton, California | 209-292-7814</p>
      </footer>
    </div>
  );
}