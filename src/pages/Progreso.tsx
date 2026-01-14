import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/home/BottomNav";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Progreso = () => {
  const navigate = useNavigate();

  const handleNavigate = (item: "home" | "receitas" | "progresso" | "perfil") => {
    switch (item) {
      case "home":
        navigate("/");
        break;
      case "receitas":
        navigate("/recetas");
        break;
      case "progresso":
        navigate("/progreso");
        break;
      case "perfil":
        navigate("/perfil");
        break;
    }
  };

  const weightData = [
    { week: "Sem 1", peso: 75 },
    { week: "Sem 2", peso: 74.2 },
    { week: "Sem 3", peso: 73.5 },
    { week: "Sem 4", peso: 72.8 },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: "#F7F3E8" }}>
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        {/* Header */}
        <header className="px-5 pt-12 pb-4">
          <h1 className="text-3xl font-bold text-[#333333]">Mi Progreso</h1>
        </header>

        {/* Progress Content */}
        <main className="flex-1 px-5 py-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
              <p className="text-gray-500 text-sm">Peso Actual</p>
              <p className="text-2xl font-bold text-[#4A9F4A]">72.8 kg</p>
              <p className="text-xs text-green-600">-2.2 kg este mes</p>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
              <p className="text-gray-500 text-sm">% Grasa</p>
              <p className="text-2xl font-bold text-[#C4A052]">24.5%</p>
              <p className="text-xs text-green-600">-1.5% este mes</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">Evolución del Peso</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A9F4A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4A9F4A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                  <Area type="monotone" dataKey="peso" stroke="#4A9F4A" strokeWidth={3} fillOpacity={1} fill="url(#colorPeso)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="text-lg font-bold text-[#333333]">15 días consecutivos</p>
                <p className="text-gray-500 text-sm">¡Sigue así!</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="progresso" onNavigate={handleNavigate} />
    </div>
  );
};

export default Progreso;
