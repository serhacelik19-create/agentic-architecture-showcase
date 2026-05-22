"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function Overview({ chartData = [] }: { chartData?: any[] }) {
    const safeData = Array.isArray(chartData) ? chartData : [];
    const processedData = safeData.map(item => ({
        name: item?.date ? new Date(item.date).toLocaleDateString('tr-TR', { weekday: 'short' }) : '...',
        total: item?.count || 0
    }));

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={processedData.length > 0 ? processedData : [{ name: "Yok", total: 0 }]} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
                <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                    contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        padding: '12px'
                    }}
                    itemStyle={{ fontWeight: '800', color: '#4f46e5', fontSize: '14px' }}
                    labelStyle={{ fontWeight: '700', color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                />
                <Bar
                    dataKey="total"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
