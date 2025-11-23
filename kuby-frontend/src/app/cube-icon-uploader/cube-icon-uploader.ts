import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { CubeConfigModel, DisplayMode } from './cube-icon-uploader.models';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { IconClient } from '../services/api-service';
import { TooltipModule } from 'primeng/tooltip';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cube-icon-uploader',
  imports: [
    CardModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    FileUploadModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ImageCropperComponent,
  ],
  templateUrl: './cube-icon-uploader.html',
  styleUrl: './cube-icon-uploader.scss',
})
export class CubeIconUploader {
  public readonly initialCubeConfigModelsState = signal<CubeConfigModel[]>([]);
  public readonly cubeConfigModels = signal<CubeConfigModel[]>([]);

  public readonly imageFile = signal<File | undefined>(undefined);

  public readonly isDialogVisible = signal(false);

  public readonly hasCubeConfigModelsChanged = computed(
    () =>
      JSON.stringify(this.cubeConfigModels()) !==
      JSON.stringify(this.initialCubeConfigModelsState())
  );

  protected readonly DisplayMode = DisplayMode;

  protected readonly fileTypes = '.png, .jpeg, .jpg';

  private readonly currentIconOfCubeIdBeingCropped = signal(0);

  private readonly imageCroppedEvent = signal<ImageCroppedEvent | undefined>(undefined);

  private readonly iconService = inject(IconClient);

  constructor() {
    this.cubeConfigModels.set(this.initializeCubeConfig());
    this.initialCubeConfigModelsState.set(this.cubeConfigModels());
  }

  public fileChangeEvent(event: FileUploadHandlerEvent, cubeDisplayId: number): void {
    this.imageFile.set(event.files[0]);
    this.isDialogVisible.set(true);
    this.currentIconOfCubeIdBeingCropped.set(cubeDisplayId);
  }

  public onImageCropped(event: ImageCroppedEvent): void {
    this.imageCroppedEvent.set(event);
  }

  public async uploadIcon(): Promise<void> {
    if (!this.imageCroppedEvent()) return; //FIXME: better exception handling

    this.iconService.process([{ data: this.imageCroppedEvent()!.blob, fileName: '' }]).subscribe({
      next: async (bytearrayString) => {
        let iconByteArray;
        if ((window as any).electron)
          // passing to electron
          await (window as any).electron
            .invoke('cube-upload', bytearrayString)
            .then((data: any) => console.log(data));

        this.cubeConfigModels.update((value) =>
          value.map((cube) => {
            return {
              ...cube,
              iconByteArray: iconByteArray ? iconByteArray : undefined,
              iconForPreview:
                cube.displayId === this.currentIconOfCubeIdBeingCropped()
                  ? bytearrayString
                  : cube.iconForPreview,
            } as CubeConfigModel;
          })
        );

        this.isDialogVisible.set(false);
      },
    });
  }

  public onVisibleChange(isDialogVisible: boolean): void {
    this.isDialogVisible.set(isDialogVisible);
  }

  public onCancelCropper(): void {
    this.isDialogVisible.set(false);
    this.imageFile.set(undefined);
  }

  public saveCubeConfig(): void {
    console.log(this.cubeConfigModels().map((model) => ({ ...model, time: new Date() })));
  }

  public onRemoveImage(index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] = { ...clone[index], iconByteArray: undefined, iconForPreview: undefined };
      return clone;
    });
  }

  public onDescriptionChange(value: string, index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] = { ...clone[index], description: value };
      return clone;
    });
  }
  public onModeChange(value: DisplayMode, index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] =
        value === DisplayMode.STOPWATCH
          ? { ...clone[index], mode: value, hours: 0, minutes: 0, seconds: 0 }
          : { ...clone[index], mode: value };
      return clone;
    });
  }

  public onHoursChange(value: number, index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] = { ...clone[index], hours: value };
      return clone;
    });
  }
  public onMinutesChange(value: number, index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] = { ...clone[index], minutes: value };
      return clone;
    });
  }
  public onSecondsChange(value: number, index: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      clone[index] = { ...clone[index], seconds: value };
      return clone;
    });
  }

  /**
   * 6 cube sides can be defined, where the sixth one, or just one side, cant have an image
   */
  private initializeCubeConfig(): CubeConfigModel[] {
    const configModels: CubeConfigModel[] = [];
    for (let i = 0; i < 6; i++) {
      configModels.push({
        displayId: i + 1,
        description: '',
        mode: DisplayMode.STOPWATCH,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }

    return configModels;
  }
}
