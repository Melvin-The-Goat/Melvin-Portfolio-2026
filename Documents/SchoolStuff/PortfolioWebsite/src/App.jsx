import { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ArtCard from './components/ArtCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import ArtDetailModal from './components/ArtDetailModal'; 

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  // NEW: State for tracking which artwork is clicked
  const [selectedArt, setSelectedArt] = useState(null);

  const projects = [
    {
      title: "A New Journey",
      description: "Open-world MMORPG foundation on ROBLOX utilizing Lua & Blender. Created team structure, project scheduling, and developed User Interface, 3D models, and core programming systems.",
      techStack: ["Lua", "Roblox Studio", "Blender"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/10297207559/A-New-Journey-Stage-1",
      featured: true,
      image: "/ANewJourneyTHUMBNAIL.png"
    },
    {
      title: "Monster Battle",
      description: "2D Pokemon-inspired game with full battle system, healing centers, and item management. Implemented comprehensive UML design with multiple interconnected classes.",
      techStack: ["Java", "GitHub", "Lucid"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "#",
      image: "/monsterBattleThumbnail.png"
    },
    {
      title: "Summoner Simulator",
      description: "Team-based 2D game featuring trainer battles, badge collection system, and strategic monster combat. Built with object-oriented design principles.",
      techStack: ["Lua", "Roblox Studio", "Blender","Paint.net", "AI Assets"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/134601304563656/Summoner-Sim-Test-Place",
      image: "/summonerSimThumbnail.png"
    },
    {
      title: "A Hero Knight's Journey",
      description: "Latest iteration of Pokemon-style game with enhanced graphics, improved battle mechanics, and expanded world exploration features.",
      techStack: ["C#", "Unity", "GitHub"],
      category: "Game Dev",
      engine: "Unity",
      codeLink: "https://github.com/Melvin-The-Goat/A-Hero-Knight-s-Journey",
      image: "/AHeroKnightsJourneyThumbnail.png"
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
    },
    {
      title: "Dungeon Supremacy",
      description: "Dungeon crawler game built with Godot engine featuring strategic combat and exploration mechanics.",
      techStack: ["GDScript", "Godot", "GitHub"],
      category: "Game Dev",
      engine: "Godot",
      codeLink: "https://github.com/Melvin-The-Goat/DungeonSupremacy",
      video: "/2026-01-12%2022-29-03.mkv",
      image: "/dungeonSupremacyThumbnail.png",
      technicalHighlights: ["Godot", "GDScript", "Procedural Chest Spawning", "Sound Integration"]
    }
  ];

  const artworks = [
    { 
      title: "Character Models", 
      type: "3D Model", 
      modelPath: "/models/knightInProg4WellModtests25.glb", 
      description: "A knight model in progress featuring modular armor design.", 
      technicalDetails: ["Blender", "GLTF", "3D Model"] 
    },
    { 
      title: "Character Models", 
      type: "3D Model", 
      modelPath: "/models/SimpleSlime2.glb", 
      description: "A simple slime model in progress featuring a modular slime body.", 
      technicalDetails: ["Blender", "GLTF", "3D Model"] 
    }
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
            <a 
              href="\Resume as of Jan 2026.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
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
              <ProjectCard 
                key={i} 
                {...project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Art Gallery (UPDATED) */}
      <section id="art" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Art & Assets</h2>
            <p className="text-gray-400">Interactive 3D models and concept art • Click to explore</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art, i) => (
              <ArtCard 
                key={i} 
                {...art} 
                onClick={() => setSelectedArt(art)} 
              />
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

      {/* MODALS */}
      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* NEW: Art Detail Modal */}
      {selectedArt && (
        <ArtDetailModal 
          artwork={selectedArt} 
          onClose={() => setSelectedArt(null)} 
        />
      )}
    </div>
  );
}

export default App;