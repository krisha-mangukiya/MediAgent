'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface DiagnosisResult {
  question: string;
  final_answer: string;
  sources: string[];
  record_summary: string;
  literature_summary: string;
  risk_alerts: string[];
}

const SAMPLE_PATIENTS = [
  { id: 1, name: 'John Mitchell', age: 58, condition: 'Hypertension + Diabetes', bp: '145/95', medications: 'Metformin 500mg' },
  { id: 2, name: 'Sarah Chen', age: 45, condition: 'Hypertensive Crisis', bp: '185/120', medications: 'Amlodipine 5mg' },
  { id: 3, name: 'Robert Patel', age: 67, condition: 'Stage 2 Hypertension', bp: '155/98', medications: 'Lisinopril 10mg' },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [question, setQuestion] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [activePage, setActivePage] = useState('diagnosis');
  const [selectedPatient, setSelectedPatient] = useState<typeof SAMPLE_PATIENTS[0] | null>(null);
  const [agentStep, setAgentStep] = useState(0);

  const d = darkMode;

  useEffect(() => {
    if (loading) {
      const timers = [1, 2, 3, 4].map((step, i) =>
        setTimeout(() => setAgentStep(step), i * 8000)
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setAgentStep(0);
    }
  }, [loading]);

  const runDiagnosis = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/agents/diagnose`, { question }, {
        params: { patient_context: patientContext }
      });
      setResult(response.data);
    } catch {
      setError('Failed to connect to MediAgent API. Make sure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const loadPatient = (patient: typeof SAMPLE_PATIENTS[0]) => {
    setSelectedPatient(patient);
    setPatientContext(`Patient: ${patient.name}, ${patient.age} year old, Condition: ${patient.condition}, BP: ${patient.bp}, Medications: ${patient.medications}`);
    setActivePage('diagnosis');
  };

  const t = {
    bg: d ? 'bg-slate-950' : 'bg-slate-50',
    sidebar: d ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    card: d ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    text: d ? 'text-slate-100' : 'text-slate-800',
    muted: d ? 'text-slate-400' : 'text-slate-500',
    divider: d ? 'border-slate-800' : 'border-slate-200',
    input: d ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500',
    navActive: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20',
    navInactive: d ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100',
    tabActive: d ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-blue-500 text-blue-600 bg-blue-50',
    tabInactive: d ? 'border-transparent text-slate-500 hover:text-slate-300' : 'border-transparent text-slate-500 hover:text-slate-700',
    codeBg: d ? 'bg-slate-950' : 'bg-slate-50',
    badge: (color: string) => {
      const map: Record<string, string> = {
        blue: d ? 'bg-blue-950 text-blue-400 border-blue-900' : 'bg-blue-50 text-blue-600 border-blue-200',
        emerald: d ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
        violet: d ? 'bg-violet-950 text-violet-400 border-violet-900' : 'bg-violet-50 text-violet-600 border-violet-200',
        amber: d ? 'bg-amber-950 text-amber-400 border-amber-900' : 'bg-amber-50 text-amber-600 border-amber-200',
        red: d ? 'bg-red-950 text-red-400 border-red-900' : 'bg-red-50 text-red-700 border-red-200',
      };
      return map[color] || map.blue;
    }
  };

  const agents = [
    { icon: '📋', name: 'Record Agent', desc: 'Analyzes patient data' },
    { icon: '📚', name: 'Literature Agent', desc: 'Searches medical RAG' },
    { icon: '⚠️', name: 'Risk Agent', desc: 'Flags drug interactions' },
    { icon: '🧠', name: 'Supervisor Agent', desc: 'Generates final report' },
  ];

  const navItems = [
    { id: 'diagnosis', icon: '🩺', label: 'Diagnosis' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'history', icon: '📊', label: 'History' },
    { id: 'documents', icon: '📁', label: 'Documents' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className={`${t.bg} min-h-screen flex ${t.text}`} style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside className={`w-64 ${t.sidebar} border-r flex flex-col fixed h-full z-20`}>

        {/* Logo */}
        <div className={`px-5 py-5 border-b ${t.divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <p className={`font-bold ${t.text}`}>MediAgent</p>
              <p className={`text-xs ${t.muted}`}>Clinical AI Platform</p>
            </div>
          </div>
        </div>

        {/* Online status */}
        <div className="px-4 pt-4">
          <div className={`px-3 py-2.5 rounded-xl border ${t.badge('emerald')} flex items-center gap-2`}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold">Llama 3.1 · RTX 4060</p>
              <p className="text-xs opacity-70">All systems operational</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 mt-5 flex-1 space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-widest ${t.muted} px-3 mb-2`}>Navigation</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === item.id ? t.navActive : t.navInactive}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-4">
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.muted} px-3 mb-2`}>AI Agents</p>
            {agents.map((agent, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 ${d ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors cursor-default`}>
                <span className="text-sm w-6 text-center">{agent.icon}</span>
                <div>
                  <p className={`text-xs font-semibold ${t.text}`}>{agent.name}</p>
                  <p className={`text-xs ${t.muted}`}>{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Dark mode toggle */}
        <div className={`px-4 py-4 border-t ${t.divider}`}>
          <button
            onClick={() => setDarkMode(!d)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${d ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            <span>{d ? '🌙  Dark Mode' : '☀️  Light Mode'}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${d ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${d ? 'left-5' : 'left-0.5'}`}/>
            </div>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-64 flex-1 flex flex-col">

        {/* Header */}
        <header className={`${t.card} border-b ${t.divider} px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur`}>
          <div>
            <h1 className={`text-lg font-bold ${t.text}`}>
              {navItems.find(n => n.id === activePage)?.icon}{' '}
              {navItems.find(n => n.id === activePage)?.label}
            </h1>
            <p className={`text-xs ${t.muted}`}>
              {activePage === 'diagnosis' && 'Multi-agent RAG clinical decision support'}
              {activePage === 'patients' && 'Load a patient profile to pre-fill diagnosis'}
              {activePage === 'history' && 'Past diagnoses and clinical reports'}
              {activePage === 'documents' && 'RAG knowledge base management'}
              {activePage === 'settings' && 'System configuration and status'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedPatient && activePage === 'diagnosis' && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${t.badge('blue')}`}>
                <span>👤</span>
                <span className="font-semibold">{selectedPatient.name}</span>
                <button onClick={() => { setSelectedPatient(null); setPatientContext(''); }} className="opacity-60 hover:opacity-100 ml-1">✕</button>
              </div>
            )}
            <div className={`text-xs px-3 py-1.5 rounded-lg font-mono ${d ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>v1.0.0</div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">

          {/* ── DIAGNOSIS PAGE ── */}
          {activePage === 'diagnosis' && (
            <div className="max-w-5xl mx-auto space-y-5">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'AI Model', value: 'Llama 3.1 8B', icon: '🤖', color: 'blue' },
                  { label: 'Vector DB', value: 'ChromaDB', icon: '🗄️', color: 'violet' },
                  { label: 'Knowledge', value: '1 Document', icon: '📄', color: 'emerald' },
                  { label: 'Hardware', value: 'RTX 4060', icon: '⚡', color: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className={`${t.card} border rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{stat.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${t.badge(stat.color)}`}>Active</span>
                    </div>
                    <p className={`font-bold text-sm ${t.text}`}>{stat.value}</p>
                    <p className={`text-xs ${t.muted}`}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-5">
                <div className={`${t.card} border rounded-xl p-5`}>
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3 block">Clinical Question</label>
                  <textarea
                    className={`w-full ${t.input} border rounded-xl p-4 text-sm resize-none focus:outline-none transition-colors`}
                    rows={5}
                    placeholder="e.g. What is the best treatment for hypertension in a diabetic patient?"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                  />
                </div>
                <div className={`${t.card} border rounded-xl p-5`}>
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3 block">Patient Context</label>
                  <textarea
                    className={`w-full ${t.input} border rounded-xl p-4 text-sm resize-none focus:outline-none transition-colors`}
                    rows={5}
                    placeholder="e.g. 58 year old male, diabetic, on Metformin 500mg, BP 145/95..."
                    value={patientContext}
                    onChange={e => setPatientContext(e.target.value)}
                  />
                </div>
              </div>

              {/* Run button */}
              <button
                onClick={runDiagnosis}
                disabled={loading || !question.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Running Multi-Agent Pipeline...
                  </>
                ) : '▶  Run MediAgent Diagnosis'}
              </button>

              {/* Agent progress */}
              {loading && (
                <div className={`${t.card} border rounded-xl p-5`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4">Agent Pipeline</p>
                  <div className="space-y-3">
                    {agents.map((agent, i) => {
                      const done = agentStep > i;
                      const active = agentStep === i;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition-all
                            ${done ? t.badge('emerald') : active ? t.badge('blue') : (d ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400')}`}>
                            {done ? '✓' : agent.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className={`text-sm font-semibold ${done || active ? t.text : t.muted}`}>{agent.name}</p>
                              <span className={`text-xs font-medium ${done ? 'text-emerald-500' : active ? 'text-blue-500' : t.muted}`}>
                                {done ? '✓ Complete' : active ? '⟳ Running...' : 'Waiting'}
                              </span>
                            </div>
                            <p className={`text-xs ${t.muted}`}>{agent.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className={`border rounded-xl p-4 text-sm ${t.badge('red')}`}>⚠️ {error}</div>
              )}

              {/* Results */}
              {result && (
                <div className={`${t.card} border rounded-xl overflow-hidden`}>
                  <div className={`border-b ${t.divider} flex overflow-x-auto`}>
                    {[
                      { id: 'diagnosis', label: '🩺 Final Diagnosis' },
                      { id: 'record', label: '📋 Record Summary' },
                      { id: 'literature', label: '📚 Literature' },
                      { id: 'risks', label: '⚠️ Risk Alerts' },
                      { id: 'sources', label: '📄 Sources' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? t.tabActive : t.tabInactive}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-6">
                    {activeTab === 'diagnosis' && (
                      <div className={`${t.codeBg} rounded-xl p-5`}>
                        <pre className={`whitespace-pre-wrap text-sm leading-7 ${t.text}`} style={{ fontFamily: 'system-ui, sans-serif' }}>{result.final_answer}</pre>
                      </div>
                    )}
                    {activeTab === 'record' && (
                      <pre className={`whitespace-pre-wrap text-sm leading-7 ${t.text}`} style={{ fontFamily: 'system-ui, sans-serif' }}>{result.record_summary}</pre>
                    )}
                    {activeTab === 'literature' && (
                      <pre className={`whitespace-pre-wrap text-sm leading-7 ${t.text}`} style={{ fontFamily: 'system-ui, sans-serif' }}>{result.literature_summary}</pre>
                    )}
                    {activeTab === 'risks' && (
                      <div className="space-y-3">
                        {result.risk_alerts?.map((alert, i) => (
                          <div key={i} className={`border rounded-xl p-4 ${t.badge('red')}`}>
                            <pre className="whitespace-pre-wrap text-sm leading-6" style={{ fontFamily: 'system-ui, sans-serif' }}>{alert}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === 'sources' && (
                      <div className="space-y-2">
                        {result.sources?.length > 0 ? result.sources.map((source, i) => (
                          <div key={i} className={`flex items-center gap-3 border rounded-xl p-3 ${d ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <span className="text-blue-500 text-xl">📄</span>
                            <span className={`text-sm font-medium ${t.text}`}>{source}</span>
                          </div>
                        )) : <p className={`text-sm ${t.muted}`}>No external sources cited.</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PATIENTS PAGE ── */}
          {activePage === 'patients' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <p className={`text-sm ${t.muted} mb-4`}>Click a patient to load their profile into the diagnosis form.</p>
              {SAMPLE_PATIENTS.map(patient => (
                <div key={patient.id} className={`${t.card} border rounded-xl p-6 flex items-center justify-between hover:border-blue-500 transition-all group`}>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className={`font-semibold ${t.text}`}>{patient.name}</p>
                      <p className={`text-sm ${t.muted}`}>{patient.age} years old • {patient.condition}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${t.badge('blue')}`}>BP: {patient.bp}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${d ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{patient.medications}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => loadPatient(patient)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 opacity-0 group-hover:opacity-100"
                  >
                    Load & Diagnose →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── HISTORY PAGE ── */}
          {activePage === 'history' && (
            <div className="max-w-5xl mx-auto">
              <div className={`${t.card} border rounded-2xl p-12 text-center`}>
                <p className="text-5xl mb-4">📊</p>
                <p className={`font-bold text-lg ${t.text} mb-2`}>Query History</p>
                <p className={`text-sm ${t.muted} max-w-sm mx-auto`}>Coming in Phase 3 — PostgreSQL integration will store all past diagnoses, timestamps, and doctor feedback here.</p>
              </div>
            </div>
          )}

          {/* ── DOCUMENTS PAGE ── */}
          {activePage === 'documents' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <p className={`text-sm ${t.muted}`}>Medical documents loaded into the RAG knowledge base.</p>
              <div className={`${t.card} border rounded-xl p-5 flex items-center gap-4`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${t.badge('blue')}`}>📄</div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${t.text}`}>hypertension_guide.txt</p>
                  <p className={`text-xs ${t.muted}`}>data/medical_docs/ • 6 chunks • Embedded on RTX 4060 GPU</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${t.badge('emerald')}`}>✓ Active</span>
              </div>
              <div className={`${t.card} border border-dashed rounded-xl p-8 text-center ${d ? 'border-slate-700' : 'border-slate-300'}`}>
                <p className="text-3xl mb-2">➕</p>
                <p className={`text-sm font-medium ${t.text}`}>Add More Documents</p>
                <p className={`text-xs ${t.muted} mt-1`}>Coming in Phase 3 — diabetes, cardiology, oncology clinical guidelines</p>
              </div>
            </div>
          )}

          {/* ── SETTINGS PAGE ── */}
          {activePage === 'settings' && (
            <div className="max-w-5xl mx-auto space-y-3">
              <p className={`text-sm ${t.muted} mb-4`}>Current system configuration.</p>
              {[
                { label: 'AI Model', value: 'llama3.1', desc: 'Running locally via Ollama', icon: '🤖' },
                { label: 'Backend API', value: 'localhost:8000', desc: 'FastAPI with uvicorn', icon: '⚡' },
                { label: 'Vector Store', value: 'ChromaDB', desc: 'Local persistent storage', icon: '🗄️' },
                { label: 'Embeddings', value: 'all-MiniLM-L6-v2', desc: 'Sentence transformers on CUDA', icon: '🧮' },
                { label: 'GPU', value: 'RTX 4060 8GB', desc: 'CUDA 12.4 · PyTorch 2.6', icon: '🖥️' },
                { label: 'Framework', value: 'LangGraph 1.1', desc: 'Multi-agent orchestration', icon: '🔗' },
              ].map((s, i) => (
                <div key={i} className={`${t.card} border rounded-xl p-4 flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${t.badge('blue')}`}>{s.icon}</div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${t.text}`}>{s.label}</p>
                    <p className={`text-xs ${t.muted}`}>{s.desc}</p>
                  </div>
                  <span className={`text-sm font-mono px-3 py-1.5 rounded-lg ${d ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'}`}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
