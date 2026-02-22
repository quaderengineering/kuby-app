import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivityClient, ActivityModel } from '../../services/api-service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-activity-editor',
  imports: [FormsModule, DialogModule, FloatLabelModule, InputTextModule, ButtonModule],
  templateUrl: './activity-editor.html',
  styleUrl: './activity-editor.scss',
})
export class ActivityEditor {
  public readonly activity = input<ActivityModel>();

  public readonly onClose = output();

  public readonly onSubmitData = output<ActivityModel>();

  public readonly editActivity = linkedSignal<ActivityModel>(
    () => this.activity() || this.getDefaultModel()
  );

  private readonly activityService = inject(ActivityClient);
  private readonly destroyRef = inject(DestroyRef);

  public onSubmit(): void {
    this.onSubmitData.emit(this.editActivity());
    this.onClose.emit();
  }

  public onCancel(): void {
    this.onClose.emit();
  }

  private getDefaultModel(): ActivityModel {
    return { label: '' };
  }
}
