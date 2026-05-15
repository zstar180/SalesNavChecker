export type AppTab = 'tasks' | 'favorites';

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

export function AppTabs({ active, onChange }: Props) {
  return (
    <div className="app-tabs" role="tablist" aria-label="Main views">
      <button
        type="button"
        role="tab"
        id="tab-tasks"
        aria-selected={active === 'tasks'}
        aria-controls="panel-tasks"
        className={`app-tab ${active === 'tasks' ? 'app-tab-active' : ''}`}
        onClick={() => onChange('tasks')}
      >
        Tasks
      </button>
      <button
        type="button"
        role="tab"
        id="tab-favorites"
        aria-selected={active === 'favorites'}
        aria-controls="panel-favorites"
        className={`app-tab ${active === 'favorites' ? 'app-tab-active' : ''}`}
        onClick={() => onChange('favorites')}
      >
        Favorites
      </button>
    </div>
  );
}
