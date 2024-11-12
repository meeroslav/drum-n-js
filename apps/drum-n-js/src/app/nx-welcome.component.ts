import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent { }
