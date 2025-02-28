
import { Resource } from '@/utils/types';
import ResourceList from '@/components/ResourceList';

interface ResourcesTabProps {
  onSelectResource: (resource: Resource) => void;
}

export default function ResourcesTab({ onSelectResource }: ResourcesTabProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
      <ResourceList onSelectResource={onSelectResource} />
    </div>
  );
}
