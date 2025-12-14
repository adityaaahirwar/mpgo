import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Icons } from '../../components/Icons';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { Job } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("postedDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApply = async (job: Job) => {
    if (!user) {
      alert("Please login to apply");
      return;
    }
    
    if (window.confirm(`Apply for ${job.title}?`)) {
      setApplying(job.id);
      try {
        await addDoc(collection(db, "applications"), {
          userId: user.uid,
          jobId: job.id,
          jobTitle: job.title,
          department: job.department,
          status: 'Pending',
          appliedAt: new Date().toISOString()
        });
        alert("Application submitted successfully!");
      } catch (e) {
        console.error("Apply error:", e);
        alert("Failed to submit application");
      } finally {
        setApplying(null);
      }
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <Card className="sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Icons.Search className="w-4 h-4 mr-2" /> Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Department</label>
                  <select className="w-full border-slate-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 p-2 border">
                    <option>All Departments</option>
                    <option>Finance</option>
                    <option>Technology</option>
                  </select>
                </div>
              </div>
              <Button fullWidth className="mt-6" variant="outline">Reset Filters</Button>
            </Card>
          </div>

          {/* Job List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold text-slate-900">Current Openings</h1>
               <span className="text-sm text-slate-500">{jobs.length} jobs found</span>
            </div>

            <div className="space-y-4">
              {loading ? <p>Loading jobs...</p> : jobs.map((job) => (
                <Card key={job.id} className="hover:border-primary-300 transition-colors group" noPadding>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600">{job.title}</h3>
                          {job.status === 'Closed' && <Badge label="Closed" variant="error" />}
                        </div>
                        <p className="text-slate-600 font-medium">{job.department}</p>
                        
                        <div className="flex items-center space-x-6 mt-4 text-sm text-slate-500">
                          <span className="flex items-center bg-slate-100 px-2 py-1 rounded"><Icons.Home className="w-3.5 h-3.5 mr-1.5"/> {job.location || 'Remote'}</span>
                          <span className="flex items-center bg-slate-100 px-2 py-1 rounded"><Icons.Briefcase className="w-3.5 h-3.5 mr-1.5"/> {job.type}</span>
                          <span className="flex items-center text-green-700 font-medium bg-green-50 px-2 py-1 rounded">{job.salary}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end space-y-4">
                         {job.pdfUrl && (
                           <a href={job.pdfUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600">
                             <Icons.FileText className="w-5 h-5" />
                           </a>
                         )}
                         {user && (
                           <Button size="sm" onClick={() => handleApply(job)} disabled={applying === job.id || job.status === 'Closed'}>
                             {applying === job.id ? 'Applying...' : 'Apply Now'}
                           </Button>
                         )}
                         {!user && (
                            <Button size="sm" variant="outline" disabled>Login to Apply</Button>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                     <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                     <span>Ref: GOV-JOB-{job.id.substring(0,6).toUpperCase()}</span>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline">Load More Jobs</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};