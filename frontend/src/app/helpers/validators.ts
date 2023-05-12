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
export function uniqueRoleNameValidator(roles: any[],defaultValue:any = null): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;
    const nameSet = new Set();

    roles.forEach(role => {
      nameSet.add(role.name);
    });
    if (nameSet.has(currentValue) && currentValue !== defaultValue) {
      return { uniqueName: true };
    } else {
      return null;
    }
  };
}

export function uniquePostsValidator(roles: any[],defaultValue:any = null): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;
    const postsSet = new Set();

    roles.forEach(role => {
      postsSet.add(role.posts);
    });
    
    if (postsSet.has(currentValue) && currentValue !== defaultValue) {
      return { uniquePosts: true };
    } else {
      return null;
    }
  };
}
