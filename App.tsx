
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Wind, Droplets, ArrowRight, Loader2, Zap, AlertCircle, TrendingUp, Sun, ChevronRight, History } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { WeatherData, SearchHistoryItem, WeatherCondition } from './types';
import { fetchWeatherByCity, fetchWeatherByCoords } from './services/weatherService';
import AtmosphericEffects from './components/AtmosphericEffects';
import WeatherChart from './components/WeatherChart';
import { WEATHER_ICONS, THEME_COLORS } from './constants';

const App: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedTemp, setAnimatedTemp] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('skycast_history');
    if (saved) setHistory(JSON.parse(saved));
    handleSearch('Beijing'); // 默认城市设为北京
  }, []);

  // 优化后的数值动画：更短的持续时间，更快的响应
  useEffect(() => {
    if (weather) {
      const proxy = { val: animatedTemp };
      gsap.to(proxy, {
        val: weather.current.temp,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => setAnimatedTemp(Math.round(proxy.val))
      });
    }
  }, [weather?.current.temp]);

  // 优化鼠标交互：减少卡片位移幅度，防止亚像素导致的模糊
  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to('.global-glow', {
        x: clientX,
        y: clientY,
        duration: 1.5,
        ease: 'sine.out'
      });

      gsap.to('.tilt-card', {
        rotateX: -yPercent * 2.5,
        rotateY: xPercent * 2.5,
        x: xPercent * 5,
        y: yPercent * 5,
        duration: 0.6,
        ease: 'power1.out',
        // 确保使用硬件加速
        force3D: true
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: containerRef });

  const handleSearch = async (city: string) => {
    if (!city.trim() || loading) return;
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      
      const newHistory = [
        { id: Date.now().toString(), city: data.current.city, timestamp: Date.now() },
        ...history.filter(h => h.city.toLowerCase() !== data.current.city.toLowerCase()).slice(0, 4)
      ];
      setHistory(newHistory);
      localStorage.setItem('skycast_history', JSON.stringify(newHistory));
    } catch (err) {
      setError('Neural connection failed. Station unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return setError('Geolocation inactive');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      setWeather(data);
      setLoading(false);
    }, () => {
      setError('Location access denied');
      setLoading(false);
    });
  };

  // 入场动画优化：移除大幅度模糊，改用快速淡入和微量模糊
  useGSAP(() => {
    if (weather && !loading) {
      const tl = gsap.timeline();
      tl.fromTo('.stagger-reveal', 
        { opacity: 0, y: 15, filter: 'blur(4px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 0.8, 
          stagger: 0.05, 
          ease: 'power3.out',
          // 关键：动画结束后清除滤镜，保证 100% 清晰
          clearProps: "filter"
        }
      );
    }
  }, { dependencies: [weather?.current.city, loading] });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#020408] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-blue-500/30">
      
      {/* 背景层 */}
      {weather && <AtmosphericEffects condition={weather.current.condition} />}
      <div className="global-glow fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[100px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2" />
      <div className={`fixed inset-0 opacity-15 pointer-events-none transition-colors duration-[2s] bg-gradient-to-tr ${weather ? THEME_COLORS[weather.current.condition] : 'from-slate-950 to-black'}`} />

      {/* 顶部导航 */}
      <nav className="relative z-50 w-full px-8 py-8 flex justify-between items-center max-w-[1500px] mx-auto">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleSearch('Beijing')}>
          <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
            <Zap size={18} className="text-blue-500 group-hover:text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-[900] tracking-tighter block leading-none">SKYCAST<span className="text-blue-500 ml-0.5">ULTRA</span></span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black block mt-1">Satellite Linked</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center transition-all focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/40">
            <Search className="ml-5 text-slate-500" size={14} />
            <input 
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(cityInput)}
              placeholder="Query atmospheric node..."
              className="bg-transparent border-none py-3 px-5 outline-none w-40 md:w-64 text-sm font-semibold placeholder:text-slate-600"
            />
          </div>
          <button onClick={detectLocation} className="p-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500/30 transition-all active:scale-95 group">
            <MapPin size={18} className="text-slate-400 group-hover:text-blue-500" />
          </button>
        </div>
      </nav>

      {error && (
        <div className="relative z-50 mx-auto mt-2 px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* 主展示区 */}
      {weather && !loading && (
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-8 py-8 grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1">
          
          <div className="xl:col-span-8 flex flex-col gap-10">
            {/* 主城市卡片 - 增强清晰度 */}
            <section className="stagger-reveal tilt-card glass-panel rounded-[3.5rem] p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
               
               <div className="flex justify-between items-start mb-16 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-blue-500/10 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20">Node #{weather.current.city.slice(0,3)}</span>
                       <span className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.2em]">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h2 className="text-6xl md:text-[9rem] font-[1000] tracking-tighter text-white leading-[0.85] drop-shadow-sm mb-8">{weather.current.city}</h2>
                    <p className="text-blue-500 text-xs font-black uppercase tracking-[0.6em] ml-3">{weather.current.description}</p>
                  </div>
                  <div className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-xl hover:rotate-6 transition-transform duration-500 hidden sm:block">
                    <div className="w-20 h-20">{WEATHER_ICONS[weather.current.condition]}</div>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row items-end justify-between gap-10 relative z-10">
                  <div className="text-huge text-white">
                    {animatedTemp}<span className="text-[3rem] md:text-[5rem] align-top text-slate-500 ml-2">°</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pb-4 w-full lg:w-auto">
                     <div className="flex-1 lg:flex-none px-8 py-5 glass-panel rounded-[2rem] border-white/10">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Sensible</p>
                        <p className="text-3xl font-black">{Math.round(weather.current.feelsLike)}°</p>
                     </div>
                     <div className="flex-1 lg:flex-none px-8 py-5 glass-panel rounded-[2rem] border-white/10">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Variance</p>
                        <p className="text-3xl font-black">{Math.round(weather.current.maxTemp)}°<span className="text-white/20 mx-1">/</span>{Math.round(weather.current.minTemp)}°</p>
                     </div>
                  </div>
               </div>
            </section>

            {/* 趋势图表 */}
            <section className="stagger-reveal glass-panel rounded-[3rem] p-8">
               <div className="flex justify-between items-center mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Weather Flow</h3>
                  </div>
                  <TrendingUp size={14} className="text-slate-700" />
               </div>
               <WeatherChart forecast={weather.forecast} />
            </section>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-8">
            {/* 指标面板 */}
            <section className="stagger-reveal grid grid-cols-2 gap-5">
               {[
                 { label: 'Humidity', val: `${weather.current.humidity}%`, icon: <Droplets size={16} />, col: 'text-blue-400' },
                 { label: 'Windflow', val: `${weather.current.windSpeed} km/h`, icon: <Wind size={16} />, col: 'text-emerald-400' },
                 { label: 'Pressure', val: `1014.2`, icon: <Zap size={16} />, col: 'text-purple-400' },
                 { label: 'Solar Index', val: `Low`, icon: <Sun size={16} />, col: 'text-amber-400' },
               ].map((m, i) => (
                 <div key={i} className="glass-panel rounded-[2rem] p-6 hover:translate-y-[-4px] transition-transform">
                    <div className={`${m.col} mb-4`}>{m.icon}</div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">{m.label}</p>
                    <p className="text-xl font-black">{m.val}</p>
                 </div>
               ))}
            </section>

            {/* 7日预报 */}
            <section className="stagger-reveal glass-panel rounded-[2.5rem] p-8">
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-slate-600 mb-8">Cycle Synthesis</h3>
               <div className="space-y-3">
                  {weather.forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                       <span className="w-14 font-black text-[9px] uppercase text-slate-600 group-hover:text-white transition-colors tracking-widest">{day.date}</span>
                       <div className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity">{WEATHER_ICONS[day.condition]}</div>
                       <div className="flex gap-3 items-baseline">
                          <span className="text-lg font-black">{Math.round(day.tempMax)}°</span>
                          <span className="text-[10px] font-bold text-slate-700">{Math.round(day.tempMin)}°</span>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-4 bg-white/[0.03] rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Full Diagnostics <ChevronRight size={12} />
               </button>
            </section>

            {/* 历史节点 */}
            <section className="stagger-reveal flex flex-wrap gap-2 px-2">
               {history.map(item => (
                 <button 
                   key={item.id} 
                   onClick={() => handleSearch(item.city)}
                   className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-600/10 hover:border-blue-500/40 transition-all"
                 >
                   {item.city}
                 </button>
               ))}
            </section>
          </div>
        </main>
      )}

      {loading && (
        <div className="fixed inset-0 z-[100] bg-[#020408]/90 backdrop-blur-3xl flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-blue-500 animate-spin mb-6" />
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] animate-pulse">Syncing Atmos Node...</p>
        </div>
      )}

      <footer className="relative z-10 w-full px-8 py-10 text-center border-t border-white/[0.02] mt-auto">
        <p className="text-slate-800 text-[9px] font-black tracking-[1em] uppercase">SkyCast Ultra • Distributed Neural Systems • All Data Secured</p>
      </footer>
    </div>
  );
};

export default App;
