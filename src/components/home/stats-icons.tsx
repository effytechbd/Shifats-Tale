import React from "react";
import { 
  Award, Users, GraduationCap, CheckCircle, 
  Star, Target, Zap, Heart, 
  BookOpen, Clock, Activity, Shield, 
  TrendingUp, Trophy, Globe, Compass, 
  Bookmark, Briefcase, Calendar, CheckSquare,
  ClipboardList, Gem, Lightbulb, Medal,
  Rocket, ThumbsUp, PenTool
} from "lucide-react";

export const getIconComponent = (iconName: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  
  switch (iconName) {
    case "Award": return <Award {...props} />;
    case "Users": return <Users {...props} />;
    case "GraduationCap": return <GraduationCap {...props} />;
    case "CheckCircle": return <CheckCircle {...props} />;
    case "Star": return <Star {...props} />;
    case "Target": return <Target {...props} />;
    case "Zap": return <Zap {...props} />;
    case "Heart": return <Heart {...props} />;
    case "BookOpen": return <BookOpen {...props} />;
    case "Clock": return <Clock {...props} />;
    case "Activity": return <Activity {...props} />;
    case "Shield": return <Shield {...props} />;
    case "TrendingUp": return <TrendingUp {...props} />;
    case "Trophy": return <Trophy {...props} />;
    case "Globe": return <Globe {...props} />;
    case "Compass": return <Compass {...props} />;
    case "Bookmark": return <Bookmark {...props} />;
    case "Briefcase": return <Briefcase {...props} />;
    case "Calendar": return <Calendar {...props} />;
    case "CheckSquare": return <CheckSquare {...props} />;
    case "ClipboardList": return <ClipboardList {...props} />;
    case "Gem": return <Gem {...props} />;
    case "Lightbulb": return <Lightbulb {...props} />;
    case "Medal": return <Medal {...props} />;
    case "Rocket": return <Rocket {...props} />;
    case "ThumbsUp": return <ThumbsUp {...props} />;
    case "PenTool": return <PenTool {...props} />;
    default: return <Award {...props} />;
  }
};

export const availableStatsIcons = [
  "Award", "Users", "GraduationCap", "CheckCircle", 
  "Star", "Target", "Zap", "Heart", 
  "BookOpen", "Clock", "Activity", "Shield", 
  "TrendingUp", "Trophy", "Globe", "Compass", 
  "Bookmark", "Briefcase", "Calendar", "CheckSquare",
  "ClipboardList", "Gem", "Lightbulb", "Medal",
  "Rocket", "ThumbsUp", "PenTool"
];
