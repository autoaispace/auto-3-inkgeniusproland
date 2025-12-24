import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Layers, Shirt, Eraser, Upload, Sparkles, MoveRight, Camera, Settings, Download, Loader2 } from 'lucide-react';
import { TabMode } from '../types';
import { InkBackground } from './InkBackground';
import { trackGenerationEvent } from '../utils/analytics';
import { imageGenService } from '../utils/imageGeneration';

interface HeroProps {
  activeTab: TabMode;
  setActiveTab: (tab: TabMode) => void;
  onGenerate: () => void;
  isModal?: boolean;
}

const tabConfig = {
  [TabMode.DESIGN]: {
    id: TabMode.DESIGN,
    label: 'Design',
    displayTitle: 'Neural Ink Gen',
    icon: PenTool,
    desc: "Concept to flash generation with needle-depth awareness.",
    placeholder: "Describe your tattoo concept...",
    action: 'Generate Design'
  },
  [TabMode.STENCIL]: {
    id: TabMode.STENCIL,
    label: 'Stencil',
    displayTitle: 'Thermal Extract',
    icon: Layers,
    desc: "Isolates structural paths for thermal printing.",
    placeholder: "Upload tattoo design...",
    action: 'Create Stencil'
  },
  [TabMode.TRY_ON]: {
    id: TabMode.TRY_ON,
    label: 'Try-On',
    displayTitle: 'Anatomy Map',
    icon: Shirt,
    desc: "Project designs onto body geometry.",
    placeholder: "Upload body canvas...",
    action: 'Start Projection'
  },
  [TabMode.COVER_UP]: {
    id: TabMode.COVER_UP,
    label: 'Cover-Up',
    displayTitle: 'Eclipse Engine',
    icon: Eraser,
    desc: "Calculates blackout patterns to obscure ink.",
    placeholder: "Upload existing tattoo...",
    action: 'Analyze Density'
  },
};

