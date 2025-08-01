import { FileText } from 'lucide-react';

interface FallbackNoteProps {
  structuredNote: string;
  objective?: {
    content: string;
  };
}

export function FallbackNote({ structuredNote, objective }: FallbackNoteProps) {
  if (
    structuredNote.includes('OBJECTIVE:') ||
    structuredNote.includes('Objective')
  ) {
    return null;
  }

  return (
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
            {objective?.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
