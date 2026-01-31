import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const sectorData = [
    { name: 'Tech', value: 400 },
    { name: 'Mfg', value: 300 },
    { name: 'Agri', value: 300 },
    { name: 'Green', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PortfolioAnalytics = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Growth Chart */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">Portfolio Growth</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sector Distribution */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">Sector Distribution</h3>
                <div className="h-64 w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sectorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sectorData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center flex-wrap gap-4 mt-4">
                    {sectorData.map((entry, index) => (
                        <div key={index} className="flex items-center text-xs text-slate-300">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioAnalytics;
