import VerticalOverview from './VerticalOverview';

export default function EducationDash({ overview }) {
  return <VerticalOverview title="Education workspace" icon="🎓" description="A connected view of education clients, pipeline, and delivery." overview={overview} />;
}