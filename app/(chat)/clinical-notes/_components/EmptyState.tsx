import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function EmptyState() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-12 text-center">
        <Brain className="size-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          Ready to Process
        </h3>
        <p className="text-slate-500">
          Enter your session notes and click &quot;Generate Clinical Note&quot;
          to get started.
        </p>
      </CardContent>
    </Card>
  );
}
