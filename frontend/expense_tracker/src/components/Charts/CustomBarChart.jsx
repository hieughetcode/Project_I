import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import moment from 'moment';

const CustomBarChart = ({ data }) => {

    const getBarColor = (index) => {
        return index % 2 === 0 ? "#875cf5" : "#cfbefb";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-purple-800 mb-1">
                        {dataPoint.label} 
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-gray-900">{dataPoint.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />

                    <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="none" 
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                    <Bar
                        dataKey="amount"
                        fill="#FF8042"
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: "yellow" }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CustomBarChart;