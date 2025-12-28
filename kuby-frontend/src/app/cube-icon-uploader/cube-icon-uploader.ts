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
import { PanelModule } from 'primeng/panel';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-cube-icon-uploader',
  imports: [
    CommonModule,
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
    PanelModule,
    ListboxModule,
    SelectButtonModule,
    DividerModule,
    DrawerModule,
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

  public readonly selectedCubeSideIndex = signal(-1);

  public readonly show3dView = signal(false);

  public readonly showDrawer = signal(false);

  public readonly cubeModes = [
    { label: 'Stoppuhr', value: DisplayMode.STOPWATCH },
    { label: 'Timer', value: DisplayMode.TIMER },
  ];

  protected readonly DisplayMode = DisplayMode;

  protected readonly fileTypes = '.png, .jpeg, .jpg';

  private readonly currentIconOfCubeIdBeingCropped = signal(0);

  private readonly imageCroppedEvent = signal<ImageCroppedEvent | undefined>(undefined);

  private readonly iconService = inject(IconClient);

  constructor() {
    this.cubeConfigModels.set(this.initializeCubeConfig());
    this.initialCubeConfigModelsState.set(this.cubeConfigModels());
  }

  public onSelectedCubeSideChanged(index: number): void {
    this.selectedCubeSideIndex.set(index);
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
        if ((window as any).electron)
          // passing to electron
          await (window as any).electron.invoke('cube-upload', bytearrayString).then((data: any) =>
            this.cubeConfigModels.update((value) =>
              value.map((cube) => {
                return {
                  ...cube,
                  iconByteArray: data,
                } as CubeConfigModel;
              })
            )
          );

        this.cubeConfigModels.update((value) =>
          value.map((cube) => {
            return {
              ...cube,
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

  public onRemoveImage(displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] = { ...clone[index], iconByteArray: undefined, iconForPreview: undefined };
      return clone;
    });
  }

  public onDescriptionChange(value: string, displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] = { ...clone[index], description: value };
      return clone;
    });
  }
  public onModeChange(value: DisplayMode, displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] =
        value === DisplayMode.STOPWATCH
          ? { ...clone[index], mode: value, hours: 0, minutes: 0, seconds: 0 }
          : { ...clone[index], mode: value };
      return clone;
    });
  }

  public onHoursChange(value: number, displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] = { ...clone[index], hours: value };
      return clone;
    });
  }
  public onMinutesChange(value: number, displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] = { ...clone[index], minutes: value };
      return clone;
    });
  }
  public onSecondsChange(value: number, displayId: number): void {
    this.cubeConfigModels.update((models) => {
      const clone = [...models];
      const index = clone.findIndex((c) => c.displayId === displayId);
      clone[index] = { ...clone[index], seconds: value };
      return clone;
    });
  }

  public onToggle3dView(): void {
    this.show3dView.set(!this.show3dView());
  }

  public onToggleShowDrawer(): void {
    this.showDrawer.set(!this.showDrawer());
  }

  /**
   * 6 cube sides can be defined, where the sixth one, or just one side, cant have an image
   */
  private initializeCubeConfig(): CubeConfigModel[] {
    const configModels: CubeConfigModel[] = [];
    for (let i = 0; i < 5; i++) {
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
