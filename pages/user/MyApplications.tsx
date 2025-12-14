import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Application } from '../../types';

export const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "applications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(appsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Processing': return 'info';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      case 'Offer': return 'success';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
      
      {loading ? <p>Loading applications...</p> : applications.length === 0 ? <p>You haven't applied to any jobs yet.</p> : applications.map((app) => (
        <Card key={app.id} noPadding>
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                <p className="text-slate-500 text-sm">{app.department} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                 <Badge label={app.status} variant={getStatusVariant(app.status) as any} />
                 <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>

            {/* Timeline UI */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
              <div className="flex justify-between relative z-10">
                {['Pending', 'Processing', 'Interview', 'Offer'].map((step, index) => {
                   const statusMap: any = { 'Pending': 0, 'Processing': 1, 'Interview': 2, 'Offer': 3, 'Rejected': -1 };
                   const currentStage = statusMap[app.status];
                   const isCompleted = index <= currentStage;
                   
                   let circleClass = 'bg-slate-100 border-slate-300 text-slate-400';
                   if (isCompleted) circleClass = 'bg-green-600 border-green-600 text-white';
                   if (app.status === 'Rejected') circleClass = 'bg-slate-100 border-slate-300 text-slate-400';

                   return (
                     <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${circleClass}`}>
                          {index + 1}
                        </div>
                        <span className="text-xs mt-2 font-medium text-slate-500">{step}</span>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};