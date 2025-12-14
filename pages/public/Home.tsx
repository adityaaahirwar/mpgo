import React from 'react';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { Card } from '../../components/Card';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-900/50 border border-primary-700 text-primary-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New Positions Added Today
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Build Your Career in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-200">Public Service</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            The most secure and transparent way to find and apply for government jobs. One profile, endless opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => onNavigate('jobs')}>Browse Openings</Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white hover:text-slate-900 border-slate-600 hover:bg-white" onClick={() => onNavigate('about')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats / Trust Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Jobs', value: '2,540+', icon: Icons.Briefcase },
            { label: 'Registered Users', value: '1.2M+', icon: Icons.Users },
            { label: 'Departments', value: '85', icon: Icons.Shield },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center space-x-4 border-b-4 border-b-primary-500">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-4 text-lg text-slate-600">Your journey to public service in 3 simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 hidden md:block transform -translate-y-1/2"></div>
          {[
            { title: 'Create Profile', desc: 'Register once and upload your verified documents.', step: '1' },
            { title: 'Search & Apply', desc: 'Filter jobs by eligibility and apply with one click.', step: '2' },
            { title: 'Track Status', desc: 'Real-time updates on your application progress.', step: '3' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary-500/30">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Jobs Preview */}
      <section className="bg-slate-50 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
               <div>
                  <h2 className="text-3xl font-bold text-slate-900">Latest Notifications</h2>
                  <p className="mt-2 text-slate-600">Fresh opportunities posted in the last 24 hours</p>
               </div>
               <Button variant="outline" onClick={() => onNavigate('jobs')}>View All Jobs</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2, 3, 4].map((j) => (
                 <div key={j} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded mb-2">New Opening</span>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Senior Systems Analyst</h3>
                          <p className="text-sm text-slate-500">Ministry of Technology</p>
                       </div>
                       <div className="bg-slate-100 p-2 rounded text-slate-500">
                          <Icons.Briefcase className="w-5 h-5" />
                       </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                       <span className="flex items-center"><Icons.Users className="w-4 h-4 mr-1"/> 2 Vacancies</span>
                       <span className="flex items-center"><Icons.Clock className="w-4 h-4 mr-1"/> Full-time</span>
                       <span className="ml-auto font-medium text-slate-900">$85k - $95k</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-primary-600 rounded-3xl py-16 text-white mx-4 md:mx-auto shadow-2xl shadow-primary-900/20">
        <h2 className="text-3xl font-bold mb-4">Ready to serve your country?</h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join thousands of professionals making a difference every day. Create your account today.</p>
        <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-slate-50" onClick={() => onNavigate('login')}>
          Get Started Now
        </Button>
      </section>
    </div>
  );
};