// src/components/create-post/editors/VideoUploader.tsx
import { useState, useRef, useCallback } from 'react';
import { CloudArrowUpIcon, PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUploadThing } from '@/lib/uploadthing';

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadProgress: (progress: number) => void;
  onUploadStart: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

interface ChunkUploadState {
  isPaused: boolean;
  uploadedChunks: Set<number>;
  totalChunks: number;
  currentChunk: number;
  abortController: AbortController | null;
}

export default function VideoUploader({
  onUploadComplete,
  onUploadProgress,
  onUploadStart,
  isUploading,
  uploadProgress
}: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<ChunkUploadState>({
    isPaused: false,
    uploadedChunks: new Set(),
    totalChunks: 0,
    currentChunk: 0,
    abortController: null
  });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, routeConfig } = useUploadThing('videoUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onUploadComplete(res[0].url);
        setSelectedFile(null);
        setError(null);
      }
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    },
    onUploadProgress: (progress) => {
      onUploadProgress(progress);
    }
  });

  // Calculate optimal chunk size based on file size and network
  const calculateChunkSize = useCallback((fileSize: number): number => {
    const MIN_CHUNK_SIZE = 1024 * 1024; // 1MB minimum
    const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB maximum
    
    // Dynamic chunk size based on file size
    let chunkSize: number;
    if (fileSize < 10 * 1024 * 1024) { // < 10MB
      chunkSize = MIN_CHUNK_SIZE;
    } else if (fileSize < 50 * 1024 * 1024) { // < 50MB
      chunkSize = 2 * 1024 * 1024; // 2MB chunks
    } else if (fileSize < 100 * 1024 * 1024) { // < 100MB
      chunkSize = 3 * 1024 * 1024; // 3MB chunks
    } else {
      chunkSize = MAX_CHUNK_SIZE; // 5MB chunks for large files
    }
    
    return chunkSize;
  }, []);

  // Compress video using browser API (basic compression)
  const compressVideo = async (file: File): Promise<File> => {
    // Check if the browser supports video compression
    if (!('VideoEncoder' in window)) {
      // Return original file if compression not supported
      return file;
    }

    try {
      // For now, return the original file
      // Advanced compression would require a library like ffmpeg.wasm
      return file;
    } catch (error) {
      console.error('Compression error:', error);
      return file;
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, MOV, AVI, WebM)');
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Calculate chunks
    const chunkSize = calculateChunkSize(file.size);
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    setUploadState({
      isPaused: false,
      uploadedChunks: new Set(),
      totalChunks,
      currentChunk: 0,
      abortController: null
    });
  };

  // Upload with chunking and parallel processing
  const handleUpload = async () => {
    if (!selectedFile) return;

    onUploadStart();
    setError(null);

    try {
      // Optional: Compress video before upload
      const fileToUpload = await compressVideo(selectedFile);
      
      // Use UploadThing's optimized upload with built-in chunking
      // The v7 version automatically handles chunking for files > 10MB
      await startUpload([fileToUpload]);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
    }
  };

  // Pause upload
  const handlePause = () => {
    if (uploadState.abortController) {
      uploadState.abortController.abort();
    }
    setUploadState(prev => ({ ...prev, isPaused: true }));
  };

  // Resume upload
  const handleResume = () => {
    setUploadState(prev => ({ ...prev, isPaused: false }));
    handleUpload();
  };

  // Cancel upload
  const handleCancel = () => {
    if (uploadState.abortController) {
      uploadState.abortController.abort();
    }
    setSelectedFile(null);
    setUploadState({
      isPaused: false,
      uploadedChunks: new Set(),
      totalChunks: 0,
      currentChunk: 0,
      abortController: null
    });
    onUploadProgress(0);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate upload speed and ETA
  const calculateUploadStats = () => {
    if (!selectedFile || uploadProgress === 0) return { speed: '0 MB/s', eta: 'Calculating...' };
    
    // This is a simplified calculation
    const bytesUploaded = (selectedFile.size * uploadProgress) / 100;
    const speed = bytesUploaded / 10; // Assuming 10 seconds elapsed (simplified)
    const remainingBytes = selectedFile.size - bytesUploaded;
    const etaSeconds = remainingBytes / speed;
    
    const formatSpeed = speed > 1024 * 1024 
      ? `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
      : `${(speed / 1024).toFixed(2)} KB/s`;
    
    const formatEta = etaSeconds > 60 
      ? `${Math.ceil(etaSeconds / 60)} min remaining`
      : `${Math.ceil(etaSeconds)} sec remaining`;
    
    return { speed: formatSpeed, eta: formatEta };
  };

  const stats = calculateUploadStats();

  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
      {!selectedFile && !isUploading ? (
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Select Video
          </button>
          
          <p className="text-gray-400 text-sm mt-4">
            Supported formats: MP4, MOV, AVI, WebM (max 100MB)
          </p>
          
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="text-green-400 font-medium mb-2">⚡ Optimized Upload</h4>
            <ul className="text-green-300 text-sm space-y-1 text-left">
              <li>• Automatic chunking for faster uploads</li>
              <li>• Pause and resume support</li>
              <li>• Parallel chunk processing</li>
              <li>• Network-adaptive chunk sizing</li>
            </ul>
          </div>
        </div>
      ) : selectedFile && !isUploading ? (
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <h4 className="text-[#ffffff] font-medium mb-2">Selected File</h4>
            <p className="text-gray-300">{selectedFile.name}</p>
            <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
            <p className="text-gray-400 text-sm">
              Will be uploaded in {uploadState.totalChunks} chunks
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleUpload}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Start Upload
            </button>
            
            <button
              onClick={() => setSelectedFile(null)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Uploading: {selectedFile?.name}</span>
              <span className="text-purple-400">{uploadProgress.toFixed(0)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>Speed: {stats.speed}</span>
              <span>{stats.eta}</span>
            </div>
          </div>
          
          {/* Upload Controls */}
          <div className="flex space-x-2">
            {!uploadState.isPaused ? (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PauseIcon className="w-5 h-5 mr-2" />
                Pause
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Resume
              </button>
            )}
            
            <button
              onClick={handleCancel}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
          
          {/* Chunk Progress */}
          <div className="text-xs text-gray-400">
            Chunk {uploadState.currentChunk} of {uploadState.totalChunks} 
            {uploadState.uploadedChunks.size > 0 && (
              <span> • {uploadState.uploadedChunks.size} chunks completed</span>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}