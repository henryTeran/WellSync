import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { EmotionDetectionService } from '../../core/services/emotion-detection.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { isPlatform, ViewDidEnter } from '@ionic/angular';
import { OpenAiService } from '../../core/services/openia.service';
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MessageTransferService } from '../../core/services/message-transfer.service';

const elementsUI = [
  IonContent,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonButton,
  IonCardContent
]; 


@Component({
  selector: 'app-emotion-live',
  standalone: true,
  imports: [...elementsUI, TitleCasePipe],
  templateUrl: './emotion-live.component.html',
  styleUrl: './emotion-live.component.css'
})
export class EmotionLiveComponent implements ViewDidEnter{
  image: string | undefined;
  emotionResult: any = null;
  recommandationResult: any = null;
  loading = false;
  isMobile = false;
  emotionDetected: string | null = null;

  constructor(
    private emotionService: EmotionDetectionService,
    private openAiService: OpenAiService,
    private router: Router,
    private firestore: Firestore,
    private authservice: AuthService,
    private messageTransferService: MessageTransferService
  ) {}

  ionViewDidEnter() {
    this.startEmotionCapture();
  }

  async startEmotionCapture() {
    this.isMobile = isPlatform('capacitor');
    await this.takePictureAndAnalyze();
  }

  async takePictureAndAnalyze() {
    this.loading = true;
    this.emotionDetected = null;
    this.emotionResult = null;
    this.recommandationResult = null;
  
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
  
      if (image.webPath) {
        this.image = image.webPath;
  
        const blob = await this.urlToBlob(this.image);
        const file = new File([blob], 'photo_emotion.png', { type: 'image/png' });
  
        this.emotionResult = await this.emotionService.detectEmotions(file);
  
        const emotion = this.extractMainEmotion(this.emotionResult);
        this.emotionDetected = emotion;

        console.log("emotion", emotion);
  
        if (emotion) {
          const user = this.authservice.currentUser();
          if(user?.uid) {
            await addDoc(collection(this.firestore, 'emotions'), {
              userId: user.uid,
              emotion: this.emotionResult.faces,
              timestamp: new Date(),
            });
            this.recommandationResult = await this.openAiService.envoyerEmotionEtRecevoirRecommandation(emotion);
            this.messageTransferService.initialMessage = this.recommandationResult
            this.router.navigate(['/app/chat']);
          }
       } else {
          console.warn("Aucune émotion principale détectée.");
        }
      }
    } catch (error) {
      console.error('Erreur lors de l’analyse d’émotion :', error);
    } finally {
      this.loading = false;
    }
  }
  

  private async urlToBlob(webPath: string): Promise<Blob> {
    const response = await fetch(webPath);
    return await response.blob();
  }

  public extractMainEmotion(result: any): string | null {
    if (result?.faces?.length > 0 && result.faces[0].emotion) {
      const emotionMap = result.faces[0].emotion;
      const sorted = Object.entries(emotionMap)
        .sort(([, a], [, b]) => (b as number) - (a as number));
  
      return sorted.length > 0 ? sorted[0][0] : null;
    }
    return null;
  }
}
