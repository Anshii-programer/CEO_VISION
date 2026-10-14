import VerticalOverview from './VerticalOverview';

export default function HealthcareDash({ overview }) {
  return <VerticalOverview title="Healthcare workspace" icon="🏥" description="A connected view of healthcare clients, pipeline, and delivery." overview={overview} />;
}