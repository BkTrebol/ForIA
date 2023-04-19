import { Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { RectSkeComponent } from '../../components/rect-ske/rect-ske.component'

function random(min: number, max: number) {
  return Math.floor(Math.random() * max) + min;
}

@Directive({
  selector: '[skeleton]',
})
export class SkeletonDirective {
  @Input('skeleton') isLoading = false;
  @Input('skeletonRepeat') size = 1;
  @Input('skeletonWidth') width: string;
  @Input('skeletonHeight') height: string;
  @Input('skeletonClassName') className: string;

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {
    this.width = '100';
    this.height = '100';
    this.className = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      this.vcr.clear();

      if (changes['isLoading'].currentValue) {
        Array.from({ length: this.size }).forEach(() => {
          const ref = this.vcr.createComponent(RectSkeComponent);

          Object.assign(ref.instance, {
            width: this.width === 'rand' ? `${random(30, 90)}%` : this.width,
            height: this.height,
            className: this.className,
          });
        });
      } else {
        this.vcr.createEmbeddedView(this.tpl);
      }
    }
  }
}
