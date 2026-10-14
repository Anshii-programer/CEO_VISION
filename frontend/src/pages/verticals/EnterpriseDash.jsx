import VerticalOverview from './VerticalOverview';

export default function EnterpriseDash({ overview }) {
  return <VerticalOverview title="Enterprise dashboard" icon="🏢" description="Key accounts, enterprise pipeline, and delivery at a glance." overview={overview} />;
}