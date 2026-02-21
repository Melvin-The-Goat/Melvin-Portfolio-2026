import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { LocalGlitch } from './effects/LocalGlitch';

const ContactSection = ({ isCyberMode }) => {
  return (
    <section id="contact" className="py-20 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-[#EC4899] opacity-50"></div>
          <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            <LocalGlitch enabled={isCyberMode}>Connect</LocalGlitch>
          </h2>
          <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-[#EC4899] opacity-50"></div>
        </div>

        <div className="bg-gray-900/60 border border-white/10 p-8 md:p-12 backdrop-blur-md rounded-lg">
          <p className="text-gray-300 text-lg text-center mb-8 leading-relaxed">
            Interested in collaborating, discussing opportunities, or learning more about my work?
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="mailto:m_boateng@u.pacific.edu"
              className="group flex flex-col items-center gap-3 p-6 bg-black/40 border border-[#0EA5E9]/30 rounded-lg hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-[#0EA5E9]/20 rounded-full group-hover:bg-[#0EA5E9] transition-colors">
                <Mail size={24} className="text-[#0EA5E9] group-hover:text-white transition-colors" />
              </div>
              <span className="font-mono text-sm text-gray-400 group-hover:text-[#0EA5E9] transition-colors">Email</span>
              <span className="text-xs text-gray-500 text-center">m_boateng@u.pacific.edu</span>
            </a>

            <a
              href="https://github.com/Melvin-The-Goat"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 bg-black/40 border border-[#EC4899]/30 rounded-lg hover:border-[#EC4899] hover:bg-[#EC4899]/10 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-[#EC4899]/20 rounded-full group-hover:bg-[#EC4899] transition-colors">
                <Github size={24} className="text-[#EC4899] group-hover:text-white transition-colors" />
              </div>
              <span className="font-mono text-sm text-gray-400 group-hover:text-[#EC4899] transition-colors">GitHub</span>
              <span className="text-xs text-gray-500 text-center flex items-center gap-1">
                @Melvin-The-Goat
                <ExternalLink size={10} />
              </span>
            </a>

            <a
              href="https://linkedin.com/in/melvin-boateng"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 bg-black/40 border border-[#0EA5E9]/30 rounded-lg hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-[#0EA5E9]/20 rounded-full group-hover:bg-[#0EA5E9] transition-colors">
                <Linkedin size={24} className="text-[#0EA5E9] group-hover:text-white transition-colors" />
              </div>
              <span className="font-mono text-sm text-gray-400 group-hover:text-[#0EA5E9] transition-colors">LinkedIn</span>
              <span className="text-xs text-gray-500 text-center flex items-center gap-1">
                Connect
                <ExternalLink size={10} />
              </span>
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm font-mono">
              Available for internships, research opportunities, and freelance projects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
