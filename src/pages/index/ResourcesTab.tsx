
import { Resource } from '@/utils/types';
import ResourceList from '@/components/ResourceList';

interface ResourcesTabProps {
  onSelectResource: (resource: Resource) => void;
}

export default function ResourcesTab({ onSelectResource }: ResourcesTabProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-center">Recursos Disponíveis</h2>
        <p className="text-muted-foreground text-center mt-2">
          Selecione uma sala ou veículo para reservar
        </p>
      </div>
      <ResourceList onSelectResource={onSelectResource} />
    </div>
  );
}
