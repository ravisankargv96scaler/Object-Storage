import React, { useState } from 'react';
import { Server, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const DurabilitySimulator: React.FC = () => {
  const [zones, setZones] = useState([
    { id: 'A', status: 'active', chunks: ['Data-1', 'Data-2'] },
    { id: 'B', status: 'active', chunks: ['Data-3', 'Parity-1'] },
    { id: 'C', status: 'active', chunks: ['Parity-2', 'Data-4'] },
  ]);

  const [rebuilding, setRebuilding] = useState(false);

  const destroyZone = (id: string) => {
    if (rebuilding) return;
    setZones(zones.map(z => z.id === id ? { ...z, status: 'destroyed' } : z));
    
    // Auto rebuild simulation
    setTimeout(() => {
        setRebuilding(true);
        setTimeout(() => {
            setZones(prev => prev.map(z => z.id === id ? { ...z, status: 'recovering' } : z));
            setTimeout(() => {
                setZones(prev => prev.map(z => z.id === id ? { ...z, status: 'active' } : z));
                setRebuilding(false);
            }, 1500);
        }, 1500);
    }, 1000);
  };

  const isHealthy = zones.filter(z => z.status === 'active').length === 3;
  const isCritical = zones.filter(z => z.status === 'active').length === 2;
  const isRecovering = zones.some(z => z.status === 'recovering');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Durability & Erasure Coding</h2>
        <p className="text-slate-600 dark:text-slate-300">
          How do we get 99.999999999% durability? Data isn't just mirrored. It's split into chunks (Data + Parity) and spread across physically separate Availability Zones.
          If one zone floods or burns, the math allows us to rebuild the data from the remaining pieces.
        </p>
      </div>

      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-6 lg:p-12 relative overflow-hidden flex flex-col items-center justify-center">
        
        {/* Status Indicator */}
        <div className={`mb-8 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all
            ${isHealthy ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
              isRecovering ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
            }`}>
            {isHealthy && <CheckCircle size={20} />}
            {isCritical && <AlertTriangle size={20} />}
            {isRecovering && <RefreshCw size={20} className="animate-spin" />}
            <span>
                {isHealthy ? "System Healthy: All Data Accessible" : 
                 isRecovering ? "Rebuilding Data from Parity..." :
                 "Zone Failure Detected! Running on Parity."}
            </span>
        </div>

        {/* Zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            {zones.map((zone) => (
                <div key={zone.id} className="flex flex-col items-center gap-4">
                     {/* Data Center Building */}
                    <div className={`
                        w-full aspect-[4/5] rounded-xl border-4 flex flex-col items-center p-4 relative transition-all duration-700
                        ${zone.status === 'active' 
                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600' 
                            : zone.status === 'recovering' 
                                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-400 border-dashed'
                                : 'bg-red-50 dark:bg-red-900/10 border-red-500 opacity-50 scale-95 grayscale'}
                    `}>
                        <div className="absolute top-2 left-4 text-xs font-bold text-slate-400">ZONE {zone.id}</div>
                        <Server size={48} className={`mt-4 mb-8 ${zone.status === 'active' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300'}`} />
                        
                        {/* Chunks */}
                        <div className="w-full space-y-3">
                            {zone.chunks.map((chunk, i) => (
                                <div key={i} className={`
                                    p-3 rounded font-mono text-sm text-center font-bold shadow-sm transition-all duration-500
                                    ${zone.status === 'active' || zone.status === 'recovering'
                                        ? chunk.includes('Parity') 
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
                                            : 'bg-cloud-100 text-cloud-700 dark:bg-cloud-900/50 dark:text-cloud-300'
                                        : 'opacity-0 translate-y-10'}
                                `}>
                                    {chunk}
                                </div>
                            ))}
                        </div>

                        {/* Fire Effect (CSS Only approximation) */}
                        {zone.status === 'destroyed' && (
                            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center backdrop-blur-[1px]">
                                <AlertTriangle size={64} className="text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={() => destroyZone(zone.id)}
                        disabled={zone.status !== 'active' || !isHealthy}
                        className={`
                            px-4 py-2 rounded text-sm font-bold transition-colors
                            ${zone.status === 'active' && isHealthy
                                ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400' 
                                : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'}
                        `}
                    >
                        {zone.status === 'active' ? 'Simulate Disaster' : 'Unavailable'}
                    </button>
                </div>
            ))}
        </div>

        {/* Connection Lines (Visual Decor) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent -z-10 hidden md:block"></div>
      </div>
    </div>
  );
};

export default DurabilitySimulator;