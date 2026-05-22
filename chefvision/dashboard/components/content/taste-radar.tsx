"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

const data = [
    { subject: "Tatlı", A: 120, fullMark: 150 },
    { subject: "Tuzlu", A: 98, fullMark: 150 },
    { subject: "Ekşi", A: 86, fullMark: 150 },
    { subject: "Acı", A: 99, fullMark: 150 },
    { subject: "Umami", A: 85, fullMark: 150 },
    { subject: "Baharatlı", A: 65, fullMark: 150 },
]

export function TasteRadar() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#888888" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#888888", fontSize: 12 }} />
                <Radar
                    name="Lezzet Profili"
                    dataKey="A"
                    stroke="#0f172a"
                    fill="#0f172a"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    )
}
