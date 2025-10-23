import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/sites/$domain")({
  component: RouteComponent,
});

function RouteComponent() {
  const { domain } = useParams({
    from: "/sites/$domain",
  });

  return <div>Hello "/sites/{domain}"!</div>;
}
