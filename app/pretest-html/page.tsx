// app/pretest-html/page.tsx - Updated version
import PretestQuizComponent from '@/components/PretestQuizComponent';
import RouteGuard from '@/components/routeGuard';

export default function PretestHTMLPage() {
  return (
    <RouteGuard requireAuth={true}>
      <PretestQuizComponent 
        type="HTML" 
        title="ข้อสอบก่อนเรียน HTML" 
      />
    </RouteGuard>
  );
}