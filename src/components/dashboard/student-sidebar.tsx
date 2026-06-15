import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  LayoutDashboard, 
  CreditCard, 
  Bell, 
  FileText, 
  User,
  GraduationCap
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studentNavItems: NavItem[] = [
  { label: "Overview", href: "/student", icon: LayoutDashboard },
  { label: "My Classes", href: "/student/classes", icon: BookOpen },
  { label: "Payments", href: "/student/payments", icon: CreditCard },
  { label: "Announcements", href: "/student/notices", icon: Bell },
  { label: "Study Resources", href: "/student/resources", icon: FileText },
  { label: "My Profile", href: "/student/profile", icon: User },
];

export function StudentSidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-primary text-white border-r border-primary-dark", className)}>
      {/* Brand area */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-primary-dark bg-primary-dark/40">
        <div className="p-2 bg-accent rounded-xl text-primary">
          <GraduationCap className="h-6 w-6 font-bold" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-wide font-display block leading-none">
            SHIFAT'S TALES
          </span>
          <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 block">
            Student Portal
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {studentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-accent text-primary shadow-md shadow-accent/15"
                  : "text-white/80 hover:text-white hover:bg-primary-dark/30"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive ? "text-primary" : "text-white/60 group-hover:text-white")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account indicator */}
      <div className="p-4 border-t border-primary-dark bg-primary-dark/20 text-xs font-semibold text-white/50 text-center">
        &copy; {new Date().getFullYear()} Shifat's Tales
      </div>
    </div>
  );
}
