'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Stethoscope } from 'lucide-react';

interface KeyFindingsProps {
  keySymptoms: string[];
  diagnoses: string[];
}

export default function KeyFindings({
  keySymptoms,
  diagnoses,
}: KeyFindingsProps) {
  if (
    (!keySymptoms || keySymptoms.length === 0) &&
    (!diagnoses || diagnoses.length === 0)
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {keySymptoms && keySymptoms.length > 0 && (
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-4">
            <CardTitle className="flex items-center space-x-3 text-orange-900">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="size-5 text-orange-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">Key Symptoms</span>
                <p className="text-sm text-orange-700 font-medium">
                  Clinical Presentation
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {keySymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 font-medium px-3 py-1"
                  >
                    {symptom}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {diagnoses && diagnoses.length > 0 && (
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200 px-6 py-4">
            <CardTitle className="flex items-center space-x-3 text-purple-900">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="size-5 text-purple-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">
                  Clinical Diagnoses
                </span>
                <p className="text-sm text-purple-700 font-medium">
                  Assessment & Evaluation
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis} className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 font-medium px-3 py-1"
                  >
                    {diagnosis}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