// Decorative Screw Head
const Screw = ({ className }: { className?: string }) => (
  <div className={`w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center ${className}`}>
    <div className="w-full h-[1px] bg-black transform rotate-45"></div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab, onGenerate, isModal = false }) => {
  const activeConfig = tabConfig[activeTab];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState('realistic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        setError('请选择图像文件');
        return;
      }
      
      // 验证文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleGenerateClick = async () => {
    setError(null);
    setIsGenerating(true);
    
    try {
      // 发送GTM事件
      const tabName = activeConfig.label;
      trackGenerationEvent(tabName, activeConfig.action, isModal);
      
      let result;
      
      if (activeTab === TabMode.DESIGN) {
        // 文生图
        if (!prompt.trim()) {
          setError('请输入描述文字');
          return;
        }
        
        result = await imageGenService.generateImageFromText(prompt, {
          style,
          width: 512,
          height: 512
        });
      } else {
        // 图生图
        if (!selectedFile) {
          setError('请选择图像文件');
          return;
        }
        
        if (!prompt.trim()) {
          setError('请输入修改描述');
          return;
        }
        
        result = await imageGenService.generateImageFromImage(prompt, selectedFile, {
          style,
          strength: 0.7,
          width: 512,
          height: 512
        });
      }
      
      if (result.success && result.imageData) {
        setGeneratedImage(result.imageData);
        onGenerate(); // 调用父组件的回调
      } else {
        setError(result.error || '生成失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `tattoo-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetGeneration = () => {
    setGeneratedImage(null);
    setError(null);
    setPrompt('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section 
      id={isModal ? undefined : 'suite'}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-black select-none ${isModal ? 'p-0' : 'pt-0'}`}
    >
      
      {/* --- BACKGROUND IMAGE & OVERLAY --- */}
      {/* Interactive Spotlight Effect */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.4), transparent 40%)`
        }}
      />

      {/* Darkened background to allow Spotlight (mix-blend-screen) to "illuminate" it */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero.png" 
          alt="Tattoo Art Background" 
          className="w-full h-full object-cover opacity-70"
        />
        {/* Reduced darken to make background more visible */}
        <div className="absolute inset-0 bg-black/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
      </div>
      
      {/* Atmosphere */}
      <InkBackground />

      {/* Main Content Container: If modal, take full width/height without padding constraints */}
      <div className={`relative z-10 w-full h-full flex flex-col justify-center ${isModal ? '' : 'max-w-6xl mx-auto px-4 sm:px-6'}`}>
        
        {/* 1. HEADLINES (Simplified) */}
        {!isModal && (
          <div className="text-center mb-6 sm:mb-10 md:mb-16 relative">
             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] mb-3 sm:mb-4 drop-shadow-2xl text-premium px-2">
             Pro AI Tattoo Generator
             </h1>
             <p className="text-zinc-400 font-serif italic text-sm sm:text-base md:text-lg lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4">
             Design. Visualize. Stencil. Built exclusively for the tattoo community.
             </p>
          </div>
        )}

        {/* 2. CONSOLE INTERFACE */}
        <div className={`
           flex flex-col lg:flex-row gap-0 items-stretch bg-[#0a0a0a] relative overflow-hidden 
           ${isModal 
             ? 'w-full h-full border-0 rounded-none shadow-none' 
             : 'h-auto min-h-[600px] sm:min-h-[500px] md:h-[55vh] border border-zinc-800 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm ring-1 ring-white/5'
           }
        `}>
           
           {/* Hardware Screws - Only show if NOT modal (cleaner look in modal) */}
           {!isModal && (
             <>
               <Screw className="absolute top-3 left-3 z-30" />
               <Screw className="absolute top-3 right-3 z-30" />
               <Screw className="absolute bottom-3 left-3 z-30" />
               <Screw className="absolute bottom-3 right-3 z-30" />
             </>
           )}

           {/* LEFT: CONTROLS */}
           <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col z-20 bg-zinc-950 min-h-[200px] sm:min-h-0">
              <div className="h-12 sm:h-16 border-b border-zinc-800 flex items-center px-4 sm:px-6 bg-black/20 justify-between shrink-0">
                 <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
                    Tool Selector
                 </span>
                 <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600" />
              </div>
              
              <div className="flex-grow flex flex-row lg:flex-col relative py-2 overflow-x-auto lg:overflow-y-auto overflow-y-hidden">
                 {/* Texture */}
                 <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

                {Object.values(tabConfig).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        resetGeneration();
                      }}
                      className={`relative group flex-shrink-0 lg:flex-grow flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-0 transition-all duration-300 border-l-2 lg:border-l-2 border-b-2 lg:border-b-0 ${
                        isActive 
                        ? 'bg-zinc-900 border-white text-white' 
                        : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                      }`}
                    >
                       <div className="flex items-center gap-3 sm:gap-5 w-full relative z-10">
                          <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                          <div className="text-left">
                            <span className={`block text-xs sm:text-sm font-bold uppercase tracking-wider leading-none mb-0.5 sm:mb-1 font-sans`}>
                              {tab.label}
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-mono opacity-50 block">{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                          </div>
                       </div>
                       {isActive && <MoveRight className="absolute right-3 sm:right-6 w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>
           </div>

           {/* RIGHT: WORKSPACE */}
           <div className="w-full lg:w-2/3 flex flex-col relative z-10 bg-[#050505]">
               {/* Grid Background */}
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

               {/* Header */}
               <div className="h-12 sm:h-16 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-black/40 backdrop-blur shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                     <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] ${
                       isGenerating ? 'bg-yellow-500' : 'bg-emerald-500'
                     }`} />
                     <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                       {isGenerating ? 'Generating...' : 'System Ready'}
                     </span>
                  </div>
                  <div className="flex gap-1.5">
                     {generatedImage && (
                       <button
                         onClick={handleDownload}
                         className="p-1 hover:bg-zinc-800 rounded transition-colors"
                         title="下载图像"
                       >
                         <Download className="w-3 h-3 text-zinc-400" />
                       </button>
                     )}
                     <div className="w-6 sm:w-8 h-0.5 bg-zinc-800"></div>
                     <div className="w-2 h-0.5 bg-zinc-800"></div>
                  </div>
               </div>

               {/* Input Area */}
               <div className="flex-grow relative overflow-hidden p-4 sm:p-6 md:p-10 flex flex-col justify-center min-h-[300px] sm:min-h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col relative z-10"
                    >
                        <h3 className="text-base sm:text-lg md:text-xl text-white font-serif italic mb-4 sm:mb-6 opacity-80">{activeConfig.displayTitle}</h3>

                        {/* 显示生成的图像 */}
                        {generatedImage && (
                          <div className="mb-6 flex justify-center">
                            <div className="relative">
                              <img 
                                src={generatedImage} 
                                alt="Generated tattoo design" 
                                className="max-w-full max-h-64 rounded border border-zinc-700 shadow-lg"
                              />
                              <button
                                onClick={resetGeneration}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded text-xs"
                              >
                                重新生成
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 错误信息 */}
                        {error && (
                          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                            {error}
                          </div>
                        )}

                        {/* 风格选择 */}
                        <div className="mb-4">
                          <label className="block text-xs text-zinc-400 mb-2">Style</label>
                          <select 
                            value={style} 
                            onChange={(e) => setStyle(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white"
                          >
                            <option value="realistic">Realistic</option>
                            <option value="traditional">Traditional</option>
                            <option value="minimalist">Minimalist</option>
                            <option value="geometric">Geometric</option>
                            <option value="watercolor">Watercolor</option>
                            <option value="blackwork">Blackwork</option>
                          </select>
                        </div>

                        {/* Prompt Input / File Upload */}
                        {activeTab === TabMode.DESIGN ? (
                           <div className="flex-grow relative group">
                              <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-full bg-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white/90 placeholder-zinc-800 focus:outline-none resize-none leading-[1.1] tracking-tighter font-sans min-h-[120px]"
                                placeholder={activeConfig.placeholder}
                                autoFocus
                              />
                              <div className="absolute bottom-0 right-0 p-2">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700 group-hover:text-white transition-colors" />
                              </div>
                           </div>
                        ) : (
                           <div className="flex-grow flex flex-col gap-4">
                             {/* 文件上传区域 */}
                             <div 
                               onClick={() => fileInputRef.current?.click()}
                               className="border border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 sm:gap-6 group rounded-sm min-h-[150px] p-6"
                             >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-white transition-colors shadow-2xl">
                                   <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors text-center px-4">
                                   {selectedFile ? selectedFile.name : 'Upload Reference Image'}
                                </span>
                                <input 
                                  ref={fileInputRef}
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                />
                             </div>
                             
                             {/* 提示词输入 */}
                             <textarea 
                               value={prompt}
                               onChange={(e) => setPrompt(e.target.value)}
                               className="w-full bg-zinc-900/50 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-none min-h-[80px]"
                               placeholder="Describe how you want to modify the image..."
                             />
                           </div>
                        )}
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* Footer Action Bar */}
               <div className="h-16 sm:h-20 border-t border-zinc-800 flex flex-col sm:flex-row bg-zinc-950 relative z-20 shrink-0">
                  <div className="flex-grow border-b sm:border-b-0 sm:border-r border-zinc-800 flex items-center px-4 sm:px-6 md:px-8 justify-between sm:justify-between shrink-0">
                     <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase">Est. Render Time</span>
                        <span className="text-[10px] sm:text-xs text-white font-mono">
                          {isGenerating ? 'Processing...' : '1.2s'}
                        </span>
                     </div>
                  </div>
                  <button 
                     onClick={handleGenerateClick}
                     disabled={isGenerating}
                     className="w-full sm:w-1/2 md:w-2/5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden py-3 sm:py-0"
                  >
                     {isGenerating ? (
                       <>
                         <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                         <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                           Generating...
                         </span>
                       </>
                     ) : (
                       <>
                         <span className="relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                            {activeConfig.action}
                         </span>
                         <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                       </>
                     )}
                     {/* Ink transition */}
                     <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 mix-blend-exclusion" />
                  </button>
               </div>
           </div>
        </div>

      </div>
    </section>
  );
};