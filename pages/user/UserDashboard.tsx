import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Application } from '../../types';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "applications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApps(appsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Derive active app for timeline (just taking the last one for demo)
  const activeApp = apps.length > 0 ? apps[apps.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good Morning, {user?.email?.split('@')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here is what is happening with your job search today.</p>
        </div>
        <Button onClick={() => {}}>Find a Job</Button>
      </div>

      {/* Profile Completion Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-2">Complete your profile to stand out</h2>
            <p className="text-primary-100 text-sm max-w-md">You are missing your verified academic transcript. Uploading it increases your chance of selection by 40%.</p>
            <div className="mt-4 flex items-center gap-3">
               <div className="w-full max-w-[200px] h-2 bg-primary-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[80%]"></div>
               </div>
               <span className="text-xs font-medium">80% Complete</span>
            </div>
          </div>
          <Button variant="secondary" className="bg-white text-primary-700 hover:bg-slate-100 border-none shrink-0">Upload Transcript</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Application Status */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-bold text-slate-900 text-lg">Current Application Status</h3>
           <Card>
              {activeApp ? (
                <>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                     <div>
                        <Badge label={activeApp.status} variant="info" />
                        <h4 className="font-bold text-slate-900 mt-2 text-lg">{activeApp.jobTitle}</h4>
                        <p className="text-sm text-slate-500">{activeApp.department} • Applied {new Date(activeApp.appliedAt).toLocaleDateString()}</p>
                     </div>
                     <Button variant="outline" size="sm">View Details</Button>
                  </div>
                  <div className="p-6">
                     <div className="relative">
                        <div className="absolute top-[15px] left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                        <div className="relative flex justify-between">
                           {['Pending', 'Processing', 'Interview', 'Offer'].map((step, idx) => {
                             // Simple mapper for status to step index
                             const statusMap: any = { 'Pending': 0, 'Processing': 1, 'Interview': 2, 'Offer': 3, 'Rejected': 0 };
                             const currentStep = statusMap[activeApp.status] || 0;
                             const active = idx <= currentStep;
                             
                             return (
                               <div key={step} className="flex flex-col items-center gap-2 z-10">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white ${active ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    {active ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-xs font-medium ${active ? 'text-primary-700' : 'text-slate-400'}`}>{step}</span>
                               </div>
                             );
                           })}
                        </div>
                     </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>No active applications yet.</p>
                  <Button className="mt-4" variant="outline">Browse Jobs</Button>
                </div>
              )}
           </Card>

           <h3 className="font-bold text-slate-900 text-lg mt-8">Recommended Jobs</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" noPadding>
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                       <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Icons.Briefcase className="w-5 h-5" />
                       </div>
                       <button className="text-slate-300 hover:text-amber-400"><Icons.Star className="w-5 h-5" /></button>
                    </div>
                    <h4 className="font-bold text-slate-900">Senior Civil Engineer</h4>
                    <p className="text-sm text-slate-500 mb-4">Infrastructure Dept • Full-time</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                       <span className="flex items-center"><Icons.MapPin className="w-3 h-3 mr-1" /> Remote</span>
                       <span className="flex items-center"><Icons.Clock className="w-3 h-3 mr-1" /> 5 days left</span>
                    </div>
                    <Button variant="outline" size="sm" fullWidth>View Job</Button>
                 </div>
              </Card>
           </div>
        </div>

        {/* Right Col: Tasks & Notifications */}
        <div className="space-y-6">
           <Card>
              <CardHeader title="Action Items" />
              <div className="space-y-3">
                 {[
                    { label: 'Upload ID Proof', status: 'done' },
                    { label: 'Verify Email', status: 'done' },
                    { label: 'Upload Transcript', status: 'pending' },
                 ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                       <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${task.status === 'done' ? 'bg-green-100 text-green-600' : 'border border-slate-300'}`}>
                             {task.status === 'done' && <Icons.CheckSquare className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-sm ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}</span>
                       </div>
                       {task.status === 'pending' && <Icons.ArrowRight className="w-4 h-4 text-slate-400" />}
                    </div>
                 ))}
              </div>
           </Card>

           <Card>
              <CardHeader title="Recent Notifications" />
              <div className="space-y-4">
                 {[
                    { text: 'New job in Engineering posted', time: '5h ago', new: true },
                    { text: 'Profile verification successful', time: '1d ago', new: false },
                 ].map((notif, i) => (
                    <div key={i} className="flex gap-3 items-start">
                       <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.new ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                       <div>
                          <p className="text-sm text-slate-800 leading-tight">{notif.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};