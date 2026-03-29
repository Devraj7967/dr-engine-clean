import { IssueReportForm } from "@/components/issue-report-form";

export default function ReportPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Report Issue</h1>
        <p className="text-muted-foreground">
          Describe your car problem and get an AI-powered diagnosis with confidence levels
        </p>
      </div>
      
      <IssueReportForm />
    </div>
  );
}
