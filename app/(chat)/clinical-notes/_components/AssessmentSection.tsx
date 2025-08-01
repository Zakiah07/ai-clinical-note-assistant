import { ClipboardList, Stethoscope, AlertTriangle } from 'lucide-react';
import { useTextHighlighting } from './hooks/useTextHighlighting';

interface AssessmentSectionProps {
  assessment?: {
    content: string;
    categories: {
      primaryDiagnosis: string;
      differentialDiagnoses: string;
      riskAssessment: string;
    };
  };
  flaggedWords: string[];
}

export function AssessmentSection({
  assessment,
  flaggedWords,
}: AssessmentSectionProps) {
  const { highlightFlaggedWords } = useTextHighlighting();
  const hasAssessmentData =
    assessment?.categories?.primaryDiagnosis ||
    assessment?.categories?.differentialDiagnoses ||
    assessment?.categories?.riskAssessment;

  const isEmpty =
    !assessment ||
    !assessment.content ||
    assessment.content === 'No assessment data available.' ||
    !hasAssessmentData;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-orange-500">
            <ClipboardList className="size-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-orange-900">Assessment</h3>
        </div>
      </div>
      <div className="p-6">
        {isEmpty ? (
          <div className="text-slate-500 italic text-sm">
            No assessment data available
          </div>
        ) : (
          <div className="space-y-6">
            {assessment?.categories?.primaryDiagnosis && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope className="size-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900 text-sm">
                    Primary Diagnosis
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      assessment.categories.primaryDiagnosis,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {assessment?.categories?.differentialDiagnoses && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClipboardList className="size-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-900 text-sm">
                    Differential Diagnoses
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      assessment.categories.differentialDiagnoses,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {assessment?.categories?.riskAssessment && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="size-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 text-sm">
                    Risk Assessment
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      assessment.categories.riskAssessment,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {/* Fallback for uncategorized content */}
            {!hasAssessmentData && assessment?.content && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <ClipboardList className="size-4 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Assessment Summary
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      assessment.content,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
