import React from 'react';
import { Share2, Clock, BarChart3, List, Lightbulb, FileText, Play } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Custom UI Components to replace Shadcn ---
const Card = ({ className = '', children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-white  rounded-xl border border-slate-200  text-slate-950  shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children }: { className?: string, children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = '', children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ className = '', variant = 'default', children }: { className?: string, variant?: 'default' | 'destructive', children: React.ReactNode }) => {
  const base = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2  :ring-slate-300";
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80   :bg-slate-50/80",
    destructive: "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80   :bg-red-900/80",
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
};

const Button = ({ className = '', variant = 'default', size = 'default', onClick, children }: { className?: string, variant?: 'default' | 'ghost', size?: 'default' | 'icon', onClick?: () => void, children: React.ReactNode }) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 :ring-slate-300";
  const variants = {
    default: "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90   :bg-slate-50/90",
    ghost: "hover:bg-slate-100 hover:text-slate-900 :bg-slate-800 :text-slate-50",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    icon: "h-9 w-9",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};
// ----------------------------------------------

export interface KeyHighlight {
  title: string;
  description: string;
}

export interface StudyBlockProps {
  title?: string;
  videoUrl?: string | null;
  coverImageUrl?: string | null;
  channelName?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  readTime?: string;
  topicCount?: number | string;
  keyHighlights?: KeyHighlight[];
  detailedSummary?: string;
  onExportPdf?: () => void;
  onShare?: () => void;
  onPlayVideo?: () => void;
}

export function StudyBlockDetails({
  title = "Generated Study Block",
  videoUrl,
  coverImageUrl,
  channelName,
  duration,
  difficulty = "Intermediate",
  readTime = "~4 mins",
  topicCount = "3 Core Concepts",
  keyHighlights = [],
  detailedSummary = "",
  onExportPdf,
  onShare,
  onPlayVideo,
}: StudyBlockProps) {
  
  const hasMedia = videoUrl || coverImageUrl;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-10 font-display text-slate-900 ">
      
      {/* Header Section */}
      <header className="flex items-center justify-between bg-white/80  backdrop-blur-md px-4 py-4 md:px-6 rounded-b-xl mb-6 shadow-sm border-b border-slate-200 ">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/10 hidden sm:flex"
            onClick={onExportPdf}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">picture_as_pdf</span>
            Export PDF
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary hover:text-primary hover:bg-primary/10"
            onClick={onShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 md:px-6">
        
        {/* Top Section: Media & Content Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Media Area (Video Thumbnail or Cover Image) */}
          {hasMedia && (
            <div className="lg:col-span-2 relative min-h-[250px] lg:h-full w-full overflow-hidden rounded-2xl bg-slate-200  shadow-sm border border-slate-200 ">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-500" 
                style={{ backgroundImage: `url('${coverImageUrl || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop'}')` }}
                role="img"
                aria-label="Media thumbnail"
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Media Overlays */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                {videoUrl && <Badge variant="destructive" className="mb-3 text-[10px] uppercase tracking-wider font-bold">YouTube</Badge>}
                {!videoUrl && coverImageUrl && <Badge className="mb-3 text-[10px] uppercase tracking-wider font-bold bg-primary hover:bg-primary">Article / Link</Badge>}
                <h3 className="font-bold text-lg md:text-xl leading-tight mb-1 line-clamp-2">{title}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                  {duration && (
                    <>
                      <Clock className="w-3.5 h-3.5" /> {duration}
                      <span>•</span>
                    </>
                  )}
                  {channelName && <span>{channelName}</span>}
                </p>
              </div>

              {/* Play Button Overlay for Videos */}
              {videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <button 
                    onClick={onPlayVideo}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-sm transform transition hover:scale-110"
                  >
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Content Analysis Card */}
          <Card className="rounded-2xl shadow-sm border-slate-200  lg:col-span-1 border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100  text-amber-600 ">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 ">Difficulty</p>
                    <p className="font-bold text-slate-900  text-base">{difficulty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100  text-blue-600 ">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 ">Read Time</p>
                    <p className="font-bold text-slate-900  text-base">{readTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100  text-emerald-600 ">
                    <List className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 ">Topics</p>
                    <p className="font-bold text-slate-900  text-base">{topicCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Key Highlights */}
        {keyHighlights && keyHighlights.length > 0 && (
          <Card className="rounded-2xl shadow-sm border-slate-200  border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Key Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900  mb-2 leading-tight">{highlight.title}</h4>
                      <p className="text-sm text-slate-600  leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Section: Detailed Summary */}
        {detailedSummary && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Explicação Detalhada
              </h4>
              <div className="text-sm leading-relaxed text-slate-700 markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{detailedSummary}</ReactMarkdown>
              </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
