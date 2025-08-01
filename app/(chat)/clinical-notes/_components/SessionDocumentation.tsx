'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, MessageSquare, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SessionDocumentationProps {
  sessionInput: string;
  setSessionInput: (value: string) => void;
  patientId: string;
  isProcessing: boolean;
  onProcessSession: () => void;
}

export default function SessionDocumentation({
  sessionInput,
  setSessionInput,
  patientId,
  isProcessing,
  onProcessSession,
}: SessionDocumentationProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center space-x-2 text-slate-800">
          <MessageSquare className="size-5 text-blue-600" />
          <span>Session Documentation</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <span>Patient ID: {patientId}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="size-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-slate-400 mb-2">
              Session Notes & Observations
            </Label>
            <Textarea
              placeholder="Enter your session notes, patient observations, symptoms discussed, interventions used, patient responses, and any other relevant clinical information..."
              value={sessionInput}
              onChange={(e) => setSessionInput(e.target.value)}
              className="min-h-[300px] md:min-h-[500px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={onProcessSession}
            disabled={!sessionInput.trim() || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full size-4 border-b-2 border-white mr-2" />
                Processing Session...
              </>
            ) : (
              <>
                <Brain className="size-4 mr-2" />
                Generate Clinical Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
