import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ProjectCard from './components/ProjectCard';
import { ArtCarousel } from './components/ArtCarousel';
import MusicPlayer from './components/MusicPlayer';
import ProjectDetailModal from './components/ProjectDetailModal';
import { Power } from 'lucide-react'; 

// Integrated high-intensity effects
import { 
  FloatingParticles, 
  CustomCursor, 
  LocalGlitch,
  EnhancedGlitchEffect,
  AmbientGlitch
} from './components/effects';

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCyberMode, setIsCyberMode] = useState(false); 
  
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState('medium');

  const triggerGlitch = (intensity = 'medium') => {
    if (!isCyberMode) return; 
    setGlitchIntensity(intensity);
    setShowGlitch(true);
  };

  const toggleSystem = () => {
    if (!isCyberMode) {
      setIsLoading(true); 
      setTimeout(() => {
        setIsLoading(false);
        setIsCyberMode(true);
      }, 4500);
    } else {
      triggerGlitch('high'); 
      setTimeout(() => setIsCyberMode(false), 500);
    }
  };

  const projects = [
    {
      title: "A New Journey",
      description: "Open-world MMORPG foundation on ROBLOX utilizing Lua & Blender. Created team structure, project scheduling, and developed systems.",
      techStack: ["Lua", "Roblox Studio", "Blender"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/10297207559/A-New-Journey-Stage-1",
      featured: true,
      image: "/ANewJourneyTHUMBNAIL.png"
    },
    {
      title: "Monster Battle",
      description: "2D Pokemon-inspired game with full battle system, healing centers, and item management. Implemented comprehensive UML design.",
      techStack: ["Java", "GitHub", "Lucid"],
      category: "Game Dev",
      engine: "Java",
      codeLink: "https://github.com/Melvin-The-Goat/Monster-Battle",
      image: "/monsterBattleThumbnail.png", 
      gallery: [
        "/monsterbattleimage1.png", "/monsterbattleimage2.png", "/monsterbattleimage3.png",
        "/monsterbattleimage4.png", "/monsterbattleimage5.png", "/monsterbattleimage6.png", "/monsterbattleimage7.png"
      ]
    },
    {
      title: "Summoner Simulator",
      description: "Team-based 2D game featuring trainer battles, badge collection system, and strategic monster combat.",
      techStack: ["Lua", "Roblox Studio", "Blender","Paint.net", "AI Assets"],
      category: "Game Dev",
      engine: "Roblox",
      codeLink: "https://www.roblox.com/games/134601304563656/Summoner-Sim-Test-Place",
      image: "/summonerSimThumbnail.png"
    },
    {
      title: "A Hero Knight's Journey",
      description: "Latest iteration of Pokemon-style game with enhanced graphics, improved battle mechanics, and expanded world exploration.",
      techStack: ["C#", "Unity", "GitHub"],
      category: "Game Dev",
      engine: "Unity",
      codeLink: "https://github.com/Melvin-The-Goat/A-Hero-Knight-s-Journey",
      image: "/AHeroKnightsJourneyThumbnail.png"
    },
    {
      title: "Text-Based Bank System",
      description: "Object-oriented banking application with customer management, account creation, and transaction processing.",
      techStack: ["C++", "Replit"],
      category: "Software",
      engine: "C++",
      image: "/BankThumbnail.png",
      codeLink: "https://replit.com/@mboateng/Bank05"
    },
    {
      title: "Renewable Energy Optimization",
      description: "MATLAB-based optimization model analyzing renewable energy portfolios through advanced algorithms.",
      techStack: ["MATLAB", "Research"],
      category: "Software",
      engine: "MATLAB",
      image: "/energyPortfolio.png", 
      codeLink: "https://energyoptimization.onrender.com/"
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
    { title: "Knight Armor", type: "3D Model", modelPath: "/models/knightInProg4WellModtests25.glb", description: "Modular armor design.", technicalDetails: ["Blender", "GLTF"] },
    { title: "Anglerfish", type: "3D Model", modelPath: "/models/anglerFish3RIGFinal.glb", description: "Deep-sea predator featuring rigged emissive lighting.", technicalDetails: ["Blender", "GLTF"] },
    { title: "Spider", type: "3D Model", modelPath: "/models/spiderBone&Weights.glb", description: "Intricate procedurally moving spider", technicalDetails: ["Blender", "GLTF"] },
    { title: "stingRay", type: "3D Model", modelPath: "/models/stingRay3FlatV2Rig1.glb", description: "Simple stingray", technicalDetails: ["Blender", "GLTF"] },
    { title: "Slime", type: "3D Model", modelPath: "/models/SimpleSlime2.glb", description: "Modular slime body.", technicalDetails: ["Blender", "GLTF"] },
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
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className="min-h-screen text-white overflow-x-hidden selection:bg-[#EC4899] selection:text-white bg-[#050505]">
        
        <div className="ai-bg" />
        <div className="scanlines" />

        {isCyberMode && (
          <>
            <FloatingParticles count={50} color="cyan" />
            <AmbientGlitch enabled={true} frequency="medium" />
            <CustomCursor />
            <EnhancedGlitchEffect isActive={showGlitch} intensity={glitchIntensity} onComplete={() => setShowGlitch(false)} />
          </>
        )}

        <nav className="fixed top-0 w-full z-50 p-4 md:p-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-center relative pointer-events-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSystem}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${isCyberMode ? 'bg-[#0EA5E9] shadow-[0_0_15px_rgba(14,165,233,0.5)] -skew-x-12' : 'bg-gray-800 border border-cyan-500/30 text-cyan-400 hover:bg-gray-700'}`}
              >
                <Power size={14} className={isCyberMode ? 'animate-pulse' : ''} />
                {isCyberMode ? 'SYSTEM ONLINE' : 'INITIALIZE SYSTEM'}
              </button>
              <div className="bg-[#0EA5E9] -skew-x-12 px-6 py-2 border-r-4 border-[#EC4899] shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:translate-x-1 transition-transform cursor-pointer">
                <span className="text-2xl font-black italic skew-x-12 block text-white">MB.AI</span>
              </div>
            </div>
            
            <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 -skew-x-12 p-1">
              {['Projects', 'Art', 'About'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="px-4 md:px-6 py-2 text-gray-300 hover:bg-[#0EA5E9] hover:text-white transition-all duration-200 font-bold uppercase italic skew-x-12 text-sm md:text-base">
                  {item}
                </button>
              ))}
              <a href="/Resume as of Jan 2026.pdf" target="_blank" className="px-4 md:px-6 py-2 text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-200 font-bold uppercase italic skew-x-12 text-sm md:text-base">
                Resume
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section - UPDATED FORMAT */}
        <section id="home" className="pt-40 pb-20 px-6 text-center relative z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              {/* LocalGlitch is nested directly inside H1 to preserve text selection flow */}
              <LocalGlitch enabled={isCyberMode}>Melvin</LocalGlitch> 
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#EC4899] decoration-[#EC4899] underline-offset-8">
                Boateng
              </span>
            </h1>
            <p className="font-mono text-[#0EA5E9] uppercase tracking-[0.2em] text-sm md:text-lg mb-8">
              MSCS • AI Concentration • Technical Artist
            </p>
            <div className="inline-block bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm max-w-2xl">
              <p className="text-gray-300 text-lg leading-relaxed">
                 Building immersive experiences with Lua, Java, and C++ at the University of the Pacific.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex items-center gap-4">
               <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-[#0EA5E9] opacity-50"></div>
               <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Featured Projects</h2>
               <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-[#0EA5E9] opacity-50"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 font-mono text-sm uppercase tracking-wider border transition-all skew-x-[-12deg] ${
                    activeFilter === filter ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white shadow-[4px_4px_0px_0px_#000]' : 'bg-black/50 border-gray-700 text-gray-400 hover:border-[#0EA5E9]'
                  }`}
                >
                  <div className="skew-x-[12deg]">{filter}</div>
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={i} {...project} isCyberMode={isCyberMode} onTriggerGlitch={triggerGlitch} onClick={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </section>

        <section id="art" className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
             <div className="inline-block bg-[#0EA5E9] -skew-x-12 px-8 py-2 mb-8">
                <h2 className="text-3xl font-black italic uppercase text-white skew-x-12">Interactive 3D Lab</h2>
             </div>
             <p className="mb-4 text-gray-500 font-mono text-sm uppercase">Drag to Rotate • Scroll to Zoom</p>
             <ArtCarousel artworks={artworks} />
          </div>
        </section>

        <section id="about" className="py-20 px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-gray-900/60 border border-white/10 p-8 md:p-12 backdrop-blur-md relative overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EC4899]/20 to-transparent -rotate-45 transform translate-x-16 -translate-y-16"></div>
            <h2 className="text-5xl font-black italic uppercase mb-12 text-[#0EA5E9] tracking-tighter drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]">System Info</h2>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              <div className="space-y-10 text-gray-300">
                <p className="text-lg leading-relaxed">Master's student at UOP merging technical engineering with creative artistry, spanning from ROBLOX to renewable energy optimization.</p>
                <div className="space-y-4">
                  <h3 className="text-white font-black italic uppercase text-sm tracking-[0.2em] border-b border-white/10 pb-2">Education</h3>
                  <div className="font-mono text-sm text-gray-400">
                    <p>MS Computer Science <span className="text-[#0EA5E9]">(Expected 2027)</span></p>
                    <p>BS Computer Science — 3.85 GPA</p>
                    <p>Minor in Media X</p>
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div>
                  <h3 className="text-white font-black italic uppercase text-sm tracking-[0.2em] border-b border-white/10 pb-2 mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Lua', 'Java', 'C++', 'MATLAB', 'Python'].map(lang => (
                      <span key={lang} className="px-3 py-1 bg-black/40 text-[#0EA5E9] border border-[#0EA5E9]/30 font-mono text-xs hover:bg-[#0EA5E9]/10 transition-colors">{lang}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-black italic uppercase text-sm tracking-[0.2em] border-b border-white/10 pb-2 mb-4">Engines</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Roblox Studio', 'Unity', 'Godot', 'Blender'].map(engine => (
                      <span key={engine} className="px-3 py-1 bg-black/40 text-[#EC4899] border border-[#EC4899]/30 font-mono text-xs hover:bg-[#EC4899]/10 transition-colors">{engine}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-gray-800 text-center text-gray-600 font-mono text-xs z-10">
          <p>© 2026 MELVIN BOATENG. {isCyberMode ? 'SYSTEM ONLINE.' : 'VERSION 2.0'}</p>
          <p className="text-[10px] mt-2 italic uppercase">Stockton, California | 209-292-7814</p>
        </footer>

        {isCyberMode && <MusicPlayer onTrackChange={() => triggerGlitch('high')} />}
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </div>
    </>
  );
}

export default App;