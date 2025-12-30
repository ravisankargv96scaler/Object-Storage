import React, { useState } from 'react';
import { Tag, Save, Plus, X, Film } from 'lucide-react';

interface MetadataTag {
  key: string;
  value: string;
}

const MetadataInspector: React.FC = () => {
  const [systemMetadata] = useState({
    'Content-Type': 'video/mp4',
    'Size': '450.5 MB',
    'Last-Modified': new Date().toLocaleDateString(),
    'ETag': '"3d4f5g6h7j8k9l0"',
    'Storage-Class': 'STANDARD'
  });

  const [userTags, setUserTags] = useState<MetadataTag[]>([
    { key: 'project', value: 'Marketing Campaign' }
  ]);
  
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addTag = () => {
    if (newKey && newValue) {
      setUserTags([...userTags, { key: newKey, value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...userTags];
    newTags.splice(index, 1);
    setUserTags(newTags);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Power of Metadata</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Objects aren't just data blobs. They carry rich metadata (key-value pairs) that travel with the object. 
          This is crucial for organizing millions of unstructured files.
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        {/* Object Visualization */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="relative group">
            <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg mb-4">
              <Film size={64} />
            </div>
            {/* Visualizing "Stuck" tags */}
            <div className="absolute -right-4 -top-2 flex flex-col gap-1">
              {userTags.map((tag, i) => (
                <div key={i} className="bg-yellow-200 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transform rotate-3 max-w-[80px] truncate">
                  {tag.key}
                </div>
              ))}
            </div>
          </div>
          <p className="font-mono text-slate-700 dark:text-slate-300 font-bold mt-4">promo_video_v2.mp4</p>
          <p className="text-sm text-slate-500">s3://my-bucket/assets/</p>
        </div>

        {/* Inspector Panel */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Tag size={18} className="text-slate-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">Metadata Inspector</h3>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-8">
            
            {/* System Metadata */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">System Metadata (Read Only)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(systemMetadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-mono">{key}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Metadata */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Custom User Tags (Editable)</h4>
              
              <div className="space-y-2 mb-4">
                {userTags.length === 0 && <p className="text-sm text-slate-400 italic">No custom tags added yet.</p>}
                {userTags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded border border-indigo-100 dark:border-indigo-800">
                    <div className="flex-1 font-mono text-sm">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{tag.key}:</span>
                      <span className="text-slate-700 dark:text-slate-300 ml-2">"{tag.value}"</span>
                    </div>
                    <button onClick={() => removeTag(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Form */}
              <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Key (e.g., project)"
                    className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                  />
                </div>
                <span className="hidden sm:block text-slate-400">:</span>
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Value (e.g., Marketing)"
                    className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
                <button 
                  onClick={addTag}
                  disabled={!newKey || !newValue}
                  className="w-full sm:w-auto p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="mt-2 text-right">
                 <button className="text-xs flex items-center gap-1 ml-auto text-green-600 font-semibold opacity-0 animate-none">
                    <Save size={12} /> Saved
                 </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataInspector;