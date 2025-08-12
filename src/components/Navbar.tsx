import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-vj-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-playfair text-2xl font-bold text-vj-primary">
              VJ Hub
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/problems" 
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive('/problems') ? 'text-vj-primary' : 'text-vj-muted'
              }`}
            >
              Problems
            </Link>
            <Link 
              to="/ideas" 
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive('/ideas') ? 'text-vj-primary' : 'text-vj-muted'
              }`}
            >
              Ideas
            </Link>
            <Link 
              to="/startups" 
              className={`text-sm font-medium transition-colors hover:text-vj-primary ${
                isActive('/startups') ? 'text-vj-primary' : 'text-vj-muted'
              }`}
            >
              Startups
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-vj-muted hover:text-vj-primary">
                Login
              </Button>
            </Link>
            <Link to="/submit">
              <Button size="sm" className="btn-primary">
                Submit Idea
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;