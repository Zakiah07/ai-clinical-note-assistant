import { redirect } from 'next/navigation';
import { auth } from '../(auth)/auth';
import ClinicalNotesApp from './clinical-notes/page';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div>
      <ClinicalNotesApp />
    </div>
  );
}
