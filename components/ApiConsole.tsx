import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, FileText } from 'lucide-react';

type Method = 'GET' | 'PUT' | 'DELETE';

const ApiConsole: React.FC = () => {
  const [method, setMethod] = useState<Method>('PUT');
  const [url] = useState('https://s3.amazonaws.com/my-bucket/report.pdf');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const executeRequest = () => {
    setLoading(true);
    setOutput('');
    setShowPreview(false);

    // Simulate Network Latency
    setTimeout(() => {
      setLoading(false);
      const date = new Date().toUTCString();
      
      let response = '';

      if (method === 'PUT') {
        response = `HTTP/1.1 200 OK
x-amz-id-2: Lri+8...
x-amz-request-id: 9B2E...
Date: ${date}
ETag: "6299528715badc..."
Content-Length: 0
Server: AmazonS3

[Object uploaded successfully]`;
      } else if (method === 'GET') {
        response = `HTTP/1.1 200 OK
x-amz-id-2: Lri+8...
x-amz-request-id: 0A1B...
Date: ${date}
Last-Modified: Wed, 12 Oct 2023 17:50:00 GMT
ETag: "6299528715badc..."
Accept-Ranges: bytes
Content-Type: application/pdf
Content-Length: 1048576
Server: AmazonS3

[Binary Data Stream...]`;
        setShowPreview(true);
      } else if (method === 'DELETE') {
        response = `HTTP/1.1 204 No Content
x-amz-id-2: Lri+8...
x-amz-request-id: F4G5...
Date: ${date}
Server: AmazonS3`;
      }

      setOutput(response);
    }, 1200);
  };

  useEffect(() => {
    if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, loading]);

  return (
    <div className="h-full flex flex-col space-y-6">
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">API-Driven Access</h2>
        <p className="text-slate-600 dark:text-slate-300">
          You don't "mount" object storage like a hard drive. Applications interact with it exclusively via RESTful HTTP APIs.
        </p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-sm border border-slate-700">
        {/* URL Bar */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-3">
          <select 
            value={method} 
            onChange={(e) => {
                setMethod(e.target.value as Method);
                setOutput('');
                setShowPreview(false);
            }}
            className="bg-slate-900 text-white border border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
          >
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <div className="flex-1 bg-slate-900 text-slate-300 border border-slate-600 rounded px-3 py-2 flex items-center overflow-hidden">
            <span className="truncate">{url}</span>
          </div>

          <button 
            onClick={executeRequest}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
                <RotateCcw className="animate-spin" size={16} />
            ) : (
                <Play size={16} />
            )}
            <span>Send</span>
          </button>
        </div>

        {/* Console Body */}
        <div className="flex-1 flex flex-col md:flex-row">
            {/* Request Body (Mock) */}
            <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-slate-700 text-slate-400">
                <div className="mb-2 text-xs uppercase tracking-wider font-semibold text-slate-500">Request Body</div>
                {method === 'PUT' ? (
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700 flex items-center gap-3">
                        <FileText size={24} className="text-red-400" />
                        <div>
                            <p className="text-slate-300">report.pdf</p>
                            <p className="text-xs text-slate-500">1.2 MB</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-600 italic">No body for {method} requests</div>
                )}
            </div>

            {/* Response Body */}
            <div className="w-full md:w-1/2 flex flex-col min-h-[300px]">
                 <div className="p-2 bg-slate-800 border-b border-slate-700 text-xs text-slate-400 flex justify-between">
                    <span>Response</span>
                    {output && <span className="text-green-400">Status: 200 OK</span>}
                 </div>
                 <div ref={outputRef} className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap text-green-300 leading-relaxed scrollbar-hide">
                    {loading && <span className="animate-pulse">Connecting to s3.amazonaws.com...</span>}
                    {!loading && output}
                 </div>
                 {showPreview && (
                    <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-center items-center animate-in slide-in-from-bottom-5 fade-in duration-500">
                        <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                            <FileText size={32} className="text-red-500 mb-1" />
                            <span className="text-slate-900 font-bold text-xs">PDF Preview</span>
                        </div>
                    </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConsole;