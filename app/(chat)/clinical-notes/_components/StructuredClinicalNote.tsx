'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Activity, ClipboardList, Target, AlertTriangle, Stethoscope, AlertCircle, Clock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StructuredClinicalNoteProps {
  structuredNote: string;
  flaggedWords: string[];
  assessment?: {
    content: string;
    categories: {
      primaryDiagnosis: string;
      differentialDiagnoses: string;
      riskAssessment: string;
    };
  };
  plan?: {
    content: string;
    categories: {
      immediateInterventions: string;
      treatmentRecommendations: string;
      followUpPlan: string;
      safetyMeasures: string;
    };
  };
}

export default function StructuredClinicalNote({ 
  structuredNote, 
  flaggedWords,
  assessment,
  plan
}: StructuredClinicalNoteProps) {
 
  const highlightFlaggedWords = (text: string, flaggedWords: string[]) => {
    if (!flaggedWords || flaggedWords.length === 0) {
      return text;
    }

    let highlightedText = text;
    flaggedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-medium text-sm">${word}</span>`);
    });

    return highlightedText;
  };

  const renderSection = (title: string, content: string, icon: React.ReactNode, borderColor: string, bgColor: string, textColor: string, accentColor: string) => {
    if (!content.trim()) {
      return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden`}>
          <div className={`${bgColor} px-6 py-4 border-b border-slate-200`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${accentColor}`}>
                {icon}
              </div>
              <h3 className={`text-lg font-semibold ${textColor}`}>
                {title}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="text-slate-500 italic text-sm">
              No {title.toLowerCase()} data available
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden`}>
        <div className={`${bgColor} px-6 py-4 border-b border-slate-200`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${accentColor}`}>
              {icon}
            </div>
            <h3 className={`text-lg font-semibold ${textColor}`}>
              {title}
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-5">
            {content.split('- ').map((item, index) => {
              if (item.trim()) {
                const [title, ...contentParts] = item.split(':');
                return (
                  <div key={index} className="space-y-2">
                    <div className={`font-semibold ${textColor} text-sm tracking-wide uppercase`}>
                      {title?.trim()}
                    </div>
                    <div 
                      className="text-slate-700 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{
                        __html: highlightFlaggedWords(contentParts.join(':').trim(), flaggedWords)
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPatientInfoSection = () => {
    const patientInfoContent = extractSectionContent('PATIENT INFORMATION', 'Patient Information');

    return renderSection(
      'Patient Information', 
      patientInfoContent, 
      <User className="size-4 text-white" />,
      'border-indigo-500', 
      'bg-indigo-50', 
      'text-indigo-900', 
      'bg-indigo-500'
    );
  };

  const renderAssessmentSection = () => {
    if (!assessment || !assessment.content || assessment.content === 'No assessment data available.') {
      return renderSection(
        'Assessment',
        '',
        <ClipboardList className="size-4 text-white" />,
        'border-orange-500',
        'bg-orange-50',
        'text-orange-900',
        'bg-orange-500'
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-500">
              <ClipboardList className="size-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900">
              Assessment
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Primary Diagnosis */}
            {assessment.categories.primaryDiagnosis && (
                <>
                <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Stethoscope className="size-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-900 text-sm">Primary Diagnosis</h4>
              </div><div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(assessment.categories.primaryDiagnosis, flaggedWords)
                  }} />
                  </>
            )}

            {/* Differential Diagnoses */}
            {assessment.categories.differentialDiagnoses && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClipboardList className="size-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-900 text-sm">Differential Diagnoses</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(assessment.categories.differentialDiagnoses, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Risk Assessment */}
            {assessment.categories.riskAssessment && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="size-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 text-sm">Risk Assessment</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(assessment.categories.riskAssessment, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Fallback for uncategorized content */}
            {(!assessment.categories.primaryDiagnosis && !assessment.categories.differentialDiagnoses && !assessment.categories.riskAssessment) && assessment.content && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <ClipboardList className="size-4 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">Assessment Summary</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(assessment.content, flaggedWords)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPlanSection = () => {
    if (!plan || !plan.content || plan.content === 'No plan data available.') {
      return renderSection(
        'Plan',
        '',
        <Target className="size-4 text-white" />,
        'border-purple-500',
        'bg-purple-50',
        'text-purple-900',
        'bg-purple-500'
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500">
              <Target className="size-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900">
              Plan
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Immediate Interventions */}
            {plan.categories.immediateInterventions && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="size-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 text-sm">Immediate Interventions</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.categories.immediateInterventions, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Treatment Recommendations */}
            {plan.categories.treatmentRecommendations && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="size-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900 text-sm">Treatment Recommendations</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.categories.treatmentRecommendations, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Follow-up Plan */}
            {plan.categories.followUpPlan && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="size-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900 text-sm">Follow-up Plan</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.categories.followUpPlan, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Safety Measures */}
            {plan.categories.safetyMeasures && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="size-4 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-orange-900 text-sm">Safety Measures</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.categories.safetyMeasures, flaggedWords)
                  }}
                />
              </div>
            )}

            {/* Fallback for uncategorized content */}
            {(!plan.categories.immediateInterventions && !plan.categories.treatmentRecommendations && !plan.categories.followUpPlan && !plan.categories.safetyMeasures) && plan.content && (
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Target className="size-4 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">Treatment Plan Summary</h4>
                </div>
                <div 
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.content, flaggedWords)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const extractSectionContent = (sectionName: string, fallbackSectionName?: string) => {
    let content = '';
    if (structuredNote.includes(sectionName.toUpperCase() + ':')) {
      content = structuredNote.split(sectionName.toUpperCase() + ':')[1]?.split('OBJECTIVE:')[0] || 
                structuredNote.split(sectionName.toUpperCase() + ':')[1]?.split('ASSESSMENT:')[0] || 
                structuredNote.split(sectionName.toUpperCase() + ':')[1]?.split('PLAN:')[0] || '';
    } else if (structuredNote.includes(sectionName + ':')) {
      content = structuredNote.split(sectionName + ':')[1]?.split('Objective:')[0] || 
                structuredNote.split(sectionName + ':')[1]?.split('Assessment:')[0] || 
                structuredNote.split(sectionName + ':')[1]?.split('Plan:')[0] || '';
    } else if (fallbackSectionName && structuredNote.includes(fallbackSectionName)) {
      content = structuredNote.split(fallbackSectionName)[1]?.split('Objective')[0] || 
                structuredNote.split(fallbackSectionName)[1]?.split('Assessment')[0] || 
                structuredNote.split(fallbackSectionName)[1]?.split('Plan')[0] || '';
    }
    return content.trim();
  };

  const objectiveContent = extractSectionContent('OBJECTIVE', 'Objective');

  return (
    <Card className="border-0 shadow-lg bg-slate-50">
      <CardHeader className="bg-white border-b border-slate-200 px-8 py-6">
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xl font-semibold">Structured Clinical Note</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">SOAP Format</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ScrollArea className="h-[500px]">
          <div className="space-y-6">
            {/* Patient Information - Now with demographics */}
            {renderPatientInfoSection()}

            {/* SOAP Format Sections */}
            <div className="space-y-6">
              {/* Objective */}
              {renderSection(
                'Objective', 
                objectiveContent, 
                <Activity className="size-4 text-white" />,
                'border-green-500', 
                'bg-green-50', 
                'text-green-900', 
                'bg-green-500'
              )}

              {/* Assessment - Now using categorized data */}
              {renderAssessmentSection()}

              {/* Plan - Now using categorized data */}
              {renderPlanSection()}
            </div>

            {!structuredNote.includes('OBJECTIVE:') && !structuredNote.includes('Objective') && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-500">
                      <FileText className="size-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Clinical Note
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <pre className="whitespace-pre-wrap font-sans">
                      {structuredNote}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with metadata */}
            <div className="border-t border-slate-200 pt-6 mt-8">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-2">
                  <div className="size-2 bg-blue-500 rounded-full"></div>
                  <span>Generated by AI Clinical Assistant</span>
                </span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 