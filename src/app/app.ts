import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly deepLinkBase = 'vox://open';

  public ngOnInit(): void {
    if (typeof window == 'undefined' || typeof document == 'undefined') return;

    const isElectron = !!(window as any).electron;
    if (isElectron) {
      const electronApi = (window as any).electron;
      if (electronApi.onDeepLink)
        electronApi.onDeepLink((url: string) => {
          try {
            const parsed = new URL(url);
            const encoded = parsed.searchParams.get('path');
            if (!encoded) return;
            const path = decodeURIComponent(encoded);
            this.router.navigateByUrl(path);
          } catch {}
        });

      return;
    }

    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get('notOpen') !== 'true';
    if (!shouldOpen) return;

    const currentPath = window.location.pathname + window.location.search + window.location.hash;

    const encodedPath = encodeURIComponent(currentPath);
    this.tryOpenApp(`${this.deepLinkBase}?path=${encodedPath}`);
  }

  private tryOpenApp(link: string): void {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = link;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 1500);
    } catch {}
  }
}
