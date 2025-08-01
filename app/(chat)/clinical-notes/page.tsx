'use client';

import { useState } from 'react';
import { User, Stethoscope } from 'lucide-react';
import SessionDocumentation from './_components/SessionDocumentation';
import RiskAssessment from './_components/RiskAssessment';
import StructuredClinicalNote from './_components/StructuredClinicalNote';
import KeyFindings from './_components/KeyFindings';
import SessionSummary from './_components/SessionSummary';
import FollowUpQuestions from './_components/FollowUpQuestions';
import EmptyState from './_components/EmptyState';

interface ClinicalNote {
  structuredNote: string;
  riskFlags: Array<{
    type: 'high' | 'medium' | 'low' | 'none';
    category: string;
    description: string;
  }>;
  sessionSummary: string;
  keySymptoms: string[];
  diagnoses: string[];
  followUpQuestions: string[];
  flaggedWords: string[];
  objective: {
    content: string;
    categories: {
      mentalStatusExam: string;
      physicalObservations: string;
      behavioralObservations: string;
    };
  };
  assessment: {
    content: string;
    categories: {
      primaryDiagnosis: string;
      differentialDiagnoses: string;
      riskAssessment: string;
    };
  };
  plan: {
    content: string;
    categories: {
      immediateInterventions: string;
      treatmentRecommendations: string;
      followUpPlan: string;
      safetyMeasures: string;
    };
  };
}

export default function ClinicalNotesApp() {
  const [sessionInput, setSessionInput] = useState('');
  const [patientId] = useState('P20241201000000'); // Static ID to prevent hydration issues
  const [isProcessing, setIsProcessing] = useState(false);
  const [clinicalNote, setClinicalNote] = useState<ClinicalNote | null>(null);

  const processSession = async () => {
    if (!sessionInput.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/process-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionInput,
          patientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process session');
      }

      const data = await response.json();
      setClinicalNote(data);
    } catch (error) {
      console.error('Error processing session:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Stethoscope className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Clinical Notes Assistant
                </h1>
                <p className="text-sm text-slate-600">
                  AI-Powered Clinical Documentation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <User className="size-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Patient ID: {patientId}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <SessionDocumentation
              sessionInput={sessionInput}
              setSessionInput={setSessionInput}
              patientId={patientId}
              isProcessing={isProcessing}
              onProcessSession={processSession}
            />
          </div>
          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {clinicalNote ? (
              <>
                <RiskAssessment riskFlags={clinicalNote.riskFlags} />
                <KeyFindings
                  keySymptoms={clinicalNote.keySymptoms}
                  diagnoses={clinicalNote.diagnoses}
                />
                <SessionSummary
                  sessionSummary={clinicalNote.sessionSummary}
                  flaggedWords={clinicalNote.flaggedWords}
                />
                <StructuredClinicalNote
                  structuredNote={clinicalNote.structuredNote}
                  flaggedWords={clinicalNote.flaggedWords}
                  objective={clinicalNote.objective}
                  assessment={clinicalNote.assessment}
                  plan={clinicalNote.plan}
                />
                <FollowUpQuestions
                  followUpQuestions={clinicalNote.followUpQuestions}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
