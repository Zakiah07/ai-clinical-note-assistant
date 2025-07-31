import { type NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { xai } from '@ai-sdk/xai';

export async function POST(req: NextRequest) {
  try {
    const { sessionInput, patientId } = await req.json();

    if (!sessionInput || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionInput and patientId' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: xai('grok-2-vision-1212'),
      system: `You are an expert clinical psychologist and psychiatrist assistant. Your role is to help clinicians create structured, professional clinical notes from session observations.

CRITICAL SAFETY REQUIREMENTS:
- Always perform thorough risk assessment for suicide, self-harm, violence, or other safety concerns
- Flag ANY mention of suicidal ideation, self-harm, violence, substance abuse, or crisis situations
- Use clinical terminology and maintain professional standards
- Follow SOAP note format when appropriate

IMPORTANT: Return your response as a clean, properly formatted clinical note without any asterisks, bold formatting, or special characters. Structure it as follows:

SESSION SUMMARY:
Provide a concise 2-3 sentence summary of the key clinical findings, risk factors, and immediate concerns from this session.

PATIENT INFORMATION:
- Gender: [patient's gender]
- Age: [patient's age]
- Present Illness History: [detailed description of current symptoms and their timeline]
- Past Psychiatric History: [previous mental health diagnoses, treatments, hospitalizations]
- Past Medical History: [relevant medical conditions, medications, surgeries]
- Family History: [mental health history in family members]
- Social History: [occupation, living situation, relationships, substance use]

OBJECTIVE:
- Mental Status Exam: [ONLY observable MSE findings - appearance, behavior, mood, affect, speech, thought process, thought content, perception, cognition, insight]
- Physical Observations: [ONLY physical observations - appearance, vital signs if noted, physical signs]
- Behavioral Observations: [ONLY observed behaviors during session - what you saw/heard, not interpretations]

CRITICAL: OBJECTIVE section should contain ONLY observable facts and findings. DO NOT include:
- Diagnoses or clinical interpretations
- Risk assessments or safety evaluations
- Treatment recommendations or interventions
- Plans or next steps
- Clinical judgments or conclusions
- Any mention of "Major Depressive Disorder", "suicidal ideation", "risk assessment", "treatment", "intervention", "plan", "safety measures"

ASSESSMENT:
- Primary Diagnosis: [diagnosis with reasoning]
- Differential Diagnoses: [other possible diagnoses]
- Risk Assessment: [detailed risk evaluation with specific level: HIGH, MEDIUM, LOW, or NONE]

PLAN:
- Immediate Interventions: [urgent actions needed]
- Treatment Recommendations: [specific treatment plan]
- Follow-up Plan: [next steps and timeline]
- Safety Measures: [specific safety interventions - DO NOT include follow-up questions here]

Risk Assessment Guidelines:
- HIGH: Active suicidal ideation, plan, means, intent; active psychosis with command hallucinations; imminent violence risk
- MEDIUM: Passive suicidal thoughts, self-harm behaviors, substance abuse concerns, moderate mood instability
- LOW: Mild anxiety/depression symptoms, adjustment difficulties, relationship issues
- NONE: No safety concerns identified; patient presents with normal mood and behavior

CRITICAL FORMATTING RULES:
- OBJECTIVE section: ONLY observable facts, no clinical interpretations
- ASSESSMENT section: Clinical interpretations, diagnoses, risk evaluations
- PLAN section: Interventions, treatments, safety measures
- DO NOT include "ASSESSMENT:" or "PLAN:" words within the content of other sections
- DO NOT include follow-up questions in the structured note - these will be handled separately
- Keep content clean and professional without redundant section headers
- Use proper clinical terminology and maintain professional standards`,
      prompt: `Please analyze this mental health session and create a structured clinical note:

Patient ID: ${patientId}
Session Date: ${new Date().toLocaleDateString()}

Session Notes:
${sessionInput}

Please provide a comprehensive analysis including a session summary, patient information (gender, age, present illness history, past history), risk assessment, structured clinical note in SOAP format (SESSION SUMMARY, PATIENT INFORMATION, OBJECTIVE, ASSESSMENT, PLAN), key findings, and follow-up questions. Format the response as a clean clinical note without any asterisks, bold formatting, or special characters.`,
    });

    // Clean and parse the AI response
    let cleanedText = text
      .replace(/\*\*/g, '') // Remove bold asterisks
      .replace(/\*/g, '') // Remove single asterisks
      .replace(/start \*\*/g, '') // Remove "start **"
      .replace(/star \*\*/g, '') // Remove "star **"
      .replace(/Assessment:/g, 'ASSESSMENT:') // Standardize headers
      .replace(/Plan:/g, 'PLAN:')
      .replace(/Objective:/g, 'OBJECTIVE:')
      .replace(/Session Summary:/g, 'SESSION SUMMARY:')
      .replace(/Patient Information:/g, 'PATIENT INFORMATION:')
      // Remove redundant section headers that appear in content
      .replace(/\bASSESSMENT:\s*/g, '') // Remove ASSESSMENT: from content
      .replace(/\bPLAN:\s*/g, '') // Remove PLAN: from content
      // Remove follow-up questions from the structured note since they're handled separately
      .replace(/\nFollow-up Questions?:\s*\n?.*?(?=\n\n|\n[A-Z]|$)/gs, '') // Remove follow-up questions section
      .replace(/\nFollow-up Questions:\s*\n?.*?(?=\n\n|\n[A-Z]|$)/gs, '') // Remove follow-up questions section
      .replace(/\nFollow-up Question:\s*\n?.*?(?=\n\n|\n[A-Z]|$)/gs, '') // Remove follow-up questions section
      .trim();

    // Parse the AI response and extract structured components
    let clinicalNote: any = {
      structuredNote: cleanedText,
      riskFlags: [],
      sessionSummary: '',
      keySymptoms: [],
      diagnoses: [],
      followUpQuestions: [],
      flaggedWords: []
    };

    // Try to extract structured components from the text
    try {
      // Extract session summary
      let sessionSummary = '';
      if (cleanedText.includes('SESSION SUMMARY:')) {
        sessionSummary = cleanedText.split('SESSION SUMMARY:')[1]?.split('PATIENT INFORMATION:')[0] || 
                        cleanedText.split('SESSION SUMMARY:')[1]?.split('OBJECTIVE:')[0] || '';
      } else if (cleanedText.includes('Session Summary:')) {
        sessionSummary = cleanedText.split('Session Summary:')[1]?.split('Patient Information:')[0] || 
                        cleanedText.split('Session Summary:')[1]?.split('Objective:')[0] || '';
      }
      sessionSummary = sessionSummary.trim();

      // Extract flagged words for highlighting
      const flaggedWords: string[] = [];
      const textLower = cleanedText.toLowerCase();
      
      // Define flagged words that should be highlighted in red
      const flaggedKeywords = [
        'suicidal', 'suicide', 'kill myself', 'end my life', 'self-harm', 'cutting', 
        'violence', 'homicidal', 'harm others', 'active psychosis', 'command hallucinations',
        'substance abuse', 'alcohol', 'drugs', 'overdose', 'dangerous behavior',
        'hopelessness', 'worthless', 'no reason to live', 'better off dead',
        'plan to die', 'means to die', 'intent to die', 'preparations',
        'hallucinations', 'delusions', 'paranoia', 'aggressive', 'violent thoughts',
        'overdose', 'poison', 'weapons', 'guns', 'knives', 'pills'
      ];
      
      // Find all flagged words in the text (case insensitive)
      flaggedKeywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = cleanedText.match(regex);
        if (matches) {
          matches.forEach(match => {
            if (!flaggedWords.includes(match.toLowerCase())) {
              flaggedWords.push(match.toLowerCase());
            }
          });
        }
      });

      // Extract risk flags based on AI assessment
      const riskFlags = [];
      
      // Check if any safety concerns are mentioned
      const safetyKeywords = [
        'suicidal', 'suicide', 'kill myself', 'end my life', 'self-harm', 'cutting', 
        'violence', 'homicidal', 'harm others', 'active psychosis', 'command hallucinations',
        'substance abuse', 'alcohol', 'drugs', 'overdose', 'dangerous behavior'
      ];
      
      const hasSafetyConcerns = safetyKeywords.some(keyword => textLower.includes(keyword));
      
      if (hasSafetyConcerns) {
        // Extract risk level from AI assessment
        let riskLevel = 'medium'; // default
        if (textLower.includes('high risk') || textLower.includes('risk: high')) {
          riskLevel = 'high';
        } else if (textLower.includes('low risk') || textLower.includes('risk: low')) {
          riskLevel = 'low';
        } else if (textLower.includes('medium risk') || textLower.includes('risk: medium')) {
          riskLevel = 'medium';
        }
        
        // Determine category based on keywords
        let category = 'Risk Assessment';
        if (textLower.includes('suicidal') || textLower.includes('suicide')) {
          category = 'Suicide Risk';
        } else if (textLower.includes('self-harm') || textLower.includes('cutting')) {
          category = 'Self-Harm';
        } else if (textLower.includes('violence') || textLower.includes('homicidal')) {
          category = 'Violence Risk';
        } else if (textLower.includes('substance abuse') || textLower.includes('alcohol') || textLower.includes('drugs')) {
          category = 'Substance Abuse';
        }
        
        riskFlags.push({
          type: riskLevel as 'high' | 'medium' | 'low',
          category: category,
          description: `AI assessment indicates ${riskLevel} risk level. Requires clinical attention and monitoring.`
        });
      } else {
        // No safety concerns identified
        riskFlags.push({
          type: 'none' as 'none',
          category: 'No Safety Concerns',
          description: 'No safety concerns identified in this session. Patient presents with normal mood and behavior.'
        });
      }

      // Extract symptoms and diagnoses
      const symptoms = [];
      const diagnoses = [];
      
      // Check for missing patient information and generate targeted follow-up questions
      const missingInfoQuestions = [];
      
      // Check for missing patient demographics
      if (!textLower.includes('gender') && !textLower.includes('male') && !textLower.includes('female') && !textLower.includes('non-binary')) {
        missingInfoQuestions.push("What is the patient's gender identity?");
      }
      
      if (!textLower.includes('age') && !textLower.includes('years old') && !textLower.includes('year-old')) {
        missingInfoQuestions.push("What is the patient's age?");
      }
      
      // Check for missing present illness history
      if (!textLower.includes('present illness') && !textLower.includes('current symptoms') && !textLower.includes('symptoms started') && !textLower.includes('timeline')) {
        missingInfoQuestions.push("Can you provide a detailed timeline of when the current symptoms began and how they have progressed?");
      }
      
      // Check for missing past psychiatric history
      if (!textLower.includes('past psychiatric') && !textLower.includes('previous diagnosis') && !textLower.includes('prior treatment') && !textLower.includes('hospitalization')) {
        missingInfoQuestions.push("Does the patient have any previous psychiatric diagnoses, treatments, or hospitalizations?");
      }
      
      // Check for missing past medical history
      if (!textLower.includes('past medical') && !textLower.includes('medical conditions') && !textLower.includes('medications') && !textLower.includes('surgeries')) {
        missingInfoQuestions.push("What is the patient's past medical history, including current medications, medical conditions, or surgeries?");
      }
      
      // Check for missing family history
      if (!textLower.includes('family history') && !textLower.includes('family mental health') && !textLower.includes('parents') && !textLower.includes('siblings')) {
        missingInfoQuestions.push("Is there any family history of mental health conditions, substance abuse, or psychiatric disorders?");
      }
      
      // Check for missing social history
      if (!textLower.includes('social history') && !textLower.includes('occupation') && !textLower.includes('living situation') && !textLower.includes('relationships') && !textLower.includes('substance use')) {
        missingInfoQuestions.push("What is the patient's social history including occupation, living situation, relationships, and any substance use?");
      }
      
      // Check for missing risk assessment details
      if (hasSafetyConcerns) {
        if (!textLower.includes('suicidal ideation') && !textLower.includes('suicide') && !textLower.includes('kill myself')) {
          missingInfoQuestions.push("Has the patient expressed any suicidal thoughts, plans, or intent? If so, what are the specific details?");
        }
        
        if (!textLower.includes('self-harm') && !textLower.includes('cutting') && !textLower.includes('self-injury')) {
          missingInfoQuestions.push("Has the patient engaged in any self-harm behaviors? If so, what methods and frequency?");
        }
        
        if (!textLower.includes('violence') && !textLower.includes('homicidal') && !textLower.includes('harm others')) {
          missingInfoQuestions.push("Has the patient expressed any violent thoughts or intentions toward others?");
        }
        
        if (!textLower.includes('substance abuse') && !textLower.includes('alcohol') && !textLower.includes('drugs') && !textLower.includes('substance use')) {
          missingInfoQuestions.push("What is the patient's current and past substance use history, including alcohol, drugs, and prescription medications?");
        }
      }
      
      // Check for missing mental status exam components
      if (!textLower.includes('mental status') && !textLower.includes('mse')) {
        missingInfoQuestions.push("Can you provide a detailed Mental Status Examination including appearance, behavior, mood, affect, speech, thought process, thought content, perception, cognition, and insight?");
      }
      
      // Check for missing physical observations
      if (!textLower.includes('physical') && !textLower.includes('appearance') && !textLower.includes('behavior')) {
        missingInfoQuestions.push("What are your physical observations of the patient including appearance, behavior, and any notable physical signs?");
      }
      
      // Check for missing treatment recommendations
      if (!textLower.includes('treatment') && !textLower.includes('intervention') && !textLower.includes('plan')) {
        missingInfoQuestions.push("What specific treatment recommendations or interventions are you considering for this patient?");
      }
      
      // Combine missing info questions with standard follow-up questions
      const followUpQuestions = [
        ...missingInfoQuestions,
        "Can you describe the thoughts you had about ending your life? Were there any specific plans or methods you considered?",
        "Have you experienced any changes in your appetite or weight recently, and how have you been managing food intake?",
        "What activities or social interactions, if any, have you been avoiding due to your current feelings?",
        "How do you feel about the idea of starting medication for your depression?",
        "Is there anyone in your support network you feel comfortable reaching out to during times of distress?"
      ];
      
      // Remove duplicates and limit to reasonable number
      const uniqueQuestions = [...new Set(followUpQuestions)].slice(0, 8);

      // Extract common symptoms and diagnoses
      const commonSymptoms = ['depression', 'anxiety', 'hopelessness', 'isolation', 'insomnia', 'poor appetite', 'suicidal ideation', 'mood swings'];
      const commonDiagnoses = ['Major Depressive Disorder', 'Generalized Anxiety Disorder', 'Adjustment Disorder', 'Sleep Disturbance'];

      for (const symptom of commonSymptoms) {
        if (textLower.includes(symptom)) {
          symptoms.push(symptom);
        }
      }

      for (const diagnosis of commonDiagnoses) {
        if (cleanedText.toLowerCase().includes(diagnosis.toLowerCase())) {
          diagnoses.push(diagnosis);
        }
      }

      clinicalNote = {
        structuredNote: cleanedText,
        riskFlags,
        sessionSummary: sessionSummary || 'Session summary not available.',
        keySymptoms: symptoms,
        diagnoses,
        followUpQuestions: uniqueQuestions,
        flaggedWords
      };

      // Extract assessment and plan content with proper categorization
      let assessmentContent = '';
      let planContent = '';

      // Extract assessment section - look for various patterns
      if (cleanedText.includes('ASSESSMENT:')) {
        assessmentContent = cleanedText.split('ASSESSMENT:')[1]?.split('PLAN:')[0] || '';
      } else if (cleanedText.includes('Assessment:')) {
        assessmentContent = cleanedText.split('Assessment:')[1]?.split('Plan:')[0] || '';
      } else {
        // Look for assessment content without clear headers
        const lines = cleanedText.split('\n');
        let inAssessment = false;
        let assessmentLines = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.toLowerCase().includes('primary diagnosis') || 
              line.toLowerCase().includes('differential diagnosis') ||
              line.toLowerCase().includes('risk assessment') ||
              line.toLowerCase().includes('risk high') ||
              line.toLowerCase().includes('risk medium') ||
              line.toLowerCase().includes('risk low')) {
            inAssessment = true;
            assessmentLines.push(line);
          } else if (inAssessment && (line.toLowerCase().includes('immediate intervention') ||
                                   line.toLowerCase().includes('treatment recommendation') ||
                                   line.toLowerCase().includes('follow-up') ||
                                   line.toLowerCase().includes('safety measure'))) {
            break;
          } else if (inAssessment && line) {
            assessmentLines.push(line);
          }
        }
        assessmentContent = assessmentLines.join('\n');
      }

      // Extract plan section - look for various patterns
      if (cleanedText.includes('PLAN:')) {
        planContent = cleanedText.split('PLAN:')[1] || '';
      } else if (cleanedText.includes('Plan:')) {
        planContent = cleanedText.split('Plan:')[1] || '';
      } else {
        // Look for plan content without clear headers
        const lines = cleanedText.split('\n');
        let inPlan = false;
        let planLines = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.toLowerCase().includes('immediate intervention') ||
              line.toLowerCase().includes('treatment recommendation') ||
              line.toLowerCase().includes('follow-up') ||
              line.toLowerCase().includes('safety measure')) {
            inPlan = true;
            planLines.push(line);
          } else if (inPlan && line && !line.toLowerCase().includes('risk assessment')) {
            planLines.push(line);
          } else if (inPlan && line.toLowerCase().includes('risk assessment')) {
            break;
          }
        }
        planContent = planLines.join('\n');
      }

      // Clean and categorize assessment content
      const assessmentCategories = {
        primaryDiagnosis: '',
        differentialDiagnoses: '',
        riskAssessment: ''
      };

      if (assessmentContent) {
        const assessmentLines = assessmentContent.split('\n').filter(line => line.trim());
        let currentCategory = '';
        
        assessmentLines.forEach(line => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('primary diagnosis')) {
            currentCategory = 'primaryDiagnosis';
            assessmentCategories.primaryDiagnosis = line.split(':')[1]?.trim() || line.replace(/primary diagnosis/i, '').trim();
          } else if (lowerLine.includes('differential diagnosis')) {
            currentCategory = 'differentialDiagnoses';
            assessmentCategories.differentialDiagnoses = line.split(':')[1]?.trim() || line.replace(/differential diagnosis/i, '').trim();
          } else if (lowerLine.includes('risk assessment') || lowerLine.includes('risk high') || lowerLine.includes('risk medium') || lowerLine.includes('risk low')) {
            currentCategory = 'riskAssessment';
            assessmentCategories.riskAssessment = line;
          } else if (currentCategory && line.trim()) {
            // Append to current category if we're in one
            if (currentCategory === 'primaryDiagnosis') {
              assessmentCategories.primaryDiagnosis += ' ' + line.trim();
            } else if (currentCategory === 'differentialDiagnoses') {
              assessmentCategories.differentialDiagnoses += ' ' + line.trim();
            } else if (currentCategory === 'riskAssessment') {
              assessmentCategories.riskAssessment += ' ' + line.trim();
            }
          }
        });
      }

      // Clean and categorize plan content
      const planCategories = {
        immediateInterventions: '',
        treatmentRecommendations: '',
        followUpPlan: '',
        safetyMeasures: ''
      };

      if (planContent) {
        const planLines = planContent.split('\n').filter(line => line.trim());
        let currentCategory = '';
        
        planLines.forEach(line => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('immediate intervention')) {
            currentCategory = 'immediateInterventions';
            planCategories.immediateInterventions = line.split(':')[1]?.trim() || line.replace(/immediate intervention/i, '').trim();
          } else if (lowerLine.includes('treatment recommendation')) {
            currentCategory = 'treatmentRecommendations';
            planCategories.treatmentRecommendations = line.split(':')[1]?.trim() || line.replace(/treatment recommendation/i, '').trim();
          } else if (lowerLine.includes('follow-up')) {
            currentCategory = 'followUpPlan';
            planCategories.followUpPlan = line.split(':')[1]?.trim() || line.replace(/follow-up/i, '').trim();
          } else if (lowerLine.includes('safety measure')) {
            currentCategory = 'safetyMeasures';
            planCategories.safetyMeasures = line.split(':')[1]?.trim() || line.replace(/safety measure/i, '').trim();
          } else if (currentCategory && line.trim()) {
            // Append to current category if we're in one
            if (currentCategory === 'immediateInterventions') {
              planCategories.immediateInterventions += ' ' + line.trim();
            } else if (currentCategory === 'treatmentRecommendations') {
              planCategories.treatmentRecommendations += ' ' + line.trim();
            } else if (currentCategory === 'followUpPlan') {
              planCategories.followUpPlan += ' ' + line.trim();
            } else if (currentCategory === 'safetyMeasures') {
              planCategories.safetyMeasures += ' ' + line.trim();
            }
          }
        });
      }

      // Update clinicalNote with categorized data
      clinicalNote = {
        ...clinicalNote,
        assessment: {
          content: assessmentContent.trim() || 'No assessment data available.',
          categories: assessmentCategories
        },
        plan: {
          content: planContent.trim() || 'No plan data available.',
          categories: planCategories
        }
      };

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Keep the fallback structure
    }

    // Ensure all required properties exist with fallback values
    const safeResponse = {
      structuredNote:
        clinicalNote.structuredNote || 'Clinical note could not be generated.',
      riskFlags: Array.isArray(clinicalNote.riskFlags)
        ? clinicalNote.riskFlags
        : [],
      sessionSummary:
        clinicalNote.sessionSummary || 'Session summary not available.',
      keySymptoms: Array.isArray(clinicalNote.keySymptoms)
        ? clinicalNote.keySymptoms
        : [],
      diagnoses: Array.isArray(clinicalNote.diagnoses)
        ? clinicalNote.diagnoses
        : [],
      followUpQuestions: Array.isArray(clinicalNote.followUpQuestions)
        ? clinicalNote.followUpQuestions
        : [],
      flaggedWords: Array.isArray(clinicalNote.flaggedWords)
        ? clinicalNote.flaggedWords
        : [],
      assessment: clinicalNote.assessment || {
        content: 'No assessment data available.',
        categories: {
          primaryDiagnosis: '',
          differentialDiagnoses: '',
          riskAssessment: ''
        }
      },
      plan: clinicalNote.plan || {
        content: 'No plan data available.',
        categories: {
          immediateInterventions: '',
          treatmentRecommendations: '',
          followUpPlan: '',
          safetyMeasures: ''
        }
      }
    };

    return NextResponse.json(safeResponse);
  } catch (error) {
    console.error('Error processing session:', error);
    return NextResponse.json(
      {
        error: 'Failed to process session',
        structuredNote: 'An error occurred while processing the session.',
        riskFlags: [],
        sessionSummary: 'Unable to process session due to technical error.',
        keySymptoms: [],
        diagnoses: [],
        followUpQuestions: [],
        flaggedWords: [],
        assessment: {
          content: 'Unable to process assessment due to technical error.',
          categories: {
            primaryDiagnosis: '',
            differentialDiagnoses: '',
            riskAssessment: ''
          }
        },
        plan: {
          content: 'Unable to process plan due to technical error.',
          categories: {
            immediateInterventions: '',
            treatmentRecommendations: '',
            followUpPlan: '',
            safetyMeasures: ''
          }
        }
      },
      { status: 500 },
    );
  }
}
