import VerticalOverview from './VerticalOverview';

export default function StartupDash({ overview }) {
  return <VerticalOverview title="Startup growth hub" icon="🚀" description="A live snapshot of your startup's customer and revenue pipeline." overview={overview} />;
}