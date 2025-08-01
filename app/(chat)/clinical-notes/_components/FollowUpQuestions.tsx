'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface FollowUpQuestionsProps {
  followUpQuestions: string[];
}

export default function FollowUpQuestions({
  followUpQuestions,
}: FollowUpQuestionsProps) {
  if (!followUpQuestions || followUpQuestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-4">
        <CardTitle className="flex items-center space-x-3 text-blue-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="size-5 text-blue-600" />
          </div>
          <div>
            <span className="text-lg font-semibold">Follow-up Questions</span>
            <p className="text-sm text-blue-700 font-medium">
              Clinical Assessment & Next Steps
            </p>
            <div className="text-xs text-slate-500">
              Consider these questions for comprehensive clinical assessment
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {followUpQuestions.map((question) => (
            <div
              key={question}
              className="border border-blue-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex space-x-4 items-center">
                <div className="shrink-0">
                  <div className="size-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {followUpQuestions.indexOf(question) + 1}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium items-center">
                  {question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
