import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Icons } from '../../components/Icons';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Job } from '../../types';
import { logAdminAction } from '../../services/auditService'; // Import Audit Service

export const JobManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // SECURITY: This query works because Security Rules allow 'read' on jobs
    const q = query(collection(db, "jobs"), orderBy("postedDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Access Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateJob = async () => {
    if (!title || !department) return;
    setSubmitting(true);

    try {
      let pdfUrl = '';
      if (pdfFile) {
        // SECURITY: Storage rules protect /job-docs/
        const storageRef = ref(storage, `job-docs/${Date.now()}_${pdfFile.name}`);
        const snapshot = await uploadBytes(storageRef, pdfFile);
        pdfUrl = await getDownloadURL(snapshot.ref);
      }

      // SECURITY: Firestore rules ensure only Admin can write here
      const docRef = await addDoc(collection(db, "jobs"), {
        title,
        department,
        type,
        salary,
        description,
        status: 'Open',
        postedDate: new Date().toISOString(),
        pdfUrl,
        applicantsCount: 0
      });

      // AUDIT LOG: Automatically track this action
      await logAdminAction(
        'CREATE_JOB', 
        docRef.id, 
        `Created job posting: ${title} (${department})`
      );

      // Reset form
      setShowForm(false);
      setTitle('');
      setDepartment('');
      setSalary('');
      setDescription('');
      setPdfFile(null);
    } catch (error: any) {
      console.error("Error adding job: ", error);
      if (error.code === 'permission-denied') {
        alert("Security Alert: You do not have permission to post jobs.");
      } else {
        alert("Failed to post job");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string, jobTitle: string) => {
    if (window.confirm("Are you sure you want to delete this job? This action is logged.")) {
      try {
        await deleteDoc(doc(db, "jobs", id));
        
        // AUDIT LOG: Track deletion
        await logAdminAction(
          'DELETE_JOB',
          id,
          `Deleted job posting: ${jobTitle}`
        );
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          alert("Access Denied: Only Admins can delete jobs.");
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-900">Job Listings</h2>
         <Button onClick={() => setShowForm(!showForm)}>
            <Icons.Briefcase className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Post New Job'}
         </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Job Posting</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" 
                      placeholder="e.g. Senior Analyst" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select 
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full border-slate-300 rounded-lg shadow-sm p-2 border"
                    >
                       <option value="">Select Department</option>
                       <option value="Finance">Finance</option>
                       <option value="Technology">Technology</option>
                       <option value="Education">Education</option>
                       <option value="Infrastructure">Infrastructure</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                       <select 
                          value={type}
                          onChange={e => setType(e.target.value)}
                          className="w-full border-slate-300 rounded-lg shadow-sm p-2 border"
                       >
                          <option value="Full-time">Full-time</option>
                          <option value="Contract">Contract</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                       <input 
                          type="text" 
                          value={salary}
                          onChange={e => setSalary(e.target.value)}
                          className="w-full border-slate-300 rounded-lg shadow-sm p-2 border" 
                          placeholder="$50k - $70k" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Description PDF</label>
                    <div className="flex items-center space-x-2">
                       <label className="cursor-pointer bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                          <Icons.Upload className="w-4 h-4 inline mr-2"/>
                          Choose File
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="application/pdf"
                            onChange={e => setPdfFile(e.target.files ? e.target.files[0] : null)}
                          />
                       </label>
                       <span className="text-sm text-slate-500 truncate">
                         {pdfFile ? pdfFile.name : 'No file chosen'}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                      rows={6} 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full border-slate-300 rounded-lg shadow-sm p-2 border" 
                      placeholder="Job responsibilities..." 
                    />
                 </div>
              </div>
           </div>
           <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>Discard</Button>
              <Button onClick={handleCreateJob} disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Job'}
              </Button>
           </div>
        </Card>
      )}

      <Card noPadding>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">Title</th>
                     <th className="px-6 py-4">Department</th>
                     <th className="px-6 py-4">Posted Date</th>
                     <th className="px-6 py-4">PDF</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4">No active jobs found.</td></tr>
                  ) : (
                    jobs.map((job) => (
                     <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                        <td className="px-6 py-4">{job.department}</td>
                        <td className="px-6 py-4">{new Date(job.postedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           {job.pdfUrl ? (
                             <a href={job.pdfUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center">
                               <Icons.FileText className="w-4 h-4 mr-1"/> View
                             </a>
                           ) : <span className="text-slate-400">N/A</span>}
                        </td>
                        <td className="px-6 py-4">
                           <Badge label={job.status} variant={job.status === 'Open' ? 'success' : 'neutral'} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                           <button onClick={() => handleDeleteJob(job.id, job.title)} className="text-slate-400 hover:text-red-600"><Icons.X className="w-4 h-4" /></button>
                        </td>
                     </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};