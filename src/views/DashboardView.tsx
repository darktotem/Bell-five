import React from "react";
import{ mockUser } from "../data/mockUser";

export const DashboardView: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hello, {mockUser.fullName}!</h1>
            <p className="text-sm text-slate-600 mb-2">Your Bell5 ID: {mockUser.bell5Id}</p>
        </div>
    );
};