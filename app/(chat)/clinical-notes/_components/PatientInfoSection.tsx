import { User } from 'lucide-react';
import { useTextHighlighting } from './hooks/useTextHighlighting';

interface PatientInfoSectionProps {
  structuredNote: string;
  flaggedWords: string[];
}

function extractSectionContent(
  structuredNote: string,
  sectionName: string,
  fallbackSectionName?: string,
) {
  let content = '';
  if (structuredNote.includes(`${sectionName.toUpperCase()}:`)) {
    content =
      structuredNote
        .split(`${sectionName.toUpperCase()}:`)[1]
        ?.split('OBJECTIVE:')[0] ||
      structuredNote
        .split(`${sectionName.toUpperCase()}:`)[1]
        ?.split('ASSESSMENT:')[0] ||
      structuredNote
        .split(`${sectionName.toUpperCase()}:`)[1]
        ?.split('PLAN:')[0] ||
      '';
  } else if (structuredNote.includes(`${sectionName}:`)) {
    content =
      structuredNote.split(`${sectionName}:`)[1]?.split('Objective:')[0] ||
      structuredNote.split(`${sectionName}:`)[1]?.split('Assessment:')[0] ||
      structuredNote.split(`${sectionName}:`)[1]?.split('Plan:')[0] ||
      '';
  } else if (
    fallbackSectionName &&
    structuredNote.includes(fallbackSectionName)
  ) {
    content =
      structuredNote.split(fallbackSectionName)[1]?.split('Objective')[0] ||
      structuredNote.split(fallbackSectionName)[1]?.split('Assessment')[0] ||
      structuredNote.split(fallbackSectionName)[1]?.split('Plan')[0] ||
      '';
  }
  return content.trim();
}

export function PatientInfoSection({
  structuredNote,
  flaggedWords,
}: PatientInfoSectionProps) {
  const { highlightFlaggedWords } = useTextHighlighting();
  const patientInfoContent = extractSectionContent(
    structuredNote,
    'PATIENT INFORMATION',
    'Patient Information',
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-indigo-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500">
            <User className="size-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-indigo-900">
            Patient Information
          </h3>
        </div>
      </div>
      <div className="p-6">
        {!patientInfoContent ? (
          <div className="text-slate-500 italic text-sm">
            No patient information data available
          </div>
        ) : (
          <div className="space-y-5">
            {patientInfoContent.split('- ').map((item, index) => {
              if (item.trim()) {
                const [title, ...contentParts] = item.split(':');
                const itemKey = `${title?.trim()}-${contentParts.join()}`;
                return (
                  <div key={itemKey} className="space-y-2">
                    <div className="font-semibold text-indigo-900 text-sm tracking-wide uppercase">
                      {title?.trim()}
                    </div>
                    <div
                      className="text-slate-700 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{
                        __html: highlightFlaggedWords(
                          contentParts.join(':').trim(),
                          flaggedWords,
                        ),
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
