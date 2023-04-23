import { Component, TemplateRef } from '@angular/core';

import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbToast, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
	selector: 'app-toasts',
	standalone: true,
	imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor],
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainer {
	constructor(public toastService: ToastService) {}

	isTemplate(toast:any) {
		return toast.textOrTpl instanceof TemplateRef;
	}

	closeToast(toast:NgbToast,group:string=''){	
		console.log(toast)
		toast.hide;
		this.toastService.remove(toast,group)
	}
	hide(toast:any){
		toast.hide();
	}
}