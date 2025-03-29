
import { JsonPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmotionDetectionService } from '../../core/services/emotion-detection.service';

@Component({
  selector: 'app-emotion-live',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './emotion-live.component.html',
  styleUrl: './emotion-live.component.css'
})
export class EmotionLiveComponent {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  result: any = null;
  loading = false;

  constructor(private emotionService: EmotionDetectionService) {}

  ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoRef.nativeElement.srcObject = stream;
    });
  }

  captureAndDetect() {
    this.loading = true;

    const canvas = this.canvasRef.nativeElement;
    const video = this.videoRef.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          const file = new File([blob], 'snapshot.png', { type: 'image/png' });
          this.result = await this.emotionService.detectEmotions(file);
        } catch (err) {
          console.error('Erreur de détection :', err);
        } finally {
          this.loading = false;
        }
      }
    }, 'image/png');
  }
}
