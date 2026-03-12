'use client';

import { useState } from 'react';
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

export default function Home() {
  const [question, setQuestion] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('diagnosis');

  const runDiagnosis = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/agents/diagnose`, {
        question: question,
      }, {
        params: { patient_context: patientContext }
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to connect to MediAgent API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-mono">

      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">M</div>
          <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">MediAgent</span>
          <span className="text-gray-600 text-xs ml-2">v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-xs">All Systems Online</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="mb-10">
          <p className="text-emerald-400 text-xs tracking-widest uppercase mb-2">AI-Powered Medical Intelligence</p>
          <h1 className="text-4xl font-bold text-white mb-3">
            Clinical Decision <span className="text-emerald-400">Support</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Multi-agent RAG system — Record Agent → Literature Agent → Risk Agent → Supervisor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-xs text-emerald-400 uppercase tracking-widest mb-3 block">
              Clinical Question
            </label>
            <textarea
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-4 text-gray-100 text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors"
              rows={4}
              placeholder="e.g. What is the best treatment for hypertension in a diabetic patient?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-xs text-emerald-400 uppercase tracking-widest mb-3 block">
              Patient Context
            </label>
            <textarea
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-4 text-gray-100 text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors"
              rows={4}
              placeholder="e.g. 58 year old male, diabetic, on Metformin 500mg, BP 145/95, no known allergies"
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={runDiagnosis}
          disabled={loading || !question.trim()}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-4 rounded-xl transition-all text-sm tracking-widest uppercase mb-8"
        >
          {loading ? '⟳ Running Multi-Agent Pipeline...' : '▶ Run MediAgent Diagnosis'}
        </button>

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-xs text-emerald-400 uppercase tracking-widest mb-4">Agent Pipeline Status</p>
            <div className="space-y-3">
              {['Record Agent — Analyzing patient data...', 'Literature Agent — Searching medical documents...', 'Risk Agent — Checking drug interactions...', 'Supervisor Agent — Generating final report...'].map((agent, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">{agent}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            <div className="flex border-b border-gray-800">
              {[
                { id: 'diagnosis', label: 'Final Diagnosis' },
                { id: 'record', label: 'Record Summary' },
                { id: 'literature', label: 'Literature' },
                { id: 'risks', label: 'Risk Alerts' },
                { id: 'sources', label: 'Sources' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-950'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'diagnosis' && (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                    {result.final_answer}
                  </pre>
                </div>
              )}
              {activeTab === 'record' && (
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                  {result.record_summary}
                </pre>
              )}
              {activeTab === 'literature' && (
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                  {result.literature_summary}
                </pre>
              )}
              {activeTab === 'risks' && (
                <div className="space-y-3">
                  {result.risk_alerts?.map((alert, i) => (
                    <div key={i} className="bg-red-950 border border-red-900 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-red-300 font-mono">{alert}</pre>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'sources' && (
                <div className="space-y-2">
                  {result.sources?.length > 0 ? result.sources.map((source, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg p-3">
                      <span className="text-emerald-400">📄</span>
                      <span className="text-sm text-gray-300">{source}</span>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm">No external sources cited.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
