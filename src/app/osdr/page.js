'use client';

import { useState } from 'react';

export default function OSDRPage() {
  const [view, setView] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [studyId, setStudyId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [studyFiles, setStudyFiles] = useState(null);
  const [studyMetadata, setStudyMetadata] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchStudies = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/osdr/search?term=${encodeURIComponent(searchTerm)}&from=0&size=20&type=cgene`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyFiles = async () => {
    if (!studyId.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/osdr/files?id=${studyId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStudyFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyMetadata = async () => {
    if (!studyId.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/osdr/meta?id=${studyId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStudyMetadata(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/osdr/experiments');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const experimentsArray = Array.isArray(data) ? data : (data.experiments || []);
      setExperiments(experimentsArray.slice(0, 20));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/osdr/missions');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const missionsArray = Array.isArray(data) ? data : (data.missions || []);
      setMissions(missionsArray.slice(0, 20));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Space Biology</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">NASA OSDR</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            Open Science Data Repository
          </p>
          <p className="mt-6 leading-relaxed max-w-4xl">
            Explore NASA&apos;s comprehensive database of space biology research, including genomic, proteomic, 
            and phenotypic data from experiments conducted in space and ground-based analogs.
          </p>
        </div>

        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setView('search')}
              className={`relative border-4 border-slate-700 dark:border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                view === 'search'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] -translate-y-0.5 -translate-x-0.5'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
            >
              Search Studies
            </button>
            <button
              onClick={() => setView('files')}
              className={`relative border-4 border-slate-700 dark:border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                view === 'files'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] -translate-y-0.5 -translate-x-0.5'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
            >
              Study Files
            </button>
            <button
              onClick={() => setView('metadata')}
              className={`relative border-4 border-slate-700 dark:border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                view === 'metadata'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] -translate-y-0.5 -translate-x-0.5'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
            >
              Metadata
            </button>
            <button
              onClick={() => {
                setView('experiments');
                if (experiments.length === 0) fetchExperiments();
              }}
              className={`relative border-4 border-slate-700 dark:border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                view === 'experiments'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] -translate-y-0.5 -translate-x-0.5'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
            >
              Experiments
            </button>
            <button
              onClick={() => {
                setView('missions');
                if (missions.length === 0) fetchMissions();
              }}
              className={`relative border-4 border-slate-700 dark:border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                view === 'missions'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] -translate-y-0.5 -translate-x-0.5'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
            >
              Missions
            </button>
          </div>

          {view === 'search' && (
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Search Term
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudies()}
                  placeholder="Enter keywords (e.g., mouse, liver, cancer)"
                  className="flex-1 p-2.5 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold"
                />
                <button
                  onClick={searchStudies}
                  disabled={loading}
                  className="relative border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          )}

          {(view === 'files' || view === 'metadata') && (
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Study ID (OSD Number)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={studyId}
                  onChange={(e) => setStudyId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (view === 'files' ? fetchStudyFiles() : fetchStudyMetadata())}
                  placeholder="e.g., 87 or 137"
                  className="flex-1 p-2.5 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold"
                />
                <button
                  onClick={view === 'files' ? fetchStudyFiles : fetchStudyMetadata}
                  disabled={loading}
                  className="relative border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1"
                >
                  {loading ? 'Loading...' : 'Fetch'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="border-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-4 mb-8">
            <strong className="font-bold uppercase tracking-wider">Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
            <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading data...</p>
          </div>
        )}

        {!loading && searchResults && view === 'search' && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Search Results ({
                typeof searchResults.total === 'number' 
                  ? searchResults.total 
                  : (searchResults.total?.value || searchResults.hits?.length || 0)
              })
            </h2>
            {(searchResults.hits?.length > 0) ? (
              <div className="grid gap-4">
                {(searchResults.hits || []).map((result, index) => {
                  const source = result._source || result;
                  const renderValue = (value) => {
                    if (typeof value === 'string') return value;
                    if (Array.isArray(value)) return value.join(', ');
                    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
                    return String(value);
                  };
                  
                  return (
                    <div
                      key={index}
                      className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1"
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {source['Study Title'] || 'Untitled Study'}
                      </h3>
                      <div className="space-y-2 text-sm">
                        {source.Accession && (
                          <p><span className="font-bold">Accession:</span> {renderValue(source.Accession)}</p>
                        )}
                        {source['Study Description'] && (
                          <p><span className="font-bold">Description:</span> {renderValue(source['Study Description'])}</p>
                        )}
                        {source.organism && (
                          <p><span className="font-bold">Organism:</span> {renderValue(source.organism)}</p>
                        )}
                        {source['Project Type'] && (
                          <p><span className="font-bold">Type:</span> {renderValue(source['Project Type'])}</p>
                        )}
                        {source['Study Assay Technology Type'] && (
                          <p><span className="font-bold">Technology:</span> {renderValue(source['Study Assay Technology Type'])}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black">
                <p className="font-bold uppercase tracking-wider text-sm">No results found</p>
              </div>
            )}
          </div>
        )}

        {!loading && studyFiles && view === 'files' && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Study Files ({studyFiles.total_hits || 0} studies)
            </h2>
            {Object.entries(studyFiles.studies || {}).map(([studyKey, studyData]) => (
              <div key={studyKey} className="mb-8">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 dark:border-blue-500 pl-4">
                  {studyKey} ({studyData.file_count} files)
                </h3>
                <div className="grid gap-2">
                  {studyData.study_files?.slice(0, 10).map((file, index) => (
                    <div
                      key={index}
                      className="border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-sm mb-1">{file.file_name}</p>
                          <p className="text-xs opacity-70">{file.category}</p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-bold">{formatFileSize(file.file_size)}</p>
                          {file.remote_url && (
                            <a
                              href={`https://osdr.nasa.gov${file.remote_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {studyData.file_count > 10 && (
                  <p className="text-sm mt-2 text-black/60 dark:text-white/60">
                    Showing 10 of {studyData.file_count} files
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && studyMetadata && view === 'metadata' && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">Study Metadata</h2>
            {Object.entries(studyMetadata.study || {}).map(([studyKey, studyData]) => (
              <div key={studyKey} className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
                <h3 className="text-xl font-bold mb-4">{studyKey}</h3>
                {studyData.studies?.[0] && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2">Title</p>
                      <p>{studyData.studies[0].title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2">Description</p>
                      <p className="text-sm">{studyData.studies[0].description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2">Release Date</p>
                      <p className="text-sm">{studyData.studies[0].publicReleaseDate}</p>
                    </div>
                    {studyData.studies[0].publications?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2">Publications</p>
                        {studyData.studies[0].publications.map((pub, idx) => (
                          <div key={idx} className="mb-2 p-3 border-2 border-slate-700 dark:border-slate-600">
                            <p className="font-bold text-sm">{pub.title}</p>
                            <p className="text-xs mt-1">{pub.authorList}</p>
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                DOI: {pub.doi}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && experiments.length > 0 && view === 'experiments' && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Experiments (Showing {experiments.length})
            </h2>
            <div className="grid gap-4">
              {experiments.map((exp, index) => (
                <div
                  key={index}
                  className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1"
                >
                  <h3 className="text-lg font-bold mb-2">{exp.identifier || 'Unknown'}</h3>
                  {exp.title && <p className="text-sm mb-2">{exp.title}</p>}
                  {exp.startDate && (
                    <p className="text-xs opacity-70">Start: {exp.startDate}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && missions.length > 0 && view === 'missions' && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Missions (Showing {missions.length})
            </h2>
            <div className="grid gap-4">
              {missions.map((mission, index) => (
                <div
                  key={index}
                  className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1"
                >
                  <h3 className="text-lg font-bold mb-2">{mission.identifier || 'Unknown'}</h3>
                  {mission.aliases && mission.aliases.length > 0 && (
                    <p className="text-sm mb-2">Aliases: {mission.aliases.join(', ')}</p>
                  )}
                  <div className="flex gap-4 text-xs opacity-70">
                    {mission.startDate && <p>Start: {mission.startDate}</p>}
                    {mission.endDate && <p>End: {mission.endDate}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

