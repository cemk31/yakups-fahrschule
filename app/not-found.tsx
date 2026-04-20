import Link from "next/link";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="mb-4 inline-block rounded-full bg-brand-green-soft px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-brand-green-dark)]">
        404
      </div>
      <h1 className="mb-4 text-4xl font-medium">Seite nicht gefunden<span className="text-brand-green">.</span></h1>
      <p className="mx-auto mb-8 max-w-md text-brand-text">
        Die Seite, die du suchst, existiert nicht (mehr). Vielleicht findest du,
        was du brauchst, auf der Startseite.
      </p>
      <Button variant="primary" href="/">
        Zur Startseite
        <ArrowRight />
      </Button>
    </Container>
  );
}
