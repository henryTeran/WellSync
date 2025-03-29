import { Component } from '@angular/core';
import { EmotionDetectionService } from '../../core/services/emotion-detection.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-emotion-uploader',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './emotion-uploader.component.html',
  styleUrl: './emotion-uploader.component.css'
})
export class EmotionUploaderComponent {
  result: any = null;

  constructor(private emotionService: EmotionDetectionService) {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        this.result = await this.emotionService.detectEmotions(file);
      } catch (error) {
        console.error('Erreur lors de la détection d’émotion :', error);
      }
    }
  }
}
