'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useTextHighlighting } from './hooks/useTextHighlighting';

interface SessionSummaryProps {
  sessionSummary: string;
  flaggedWords: string[];
}

export default function SessionSummary({
  sessionSummary,
  flaggedWords,
}: SessionSummaryProps) {
  const { highlightFlaggedWords } = useTextHighlighting();

  if (!sessionSummary) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-4">
        <CardTitle className="flex items-center space-x-3 text-green-900">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="size-5 text-green-600" />
          </div>
          <div>
            <span className="text-lg font-semibold">Session Summary</span>
            <p className="text-sm text-green-700 font-medium">
              Key Clinical Findings & Observations
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 text-sm mb-2">
              Clinical Summary
            </h4>
            <div
              className="text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightFlaggedWords(sessionSummary, flaggedWords),
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
