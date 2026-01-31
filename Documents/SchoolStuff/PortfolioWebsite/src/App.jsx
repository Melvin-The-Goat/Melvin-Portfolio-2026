import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ProjectCard from './components/ProjectCard';
import { ArtCarousel } from './components/ArtCarousel';
import MusicPlayer from './components/MusicPlayer';
import ProjectDetailModal from './components/ProjectDetailModal';

// 1. Importing the integrated effects system
import { 
  FloatingParticles, 
  CustomCursor, 
  GlitchEffect, 
  LocalGlitch 
} from './components/effects';

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Glitch state for handling different intensities
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchMode, setGlitchMode] = useState('standard');

  const projects = [
    {
      title: "A New Journey",
      description: "Open-world MMORPG foundation on ROBLOX utilizing Lua & Blender. Created team structure and core programming systems.",
      techStack: ["Lua", "Roblox Studio", "Blender"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/10297207559/A-New-Journey-Stage-1",
      featured: true,
      image: "/ANewJourneyTHUMBNAIL.png"
    },
    {
      title: "Monster Battle",
      description: "2D Pokemon-inspired game with full battle system and item management. Implemented comprehensive UML design.",
      techStack: ["Java", "GitHub", "Lucid"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "#",
      image: "/monsterBattleThumbnail.png"
    },
    {
      title: "Summoner Simulator",
      description: "Team-based 2D game featuring trainer battles and badge collection system.",
      techStack: ["Lua", "Roblox Studio", "Blender", "AI Assets"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/134601304563656/Summoner-Sim-Test-Place",
      image: "/summonerSimThumbnail.png"
    },
    {
      title: "A Hero Knight's Journey",
      description: "Latest iteration of Pokemon-style game with enhanced graphics and expanded world exploration.",
      techStack: ["C#", "Unity", "GitHub"],
      category: "Game Dev",
      engine: "Unity",
      codeLink: "https://github.com/Melvin-The-Goat/A-Hero-Knight-s-Journey",
      image: "/AHeroKnightsJourneyThumbnail.png"
    },
    {
      title: "Dungeon Supremacy",
      description: "Dungeon crawler game built with Godot engine featuring strategic combat and procedural spawning.",
      techStack: ["GDScript", "Godot", "GitHub"],
      category: "Game Dev",
      engine: "Godot",
      codeLink: "https://github.com/Melvin-The-Goat/DungeonSupremacy",
      image: "/dungeonSupremacyThumbnail.png"
    }
  ];

  const artworks = [
    { 
      title: "Knight Armor", 
      type: "3D Model", 
      modelPath: "/models/knightInProg4WellModtests25.glb", 
      description: "Modular armor design optimized for game engines.", 
      technicalDetails: ["Blender", "GLTF"] 
    },
    { 
      title: "Slime", 
      type: "3D Model", 
      modelPath: "/models/SimpleSlime2.glb", 
      description: "Modular slime body with subsurface scattering.", 
      technicalDetails: ["Blender", "GLTF"] 
    },
    { 
      title: "Anglerfish", 
      type: "3D Model", 
      modelPath: "/models/anglerFish3RIGFinal.glb", 
      description: "A deep-sea predator model featuring rigged emissive lighting.", 
      technicalDetails: ["Blender", "GLTF"] 
    }
  ];

  const filterOptions = ['All', 'Game Dev', 'Software', 'Roblox', 'Java'];

  const triggerGlitch = (mode = 'standard') => {
    setGlitchMode(mode);
    setShowGlitch(true);
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Game Dev' || activeFilter === 'Software') return project.category === activeFilter;
    return project.engine === activeFilter;
  });

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <div className="min-h-screen text-white overflow-x-hidden selection:bg-[#EC4899] selection:text-white">
          
          {/* 3. Global Background Layers */}
          <FloatingParticles count={50} color="cyan" />
          <div className="ai-bg" />
          <div className="scanlines" />

          {/* 4. Slanted Navigation */}
          <nav className="fixed top-0 w-full z-50 p-4 md:p-6 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center relative pointer-events-auto">
              <div 
                className="bg-[#0EA5E9] -skew-x-12 px-6 py-2 border-r-4 border-[#EC4899] shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:translate-x-1 transition-transform cursor-pointer"
                onClick={() => triggerGlitch('standard')}
              >
                <span className="text-2xl font-black italic skew-x-12 block text-white">MB.AI</span>
              </div>
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
              </div>
            </div>
          </nav>

          {/* 5. Hero Section with Periodic Glitch */}
          <section id="home" className="pt-40 pb-20 px-6 text-center relative z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 text-white">
                <LocalGlitch>Melvin</LocalGlitch> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#EC4899]">Boateng</span>
              </h1>
              <p className="font-mono text-[#0EA5E9] uppercase tracking-[0.2em] text-sm md:text-lg mb-8">
                MSCS • AI Concentration • Technical Artist
              </p>
            </div>
          </section>

          {/* 6. Projects Section with Restored Centering & Accent Lines */}
          <section id="projects" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12 flex items-center gap-4">
                 <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-[#0EA5E9] opacity-50"></div>
                 <LocalGlitch>
                    <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                       Featured Projects
                    </h2>
                 </LocalGlitch>
                 <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-[#0EA5E9] opacity-50"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      triggerGlitch('standard');
                    }}
                    className={`px-6 py-2 font-mono text-sm uppercase tracking-wider border transition-all skew-x-[-12deg] ${
                      activeFilter === filter ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white shadow-[4px_4px_0px_0px_#000]' : 'bg-black/50 border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="skew-x-[12deg]">{filter}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={i} {...project} onClick={() => setSelectedProject(project)} />
                ))}
              </div>
            </div>
          </section>

          {/* 7. Interactive 3D Art Carousel */}
          <section id="art" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-block bg-[#0EA5E9] -skew-x-12 px-8 py-2 mb-8">
                <h2 className="text-3xl font-black italic uppercase text-white skew-x-12">Interactive 3D Lab</h2>
              </div>
              <ArtCarousel artworks={artworks} />
            </div>
          </section>

          {/* 8. Persistent UI & Modals */}
          <MusicPlayer onTrackChange={() => triggerGlitch('heavy')} />
          <CustomCursor />
          <GlitchEffect isActive={showGlitch} mode={glitchMode} onComplete={() => setShowGlitch(false)} />

          {selectedProject && (
            <ProjectDetailModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;