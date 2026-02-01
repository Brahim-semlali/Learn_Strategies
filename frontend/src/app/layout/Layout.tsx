import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { GameAuthSync } from '@/app/shared/components/GameAuthSync';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/app/shared/components/ui/sidebar';
import {
  LayoutDashboard,
  Trophy,
  BookOpen,
  User,
  LogOut,
  Settings,
  Award,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/shared/components/ui/avatar';

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state: sidebarState } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const baseItems: { title: string; icon: typeof LayoutDashboard; url: string }[] = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { title: 'Rankings', icon: Trophy, url: '/rankings' },
    { title: 'Learn', icon: BookOpen, url: '/' },
    { title: 'Profile', icon: User, url: '/profile' },
    { title: 'Certificates', icon: Award, url: '/certificates' },
    { title: 'Settings', icon: Settings, url: '/settings' },
  ];
  const menuItems = user?.role === 'admin' ? [...baseItems, { title: 'Admin', icon: Shield, url: '/admin' }] : baseItems;

  return (
    <>
      <div className="min-h-screen w-full page-bg flex">
        <Sidebar collapsible="icon" className="bg-white border-r border-teal-100 shadow-lg shadow-teal-500/5 shrink-0">
          <SidebarHeader className="border-b border-teal-100 bg-white px-4 py-3 shrink-0 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center justify-between gap-2 min-w-0 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
              <div className="flex items-center gap-3 min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <div className="p-2 bg-gradient-to-br from-teal-500 via-cyan-500 to-orange-500 rounded-xl shadow-lg shadow-teal-500/30 ring-2 ring-white/50 shrink-0">
                  <Trophy className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-600 bg-clip-text text-transparent truncate leading-tight">
                    StrategyLearn
                  </h2>
                  <p className="text-xs text-teal-600/80 font-medium truncate leading-tight">Learn by playing</p>
                </div>
              </div>
              <SidebarTrigger
                className="shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                aria-label={sidebarState === 'collapsed' ? 'Agrandir le menu' : 'Réduire le menu'}
                title={sidebarState === 'collapsed' ? 'Agrandir le menu' : 'Réduire le menu'}
              >
                {sidebarState === 'collapsed' ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </SidebarTrigger>
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-teal-700 font-semibold text-xs px-3 py-1.5">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.url || (item.url === '/' && location.pathname === '/');
                    return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.url)}
                            isActive={isActive}
                            tooltip={item.title}
                            className="bg-white hover:bg-teal-50/80 data-[active=true]:bg-teal-100 data-[active=true]:text-teal-700 data-[active=true]:font-semibold data-[active=true]:shadow-inner rounded-lg mx-2 my-1"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-teal-100 bg-white p-2.5 shrink-0 mt-auto">
            <div className="flex items-center gap-2 mb-2 p-1.5 rounded-lg bg-teal-50/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-1">
              <Avatar className="w-8 h-8 ring-2 ring-teal-200/50 shrink-0 group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7">
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-orange-500 text-white font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="font-semibold text-xs text-gray-900 truncate leading-tight">{user?.name || 'User'}</div>
                <div className="text-xs text-teal-600/70 truncate leading-tight">{user?.email || ''}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-gray-700 h-8 text-xs px-3 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5 mr-2 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="page-bg min-w-0 flex-1">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </>
  );
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <GameAuthSync />
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};
