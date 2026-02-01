import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Users, Calendar, Briefcase, Award, Zap } from 'lucide-react';
import { NAV_LINKS } from '../data/MockData';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const location = useLocation();

  // 1. RSS Feed Logic
  useEffect(() => {
    if (activeDropdown === 'Blogs' && blogPosts.length === 0) {
      const RSS_URL = "https://ecellupc.blogspot.com/feeds/posts/default?alt=rss";
      const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`;

      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok' && data.items) {
            setBlogPosts(data.items.slice(0, 2));
          }
        })
        .catch(err => {
          console.error("Error fetching blogs:", err);
        });
    }
  }, [activeDropdown, blogPosts.length]);

  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        // FIX: Changed 'fixed' to 'sticky' so it pushes content down properly. 
        // If you want the image to go BEHIND the navbar, change 'sticky' back to 'fixed' 
        // and add padding-top to your Hero section instead.
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0f1014]/95 backdrop-blur-md shadow-lg border-b border-white/10' 
            : 'bg-gradient-to-b from-black/80 to-transparent' // Added gradient so text is readable even at top
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO SECTION (Exact copy of Previous Design) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="rounded-lg group-hover:rotate-12 transition-transform">
              <img
                src="assets/Ecell_Logo.png" 
                alt="E-Cell Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-wide">
              E-Cell <span className="text-accent">UPC</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              link.name === 'About Us' || link.name === 'Initiatives' || link.name === 'Blogs' ? (
                <div
                  key={link.name}
                  className="relative h-full flex items-center py-2" // Added py-2 to give hover space
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 hover:text-accent ${
                      location.pathname === link.path ? 'text-accent' : 'text-gray-300'
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* DROPDOWN MENU */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="bg-[#0f1014] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[260px] relative">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                      
                      {/* About Us Items */}
                      {link.name === 'About Us' && (
                        <div className='p-2 space-y-1'>
                          <Link to="/about#who-we-are" className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-white/5 group">
                            <div className="p-2 transition-colors rounded-md bg-white/5 group-hover:bg-accent/20">
                              <Users size={18} className="text-gray-300 group-hover:text-accent" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Who We Are</div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Mission & Vision</div>
                            </div>
                          </Link>
                          <Link to="/team" className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-white/5 group">
                            <div className="p-2 transition-colors rounded-md bg-white/5 group-hover:bg-accent/20">
                              <Award size={18} className="text-gray-300 group-hover:text-accent" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Our Team</div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Board Members</div>
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Initiatives Items */}
                      {link.name === 'Initiatives' && (
                        <div className='p-2 space-y-1'>
                          <Link to="/initiatives" className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-white/5 group">
                            <div className="p-2 transition-colors rounded-md bg-white/5 group-hover:bg-accent/20">
                              <Calendar size={18} className="text-gray-300 group-hover:text-accent" />
                            </div>
                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white">All Initiatives</span>
                          </Link>
                          <Link to="/grow-your-resume" className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-white/5 group">
                            <div className="p-2 transition-colors rounded-md bg-white/5 group-hover:bg-accent/20">
                              <Briefcase size={18} className="text-gray-300 group-hover:text-accent" />
                            </div>
                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Careers</span>
                          </Link>
                          <Link to="/initiatives#eureka" className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-white/5 group">
                            <div className="p-2 transition-colors rounded-md bg-white/5 group-hover:bg-accent/20">
                              <Zap size={18} className="text-gray-300 group-hover:text-accent" />
                            </div>
                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Eureka!</span>
                          </Link>
                        </div>
                      )}

                      {/* Blog Items */}
                      {link.name === 'Blogs' && (
                        <div className='p-4 w-[380px]'>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Latest Posts</span>
                            <Link to="/blog" className="text-xs text-accent hover:underline">View All</Link>
                          </div>
                          <div className="space-y-3">
                            {blogPosts.length > 0 ? (
                              blogPosts.map((post, idx) => (
                                <Link
                                  key={idx}
                                  to={`/blog?id=${encodeURIComponent(post.link)}`}
                                  className="block p-3 transition-colors border rounded-lg bg-white/5 border-white/5 hover:border-accent/30 hover:bg-white/10 group"
                                >
                                  <h4 className="mb-1 text-sm font-medium text-gray-200 truncate group-hover:text-accent">
                                    {stripHtml(post.title)}
                                  </h4>
                                  <p className="text-xs text-gray-500 line-clamp-2">
                                    {stripHtml(post.description || post.content)}
                                  </p>
                                </Link>
                              ))
                            ) : (
                              <div className="py-4 text-center text-gray-500 text-sm">Loading updates...</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-accent ${
                    location.pathname === link.path ? 'text-accent' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden text-white p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0f1014] border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-accent text-lg font-medium flex justify-between items-center"
                  >
                    {link.name}
                    <span className="text-white/20 text-sm">→</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;