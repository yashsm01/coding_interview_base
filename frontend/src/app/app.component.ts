import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #0f0c29;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
  `]
})
export class AppComponent {
    title = 'University Merch Platform';
}
