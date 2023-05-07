import { AbstractControl, ValidationErrors } from '@angular/forms';

export function uniqueTitleValidator(sections: any[],defaultValue:any = null): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;
    const titleSet = new Set();

    sections.forEach(section => {
      section.categories.forEach((category:any) => {
        titleSet.add(category.title);
      });
    });

    if (titleSet.has(currentValue) && currentValue !== defaultValue) {
      return { uniqueTitle: true };
    } else {
      return null;
    }
  };
}
