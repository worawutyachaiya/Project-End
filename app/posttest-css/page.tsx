// app/posttest-css/page.tsx - Updated version
import EnhancedPosttestComponent from '@/components/EnhancedPosttestComponent';
import RouteGuard from '@/components/routeGuard';

export default function PosttestCSSPage() {
  return (
    <RouteGuard requireAuth={true}>
      <EnhancedPosttestComponent 
        type="CSS" 
        title="ข้อสอบหลังเรียน CSS" 
      />
    </RouteGuard>
  );
}