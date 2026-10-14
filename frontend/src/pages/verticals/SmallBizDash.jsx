import VerticalOverview from './VerticalOverview';

export default function SmallBizDash({ overview }) {
  return <VerticalOverview title="Small business workspace" icon="🏪" description="A connected view of small-business clients, pipeline, and delivery." overview={overview} />;
}