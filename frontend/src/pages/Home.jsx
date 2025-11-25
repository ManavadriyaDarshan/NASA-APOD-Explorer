import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Heart, RefreshCw, Star, Rocket } from 'lucide-react';
import ApodCard from '../components/ApodCard';
import ApodDetailModal from '../components/ApodDetailModal';
import DatePickerComponent from '../components/DatePickerComponent';
import Gallery from '../components/Gallery';
import { fetchTodayApod, fetchApodByDate, fetchRecentApods, fetchRandomApods } from '../api/apodApi';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const Home = () => {
  const [todayApod, setTodayApod] = useState(null);
  const [selectedApod, setSelectedApod] = useState(null);
  const [recentApods, setRecentApods] = useState([]);
  const [randomApods, setRandomApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    loadTodayApod();
    loadRecentApods();
  }, []);

  const loadTodayApod = async () => {
    try {
      setLoading(true);
      const data = await fetchTodayApod();
      setTodayApod(data);
    } catch (error) {
      toast.error('Failed to load today\'s APOD');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentApods = async () => {
    try {
      const data = await fetchRecentApods(12);
      setRecentApods(data);
    } catch (error) {
      toast.error('Failed to load recent APODs');
      console.error(error);
    }
  };

  const loadRandomApods = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomApods(12);
      setRandomApods(data);
      toast.success('Random APODs loaded!');
    } catch (error) {
      toast.error('Failed to load random APODs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const data = await fetchApodByDate(formattedDate);
      setSelectedApod(data);
      setDatePickerOpen(false);
    } catch (error) {
      toast.error('Failed to load APOD for selected date');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 pb-16">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center backdrop-blur-sm border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Rocket className="w-6 h-6 text-blue-400 fill-blue-400/20" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  NASA APOD Explorer
                </h1>
                <p className="text-xs text-blue-300/80 font-medium tracking-wide uppercase">Astronomy Picture of the Day</p>
              </div>
            </div>
            <Button
              onClick={() => setDatePickerOpen(true)}
              variant="outline"
              className="border-blue-500/30 hover:border-blue-400/60 bg-blue-500/10 hover:bg-blue-500/20 text-blue-100 transition-all duration-300"
              data-testid="date-picker-button"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Time Travel
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-slate-900/80 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="today" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <Star className="w-4 h-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <Heart className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="random" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              Random
            </TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-blue-300 animate-pulse">Scanning the cosmos...</p>
              </div>
            ) : todayApod ? (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Today's Cosmic View
                  </h2>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {todayApod.date}
                  </div>
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <ApodCard
                    apod={todayApod}
                    onClick={() => setSelectedApod(todayApod)}
                    featured
                  />
                </div>
              </div>
            ) : null}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Recent Discoveries
              </h2>
              <p className="text-lg text-slate-400">A curated collection of the last 12 astronomical wonders</p>
            </div>
            <Gallery apods={recentApods} onApodClick={setSelectedApod} />
          </TabsContent>

          {/* Random Tab */}
          <TabsContent value="random" className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-200 via-white to-emerald-200 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Random Cosmic Picks
              </h2>
              <p className="text-lg text-slate-400 mb-8">Explore random moments from space history</p>
              <Button
                onClick={loadRandomApods}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-blue-900/40 hover:-translate-y-0.5"
                data-testid="load-random-button"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Teleporting...' : 'Load New Batch'}
              </Button>
            </div>
            {randomApods.length > 0 && (
              <Gallery apods={randomApods} onApodClick={setSelectedApod} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {selectedApod && (
        <ApodDetailModal
          apod={selectedApod}
          open={!!selectedApod}
          onClose={() => setSelectedApod(null)}
        />
      )}

      {datePickerOpen && (
        <DatePickerComponent
          open={datePickerOpen}
          onClose={() => setDatePickerOpen(false)}
          onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
};

export default Home;
