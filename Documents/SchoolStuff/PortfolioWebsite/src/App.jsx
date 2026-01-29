import { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
// Add curly braces { } to match the named export
import { ArtCarousel } from './components/ArtCarousel';
import ProjectDetailModal from './components/ProjectDetailModal';

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

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
      modelPath: "/models/SimpleSlime2.glb", 
      description: "A simple slime model in progress featuring a modular slime body and subsurface scattering effects.", 
      technicalDetails: ["Blender", "GLTF", "3D Model"] 
    },
    { 
      title: "Knight Armor", 
      type: "3D Model", 
      modelPath: "/models/knightInProg4WellModtests25.glb", 
      description: "A knight model in progress featuring modular armor design optimized for game engines.", 
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
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden selection:bg-[#EC4899] selection:text-white">
      {/* 1. Global AI Backgrounds */}
      <div className="ai-bg" />
      <div className="scanlines" />

      {/* 2. Persona Slanted Navbar */}
      <nav className="fixed top-0 w-full z-50 p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative pointer-events-auto">
          {/* Logo */}
          <div className="bg-[#0EA5E9] -skew-x-12 px-6 py-2 border-r-4 border-[#EC4899] shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:translate-x-1 transition-transform cursor-pointer">
            <span className="text-2xl font-black italic skew-x-12 block text-white">MB.AI</span>
          </div>
          {/* Menu */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 -skew-x-12 p-1">
            {['Projects', 'Art', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="px-4 md:px-6 py-2 text-gray-300 hover:bg-[#0EA5E9] hover:text-white transition-all duration-200 font-bold uppercase italic skew-x-12 text-sm md:text-base"
              >
                {item}
              </button>
            ))}
            <a 
              href="/Resume as of Jan 2026.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 md:px-6 py-2 text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-200 font-bold uppercase italic skew-x-12 text-sm md:text-base"
            >
              Resume
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 px-6 text-center relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
            Melvin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#EC4899] decoration-[#EC4899] underline-offset-8">Boateng</span>
          </h1>
          <p className="font-mono text-[#0EA5E9] uppercase tracking-[0.2em] text-sm md:text-lg mb-8">
            MSCS • AI Concentration • Technical Artist
          </p>
          <div className="inline-block bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm max-w-2xl">
            <p className="text-gray-300 text-lg">
               Building immersive experiences with Lua, Java, and C++ at the University of the Pacific.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex items-center gap-4">
             <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-[#0EA5E9] opacity-50"></div>
             <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Featured Projects</h2>
             <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-[#0EA5E9] opacity-50"></div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-mono text-sm uppercase tracking-wider border transition-all skew-x-[-12deg] ${
                  activeFilter === filter
                    ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white shadow-[4px_4px_0px_0px_#000]'
                    : 'bg-black/50 border-gray-700 text-gray-400 hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
                }`}
              >
                <div className="skew-x-[12deg]">{filter}</div>
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

      {/* Art Section (Now uses Carousel) */}
      <section id="art" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
             <div className="inline-block bg-[#0EA5E9] -skew-x-12 px-8 py-2">
                <h2 className="text-3xl font-black italic uppercase text-white skew-x-12">Interactive 3D Lab</h2>
             </div>
             <p className="mt-4 text-gray-500 font-mono text-sm">DRAG TO ROTATE • SCROLL TO ZOOM</p>
          </div>
          
          {/* THE NEW CAROUSEL */}
          <ArtCarousel artworks={artworks} />
          
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-gray-900/80 border border-white/10 p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#EC4899]/20 -rotate-45 transform translate-x-10 -translate-y-10"></div>
          
          <h2 className="text-4xl font-black italic uppercase mb-8 text-[#0EA5E9]">System Info</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
               <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                I'm a Master's student in Computer Science at the University of the Pacific. My work merges technical engineering with creative artistry, spanning from ROBLOX game dev to renewable energy optimization.
              </p>
              <div className="space-y-2">
                <h3 className="text-white font-bold uppercase tracking-wider border-b border-gray-700 pb-2 mb-4">Education</h3>
                <p className="text-gray-400 font-mono text-sm">MS Computer Science (Expected 2027)</p>
                <p className="text-gray-400 font-mono text-sm">BS Computer Science - 3.85 GPA</p>
                <p className="text-gray-400 font-mono text-sm">Minor in Media X</p>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <h3 className="text-white font-bold uppercase tracking-wider border-b border-gray-700 pb-2 mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Lua', 'Java', 'C++', 'MATLAB', 'Python'].map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 font-mono text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
               </div>
               <div>
                  <h3 className="text-white font-bold uppercase tracking-wider border-b border-gray-700 pb-2 mb-4">Engines</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Roblox Studio', 'Unity', 'Godot', 'Blender'].map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/30 font-mono text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-600 font-mono text-xs relative z-10">
        <p>© 2026 MELVIN BOATENG. SYSTEM ONLINE.</p>
        <p className="mt-2 opacity-50">Stockton, CA | 209-292-7814</p>
      </footer>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}

export default App;