import VerticalOverview from './VerticalOverview';

export default function RealEstateDash({ overview }) {
  return <VerticalOverview title="Real estate workspace" icon="🏘️" description="A connected view of real estate clients, pipeline, and delivery." overview={overview} />;
}