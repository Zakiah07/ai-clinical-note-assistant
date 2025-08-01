import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function EmptyState() {
  return (
    <Card className="border-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-800 transition-colors duration-200">
      <CardContent className="p-12 text-center">
        <Brain className="size-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 transition-colors duration-200" />
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2 transition-colors duration-200">
          Ready to Process
        </h3>
        <p className="text-slate-500 dark:text-slate-400 transition-colors duration-200">
          Enter your session notes and click &quot;Generate Clinical Note&quot;
          to get started.
        </p>
      </CardContent>
    </Card>
  );
}
