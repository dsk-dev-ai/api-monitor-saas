'use client';

export default function WorkspacesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Workspaces</h1>

      <p className="mt-4 text-muted-foreground">
        Workspace management is currently under development.
      </p>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          Coming in v2.1
        </h2>

        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Multiple workspaces</li>
          <li>Team collaboration</li>
          <li>Workspace switching</li>
          <li>Role management</li>
          <li>Shared monitors</li>
        </ul>
      </div>
    </div>
  );
}
