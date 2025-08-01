import { Activity } from 'lucide-react';
import { useTextHighlighting } from './hooks/useTextHighlighting';

interface ObjectiveSectionProps {
  objective?: {
    content: string;
    categories: {
      mentalStatusExam: string;
      physicalObservations: string;
      behavioralObservations: string;
    };
  };
  flaggedWords: string[];
}

export function ObjectiveSection({
  objective,
  flaggedWords,
}: ObjectiveSectionProps) {
  const { highlightFlaggedWords } = useTextHighlighting();
  const hasObjectiveData =
    objective?.categories?.mentalStatusExam ||
    objective?.categories?.physicalObservations ||
    objective?.categories?.behavioralObservations;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-green-500">
            <Activity className="size-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-900">Objective</h3>
        </div>
      </div>
      <div className="p-6">
        {!hasObjectiveData ? (
          <div className="text-slate-500 italic text-sm">
            No objective data available
          </div>
        ) : (
          <div className="space-y-6">
            {objective?.categories?.mentalStatusExam && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="size-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900 text-sm">
                    Mental Status Exam
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      objective.categories.mentalStatusExam,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {objective?.categories?.physicalObservations && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="size-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-900 text-sm">
                    Physical Observations
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      objective.categories.physicalObservations,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {objective?.categories?.behavioralObservations && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="size-4 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-orange-900 text-sm">
                    Behavioral Observations
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      objective.categories.behavioralObservations,
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
