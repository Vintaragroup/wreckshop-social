import { useState } from "react";
import {
  BarChart3,
  Users,
  Mail,
  Music,
  Zap,
  Shield,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  Home,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { useIsMobile } from "./ui/use-mobile";
import { ThemeToggle } from "./theme-toggle";

interface AppShellProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", id: "dashboard", href: "/" },
  {
    icon: Users,
    label: "Audience",
    id: "audience",
    href: "/audience",
    children: [
      { label: "Profiles", href: "/audience/profiles" },
      { label: "Segments", href: "/audience/segments" },
    ],
  },
  {
    icon: Mail,
    label: "Campaigns",
    id: "campaigns",
    href: "/campaigns",
    children: [
      { label: "Email", href: "/campaigns/email" },
      { label: "SMS", href: "/campaigns/sms" },
      { label: "Journeys", href: "/campaigns/journeys" },
    ],
  },
  {
    icon: Music,
    label: "Content",
    id: "content",
    href: "/content",
    children: [
      { label: "Artists", href: "/content/artists" },
      { label: "Releases", href: "/content/releases" },
      { label: "Events", href: "/content/events" },
      { label: "Assets & Links", href: "/content/assets" },
    ],
  },
  { icon: Zap, label: "Integrations", id: "integrations", href: "/integrations" },
  { icon: BarChart3, label: "Analytics", id: "analytics", href: "/analytics" },
  { icon: Shield, label: "Compliance", id: "compliance", href: "/compliance" },
  { icon: Settings, label: "Settings", id: "settings", href: "/settings" },
];

export function AppShell({ children, currentPage = "dashboard", onPageChange }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const toggleMenuExpansion = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderNavigationItems = (isInSheet = false) => {
    return navigationItems.map((item) => (
      <div key={item.id}>
        <Button
          variant={currentPage === item.id || currentPage.startsWith(item.id + "-") ? "default" : "ghost"}
          className={`w-full justify-start ${
            isInSheet 
              ? "h-12 px-4 text-base" 
              : sidebarCollapsed ? "px-2 h-10" : "px-3 h-10"
          }`}
          onClick={() => {
            onPageChange?.(item.id);
            if (isInSheet) setMobileMenuOpen(false);
          }}
        >
          <item.icon className={`w-5 h-5 ${isInSheet ? "mr-3" : ""}`} />
          {(!sidebarCollapsed || isInSheet) && (
            <span className={isInSheet ? "" : "ml-3"}>{item.label}</span>
          )}
          {item.children && (!sidebarCollapsed || isInSheet) && (
            <div
              className="ml-auto p-1 h-auto rounded hover:bg-muted cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleMenuExpansion(item.id);
              }}
            >
              {expandedMenus.includes(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </Button>
        
        {item.children && (!sidebarCollapsed || isInSheet) && 
         (expandedMenus.includes(item.id) || currentPage === item.id || currentPage.startsWith(item.id + "-")) && (
          <div className={`${isInSheet ? "ml-4" : "ml-6"} mt-2 space-y-1`}>
            {item.children.map((child) => (
              <Button
                key={child.href}
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${isInSheet ? "h-10 text-sm" : "text-sm"} ${
                  currentPage === `${item.id}-${child.href.split('/').pop()}`
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  const childPageId = `${item.id}-${child.href.split('/').pop()}`;
                  onPageChange?.(childPageId);
                  if (isInSheet) setMobileMenuOpen(false);
                }}
              >
                {child.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">Wreckshop</h1>
                  <p className="text-xs text-muted-foreground">Wreckshop Records</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {renderNavigationItems()}
          </nav>

          {/* Environment Badge */}
          <div className="p-4 border-t border-border">
            {!sidebarCollapsed && (
              <Badge variant="secondary" className="w-full justify-center">
                Production
              </Badge>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Menu / Desktop Sidebar Toggle */}
              {isMobile ? (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main navigation menu for the iON Creative music industry application
                    </SheetDescription>
                    
                    {/* Mobile Menu Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h1 className="font-bold text-lg">Wreckshop</h1>
                          <p className="text-xs text-muted-foreground">Wreckshop Records</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-6 space-y-2">
                      {renderNavigationItems(true)}
                    </nav>
                    
                    {/* Mobile Environment Badge */}
                    <div className="p-6 border-t border-border">
                      <Badge variant="secondary" className="w-full justify-center">
                        Production
                      </Badge>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={isMobile ? "Search..." : "Search profiles, campaigns, artists..."}
                  className={`pl-10 ${isMobile ? "w-40 sm:w-56" : "w-96"}`}
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-destructive text-xs">
                  3
                </Badge>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    {!isMobile && <span>Admin</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto ${isMobile ? "p-4" : "p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}