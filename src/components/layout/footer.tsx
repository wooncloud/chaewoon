export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} 채운(彩雲). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
