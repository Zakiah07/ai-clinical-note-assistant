import { Target, AlertCircle, Clock, Shield } from 'lucide-react';
import { useTextHighlighting } from './hooks/useTextHighlighting';

interface PlanSectionProps {
  plan?: {
    content: string;
    categories: {
      immediateInterventions: string;
      treatmentRecommendations: string;
      followUpPlan: string;
      safetyMeasures: string;
    };
  };
  flaggedWords: string[];
}

export function PlanSection({ plan, flaggedWords }: PlanSectionProps) {
  const { highlightFlaggedWords } = useTextHighlighting();
  const hasPlanData =
    plan?.categories?.immediateInterventions ||
    plan?.categories?.treatmentRecommendations ||
    plan?.categories?.followUpPlan ||
    plan?.categories?.safetyMeasures;

  const isEmpty =
    !plan ||
    !plan.content ||
    plan.content === 'No plan data available.' ||
    !hasPlanData;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500">
            <Target className="size-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900">Plan</h3>
        </div>
      </div>
      <div className="p-6">
        {isEmpty ? (
          <div className="text-slate-500 italic text-sm">
            No plan data available
          </div>
        ) : (
          <div className="space-y-6">
            {plan?.categories?.immediateInterventions && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="size-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 text-sm">
                    Immediate Interventions
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      plan.categories.immediateInterventions,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {plan?.categories?.treatmentRecommendations && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="size-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900 text-sm">
                    Treatment Recommendations
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      plan.categories.treatmentRecommendations,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {plan?.categories?.followUpPlan && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="size-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900 text-sm">
                    Follow-up Plan
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      plan.categories.followUpPlan,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {plan?.categories?.safetyMeasures && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="size-4 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-orange-900 text-sm">
                    Safety Measures
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(
                      plan.categories.safetyMeasures,
                      flaggedWords,
                    ),
                  }}
                />
              </div>
            )}

            {/* Fallback for uncategorized content */}
            {!hasPlanData && plan?.content && (
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Target className="size-4 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Treatment Plan Summary
                  </h4>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightFlaggedWords(plan.content, flaggedWords),
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
