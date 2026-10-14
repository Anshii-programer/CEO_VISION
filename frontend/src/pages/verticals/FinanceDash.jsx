import VerticalOverview from './VerticalOverview';

export default function FinanceDash({ overview }) {
  return <VerticalOverview title="Finance workspace" icon="💳" description="A connected view of finance clients, pipeline, and delivery." overview={overview} />;
}