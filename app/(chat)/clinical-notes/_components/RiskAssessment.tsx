'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, CheckCircle } from 'lucide-react';

interface RiskFlag {
  type: 'high' | 'medium' | 'low' | 'none';
  category: string;
  description: string;
}

interface RiskAssessmentProps {
  riskFlags: RiskFlag[];
}

export default function RiskAssessment({ riskFlags }: RiskAssessmentProps) {
  const getRiskConfig = (type: string) => {
    switch (type) {
      case 'high':
        return {
          colors: 'bg-red-50 border-red-200 text-red-900',
          badgeColors: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertTriangle className="size-4 text-red-600" />,
          headerColors: 'bg-red-50 border-red-200'
        };
      case 'medium':
        return {
          colors: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          badgeColors: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <AlertTriangle className="size-4 text-yellow-600" />,
          headerColors: 'bg-yellow-50 border-yellow-200'
        };
      case 'low':
        return {
          colors: 'bg-blue-50 border-blue-200 text-blue-900',
          badgeColors: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Activity className="size-4 text-blue-600" />,
          headerColors: 'bg-blue-50 border-blue-200'
        };
      case 'none':
        return {
          colors: 'bg-green-50 border-green-200 text-green-900',
          badgeColors: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="size-4 text-green-600" />,
          headerColors: 'bg-green-50 border-green-200'
        };
      default:
        return {
          colors: 'bg-gray-50 border-gray-200 text-gray-900',
          badgeColors: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <Shield className="size-4 text-gray-600" />,
          headerColors: 'bg-gray-50 border-gray-200'
        };
    }
  };

  if (!riskFlags || riskFlags.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 px-6 py-4">
        <CardTitle className="flex items-center space-x-3 text-red-900">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="size-5 text-red-600" />
          </div>
          <div>
            <span className="text-lg font-semibold">Risk Assessment</span>
            <p className="text-sm text-red-700 font-medium">Safety & Clinical Risk Evaluation</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-4">
          {riskFlags.map((flag, index) => {
            const config = getRiskConfig(flag.type);
            return (
              <div
                key={index}
                className="p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/60 rounded-lg">
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{flag.category}</h4>
                      <p className="text-xs opacity-75">Risk Category</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${config.badgeColors} font-medium text-xs px-3 py-1`}
                  >
                    {flag.type.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  {flag.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 