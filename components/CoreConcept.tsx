import React, { useState, useCallback } from 'react';
import { Upload, File, Trash2, Box } from 'lucide-react';
import { CloudObject } from '../types';

const PRESETS = [
  { name: 'puppy.jpg', type: 'image/jpeg', size: '2.4MB' },
  { name: 'tax_return_2023.pdf', type: 'application/pdf', size: '1.1MB' },
  { name: 'backend_logs.txt', type: 'text/plain', size: '45KB' },
  { name: 'backup.zip', type: 'application/zip', size: '450MB' },
];

const CoreConcept: React.FC = () => {
  const [objects, setObjects] = useState<CloudObject[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleUpload = useCallback(() => {
    const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    const newObj: CloudObject = {
      id: generateId(),
      key: `s3://my-bucket/${preset.name}`,
      type: preset.type,
      size: preset.size,
      lastModified: new Date().toISOString(),
      metadata: {},
      isNew: true,
    };

    setObjects((prev) => [...prev, newObj]);

    // Remove animation flag after animation
    setTimeout(() => {
      setObjects((prev) => 
        prev.map(o => o.id === newObj.id ? { ...o, isNew: false } : o)
      );
    }, 500);
  }, []);

  const clearBucket = () => setObjects([]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Unlimited Bucket</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Unlike a hard drive where you organize files into nested folders, Object Storage is a massive flat container. 
          You act like a valet: you hand over data, and you get a unique key to retrieve it later.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[400px]">
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-cloud-50 dark:bg-slate-800/50 p-6 rounded-xl border-2 border-dashed border-cloud-300 dark:border-slate-600 flex flex-col items-center justify-center text-center h-48 transition-colors hover:bg-cloud-100 dark:hover:bg-slate-800 cursor-pointer"
               onClick={handleUpload}
               onMouseEnter={() => setIsHovering(true)}
               onMouseLeave={() => setIsHovering(false)}
          >
            <div className={`p-4 rounded-full bg-cloud-100 dark:bg-slate-700 text-cloud-600 dark:text-cloud-400 mb-3 transition-transform ${isHovering ? 'scale-110' : ''}`}>
              <Upload size={32} />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">Click to Upload Object</p>
            <p className="text-xs text-slate-500 mt-1">Simulate putting data into the bucket</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Bucket Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Object Count:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{objects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Region:</span>
                <span className="font-mono text-slate-900 dark:text-white">us-east-1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Durability:</span>
                <span className="font-mono text-green-500">99.999999999%</span>
              </div>
            </div>
            {objects.length > 0 && (
               <button 
               onClick={clearBucket}
               className="mt-4 w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
             >
               <Trash2 size={14} />
               <span>Empty Bucket</span>
             </button>
            )}
          </div>
        </div>

        {/* Bucket Visualizer */}
        <div className="w-full md:w-2/3 bg-slate-100 dark:bg-slate-900 rounded-xl border-t-8 border-cloud-500 p-6 relative overflow-hidden">
          <div className="absolute top-2 right-4 text-xs font-mono text-slate-400">s3://my-cloud-bucket</div>
          
          {objects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Box size={64} className="mb-4 opacity-50" />
              <p>Bucket is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-min max-h-[500px] overflow-y-auto p-2">
              {objects.map((obj) => (
                <div 
                  key={obj.id} 
                  className={`
                    bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border-l-4 border-cloud-500 flex items-start space-x-3
                    transition-all duration-500 ease-out
                    ${obj.isNew ? 'opacity-0 translate-y-10 scale-90' : 'opacity-100 translate-y-0 scale-100'}
                  `}
                >
                  <div className="p-2 bg-cloud-50 dark:bg-slate-700 rounded text-cloud-600 dark:text-cloud-400">
                    <File size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate" title={obj.key}>
                      {obj.key}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {obj.type.split('/')[1]}
                      </span>
                      <span className="text-[10px] text-slate-400">{obj.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoreConcept;