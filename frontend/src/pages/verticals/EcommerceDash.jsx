import VerticalOverview from './VerticalOverview';

export default function EcommerceDash({ overview }) {
  return <VerticalOverview title="E-commerce analytics" icon="🛒" description="Customers, opportunities, and active projects from your connected CRM." overview={overview} />;
}