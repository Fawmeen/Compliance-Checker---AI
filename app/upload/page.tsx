'use client';

import { useState, useRef } from 'react';
import { Upload, File, Sparkles, CheckCircle, AlertCircle, X } from 'lucide-react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const router = useRouter();
    const dropRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                if (!name) setName(droppedFile.name.replace('.pdf', ''));
                animateFileDrop();
            } else {
                setMessage('Only PDF files are allowed.');
                setStatus('error');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!name) setName(selectedFile.name.replace('.pdf', ''));
            animateFileDrop();
        }
    };

    const animateFileDrop = () => {
        gsap.fromTo(".file-preview",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !category || !name) {
            setMessage("Please provide all required fields.");
            setStatus('error');
            return;
        }

        setUploading(true);
        setStatus('idle');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('Category', category);

        try {
            const res = await fetch('/api/policy', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            setStatus('success');
            setMessage('Policy document uploaded and processed successfully!');

            // Animation for success
            gsap.fromTo(".success-message", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });

            setTimeout(() => {
                router.push('/policies');
            }, 2000);

        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Failed to upload document. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setStatus('idle');
    };

    return (
    <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-xl w-full">

            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Upload Policy</h1>
                <p className="text-slate-500">Upload your PDF documents for AI analysis.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleUpload} className="space-y-6">

                        {/* Policy Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Policy Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Employee Handbook 2025"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Category Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Policy Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-slate-900"
                                required
                            >
                                <option value="">Select a category...</option>
                                <option value="Compliance">Compliance</option>
                                <option value="HR">HR</option>
                                <option value="Security">Security</option>
                                <option value="Legal">Legal</option>
                                <option value="Operational">Operational</option>
                            </select>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            ref={dropRef}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                        ${isDragging
                                    ? 'border-violet-500 bg-violet-50 scale-[1.02]'
                                    : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                                }
                        ${file ? 'bg-slate-50 border-solid border-slate-300' : ''}
                    `}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!!file}
                            />

                            {!file ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto text-violet-600">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-slate-900">Click or drag file to upload</p>
                                        <p className="text-sm text-slate-500 mt-1">PDF documents only</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="file-preview flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 text-violet-600">
                                            <File className="w-5 h-5" />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); removeFile(); }}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status Messages */}
                        {status === 'error' && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="success-message flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                                <CheckCircle className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={uploading || !file || !category || !name}
                            className={`
                        w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-violet-500/20
                        flex items-center justify-center gap-2 transition-all
                        ${uploading || !file || !category || !name
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-violet-600 text-white hover:bg-violet-700 hover:scale-[1.02]'
                                }
                    `}
                        >
                            {uploading ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Upload & Analyze'
                            )}
                        </button>

                    </form>
                </div>

                {/* Footer / Decor */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
                    Securely processed by ComplianceAI
                </div>
            </div>
        </div>
    </div>
    );
}
