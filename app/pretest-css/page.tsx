// app/pretest-css/page.tsx - Updated version
import PretestQuizComponent from '@/components/PretestQuizComponent';
import RouteGuard from '@/components/routeGuard';

export default function PretestCSSPage() {
  return (
    <RouteGuard requireAuth={true}>
      <PretestQuizComponent 
        type="CSS" 
        title="ข้อสอบก่อนเรียน CSS" 
      />
    </RouteGuard>
  );
}
