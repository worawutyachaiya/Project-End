// app/posttest-html/page.tsx - Updated version
import EnhancedPosttestComponent from '@/components/EnhancedPosttestComponent';
import RouteGuard from '@/components/routeGuard';

export default function PosttestHTMLPage() {
  return (
    <RouteGuard requireAuth={true}>
      <EnhancedPosttestComponent 
        type="HTML" 
        title="ข้อสอบหลังเรียน HTML" 
      />
    </RouteGuard>
  );
}