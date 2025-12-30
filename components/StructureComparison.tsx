import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Database } from 'lucide-react';

const StructureComparison: React.FC = () => {
  const [path, setPath] = useState('/projects/website/images/logo.png');
  const [structure, setStructure] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    // Basic parsing logic
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const parts = cleanPath.split('/').filter(p => p.length > 0);
    
    if (parts.length > 0) {
      setFileName(parts[parts.length - 1]);
      setStructure(parts.slice(0, -1));
    } else {
      setFileName('');
      setStructure([]);
    }
  }, [path]);

  return (
    <div className="h-full flex flex-col space-y-6">
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Flat vs. Nested Structure</h2>
        <p className="text-slate-600 dark:text-slate-300">
          File systems use real directories. Object storage uses a "flat namespace". 
          The slashes <code className="bg-slate-100 dark:bg-slate-900 px-1 rounded">/</code> are just characters in the object's name (Key), not actual folders.
        </p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-500">Path Simulator:</span>
        <input 
          type="text" 
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-cloud-500 outline-none transition-all"
          placeholder="/folder/subfolder/file.txt"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Left: File System */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-2 text-xs font-semibold text-slate-500 uppercase">Traditional File System</span>
          </div>
          <div className="p-6 overflow-y-auto">
            <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1 mb-2">
                <Folder size={16} className="text-blue-500" />
                <span>root</span>
              </div>
              <div className="pl-4 border-l border-slate-200 dark:border-slate-700 ml-2">
                {structure.length === 0 && fileName && (
                   <div className="flex items-center gap-2 py-1 animate-pulse">
                     <File size={16} className="text-slate-400" />
                     <span>{fileName}</span>
                   </div>
                )}
                {structure.map((folder, index) => (
                  <div key={index} className="mb-1">
                    <div className="flex items-center gap-1 py-1">
                      <ChevronDown size={14} className="text-slate-400" />
                      <Folder size={16} className="text-yellow-500" />
                      <span>{folder}</span>
                    </div>
                    {/* Nested Container */}
                    <div className={`pl-4 border-l border-slate-200 dark:border-slate-700 ml-1.5 ${index === structure.length - 1 ? 'block' : ''}`}>
                      {index === structure.length - 1 && fileName && (
                        <div className="flex items-center gap-2 py-1 bg-blue-50 dark:bg-blue-900/30 -ml-2 pl-2 rounded">
                          <File size={16} className="text-blue-500" />
                          <span className="font-semibold text-blue-700 dark:text-blue-300">{fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Object Storage */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Object Storage (Bucket)</span>
            <Database size={14} className="text-slate-400" />
          </div>
          <div className="p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 h-full">
            <div className="space-y-4">
              {fileName ? (
                <div className="group relative">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-purple-600 dark:text-purple-400">
                      <File size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Key (ID)</p>
                      <p className="font-mono text-sm text-purple-700 dark:text-purple-300 break-all">
                        {path.startsWith('/') ? path.slice(1) : path}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tooltip Explanation */}
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-2 rounded">
                    <p>
                      <strong>Note:</strong> There are no actual folders here. 
                      The key is just a single string: <span className="font-mono bg-white dark:bg-black px-1 rounded">"{path.startsWith('/') ? path.slice(1) : path}"</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 mt-10">
                  <p>Enter a path above to visualize</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureComparison;