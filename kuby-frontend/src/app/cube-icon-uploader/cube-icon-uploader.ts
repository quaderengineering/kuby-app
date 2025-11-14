import { Component, inject, signal } from '@angular/core';
import { CubeConfigModel, DisplayMode } from './cube-icon-uploader.models';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CubeBookingClient, IconClient } from '../services/api-service';
import { TooltipModule } from 'primeng/tooltip';

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
  ],
  templateUrl: './cube-icon-uploader.html',
  styleUrl: './cube-icon-uploader.scss',
})
export class CubeIconUploader {
  public readonly cubeConfigModels = signal<CubeConfigModel[]>([]);

  protected readonly DisplayMode = DisplayMode;

  private readonly iconService = inject(IconClient);

  constructor() {
    this.cubeConfigModels.set(this.initializeCubeConfig());
  }

  public async uploadIcon(event: FileUploadHandlerEvent, displayId: number): Promise<void> {
    if (!event.files) return;
    const file = event.files[0]!;

    const reader = new FileReader();
    reader.readAsArrayBuffer(event.files[0]!);
    reader.onload = () => {
      const blob = new Blob([reader.result!], { type: file.type });

      this.iconService.process([{ data: blob, fileName: file.name }]).subscribe({
        next: async (bytearrayString) => {
          if ((window as any).electron)
            await (window as any).electron
              .invoke('cube-upload', bytearrayString)
              .then((data: any) => console.log(data));

          this.cubeConfigModels.update((value) =>
            value.map((cube) => {
              return {
                ...cube,
                icon: cube.displayId === displayId ? bytearrayString : cube.icon,
              } as CubeConfigModel;
            })
          );
        },
      });
    };
  }

  private initializeCubeConfig(): CubeConfigModel[] {
    const configModels: CubeConfigModel[] = [];
    // 6 cube sides can be defined, where the sixth one or just one side cant have an image
    for (let i = 0; i < 6; i++) {
      configModels.push({
        displayId: i + 1,
        description: '',
        icon: '',
        mode: DisplayMode.STOPWATCH,
        time: new Date(),
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }

    return configModels;
  }
}
