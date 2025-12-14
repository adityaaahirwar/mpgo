import React from 'react';
import { Card, CardHeader } from '../../components/Card';
import { Icons } from '../../components/Icons';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export const AdminDashboard = () => {
  const applicationData = [
    { name: 'Mon', apps: 145, visits: 2400 },
    { name: 'Tue', apps: 252, visits: 3100 },
    { name: 'Wed', apps: 138, visits: 2800 },
    { name: 'Thu', apps: 265, visits: 3500 },
    { name: 'Fri', apps: 248, visits: 3200 },
    { name: 'Sat', apps: 120, visits: 1800 },
    { name: 'Sun', apps: 95, visits: 1500 },
  ];

  const categoryData = [
    { name: 'Engineering', value: 400 },
    { name: 'Medical', value: 300 },
    { name: 'Admin', value: 300 },
    { name: 'Education', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Enterprise Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border-r border-slate-200 pr-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</span>
              <button className="flex items-center text-sm font-bold text-slate-800 hover:text-primary-600">
                Main Branch (HQ) <Icons.ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-2">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</span>
               <span className="text-sm text-slate-700">North America - East</span>
            </div>
         </div>
         
         <div className="flex items-center space-x-3">
            <div className="relative">
               <button className="flex items-center space-x-2 px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
                  <Icons.Calendar className="w-4 h-4" />
                  <span>Last 7 Days</span>
                  <Icons.ChevronDown className="w-3 h-3 ml-2 text-slate-400" />
               </button>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
               <Icons.Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm">Generate Report</Button>
         </div>
      </div>

      {/* System Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
               <span className="text-sm font-medium text-emerald-900">System Normal</span>
            </div>
            <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
         </div>
         <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
               <Icons.Server className="w-4 h-4 text-slate-400 mr-2" />
               <span className="text-sm text-slate-600">DB Usage: 45%</span>
            </div>
         </div>
         <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
               <Icons.Activity className="w-4 h-4 text-slate-400 mr-2" />
               <span className="text-sm text-slate-600">API Latency: 42ms</span>
            </div>
         </div>
         <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
               <Icons.AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
               <span className="text-sm font-medium text-amber-900">3 Pending Alerts</span>
            </div>
         </div>
      </div>

      {/* High Density KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
           { label: 'Total Applications', value: '12,345', sub: '+12% from last week', trend: 'up', color: 'text-blue-600' },
           { label: 'Active Job Posts', value: '142', sub: '8 positions closing soon', trend: 'neutral', color: 'text-slate-900' },
           { label: 'Avg Time to Hire', value: '18 Days', sub: '-2 days improvement', trend: 'up', color: 'text-green-600' },
           { label: 'Platform Users', value: '45.2k', sub: '120 new today', trend: 'up', color: 'text-purple-600' },
        ].map((stat, i) => (
           <Card key={i} className="flex flex-col justify-center p-4 border-t-4 border-t-transparent hover:border-t-primary-500 transition-all" noPadding>
              <div className="px-5 py-4">
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                 <div className="flex items-baseline mt-1 space-x-2">
                    <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                 </div>
                 <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                       <Icons.TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                       <div className="w-3 h-0.5 bg-slate-300 mr-1"></div>
                    )}
                    <span className="text-xs text-slate-400">{stat.sub}</span>
                 </div>
              </div>
           </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Area */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900">Traffic & Application Volume</h3>
                    <p className="text-sm text-slate-500">Comparative analysis of system load vs application submissions</p>
                 </div>
                 <div className="flex space-x-2">
                    <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Apps</span>
                    <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-300 mr-1"></div> Visits</span>
                 </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff'}}
                      itemStyle={{color: '#fff'}}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                    <Area type="monotone" dataKey="apps" stroke="#3b82f6" strokeWidth={2} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </Card>

           {/* Enterprise Data Grid */}
           <Card noPadding>
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Recent System Activity</h3>
                 <Button variant="ghost" size="sm" className="text-xs">View All Logs</Button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                       <tr>
                          <th className="px-6 py-3">Timestamp</th>
                          <th className="px-6 py-3">Event ID</th>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Action</th>
                          <th className="px-6 py-3">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                          { time: '10:42:05 AM', id: 'EVT-9921', user: 'admin@gov.portal', action: 'Modified Job Post #882', status: 'Success' },
                          { time: '10:38:12 AM', id: 'EVT-9920', user: 'system_bot', action: 'Auto-archived 5 applications', status: 'Success' },
                          { time: '10:15:00 AM', id: 'EVT-9919', user: 'hr_manager_01', action: 'Exported Applicant Data (CSV)', status: 'Success' },
                          { time: '09:55:23 AM', id: 'EVT-9918', user: 'unknown_ip', action: 'Failed Login Attempt', status: 'Warning' },
                          { time: '09:30:11 AM', id: 'EVT-9917', user: 'admin@gov.portal', action: 'System Config Update', status: 'Success' },
                       ].map((log, i) => (
                          <tr key={i} className="hover:bg-slate-50 group">
                             <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.time}</td>
                             <td className="px-6 py-3 font-mono text-xs text-slate-400">{log.id}</td>
                             <td className="px-6 py-3 text-slate-900 font-medium">{log.user}</td>
                             <td className="px-6 py-3">{log.action}</td>
                             <td className="px-6 py-3">
                                <Badge 
                                  label={log.status} 
                                  variant={log.status === 'Success' ? 'success' : log.status === 'Warning' ? 'warning' : 'neutral'} 
                                  className="text-[10px]"
                                />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
           {/* Quick Actions Panel */}
           <Card>
              <CardHeader title="Quick Actions" />
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
                    <Icons.Briefcase className="w-6 h-6 text-primary-600 mb-2" />
                    <span className="text-xs font-medium text-slate-700">Post Job</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
                    <Icons.Users className="w-6 h-6 text-primary-600 mb-2" />
                    <span className="text-xs font-medium text-slate-700">Add User</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
                    <Icons.Shield className="w-6 h-6 text-primary-600 mb-2" />
                    <span className="text-xs font-medium text-slate-700">Audit Logs</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
                    <Icons.Settings className="w-6 h-6 text-primary-600 mb-2" />
                    <span className="text-xs font-medium text-slate-700">Config</span>
                 </button>
              </div>
           </Card>

           {/* Distribution Chart */}
           <Card>
             <CardHeader title="Role Distribution" />
             <div className="h-48 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     innerRadius={40}
                     outerRadius={60}
                     paddingAngle={2}
                     dataKey="value"
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-slate-900">1.2k</span>
                  <p className="text-[10px] text-slate-400 uppercase">Total</p>
               </div>
             </div>
             <div className="space-y-2 mt-2">
               {categoryData.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                     <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-slate-600">{entry.name}</span>
                     </div>
                     <span className="font-medium text-slate-900">{Math.round((entry.value / 1200) * 100)}%</span>
                  </div>
               ))}
             </div>
           </Card>
           
           {/* Maintenance Notice */}
           <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs">
              <div className="flex items-center mb-2 text-white font-bold">
                 <Icons.AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
                 Scheduled Maintenance
              </div>
              <p className="mb-3 opacity-80">
                 System maintenance scheduled for Sunday, 2:00 AM - 4:00 AM UTC. Services may be intermittent.
              </p>
              <button className="text-white underline hover:text-primary-300">View Schedule</button>
           </div>
        </div>
      </div>
    </div>
  );
};